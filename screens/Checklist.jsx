import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


const ChecklistScreen = ({ route, navigation }) => {
  // console.log('Checklist route:', route.params)
  const [title, setTitle] = useState(route.params.title || 'New Checklist');
  const [items, setItems] = useState(route.params.items || []);
  const [newItemText, setNewItemText] = useState('');
  const [isTitleModalVisible, setTitleModalVisible] = useState(false);
  const [isItemTextModalVisible, setItemTextModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [collaboratorEmail, setCollaboratorEmail] = useState('');

  useEffect(() => {
    setTitle(title);
  }, [title]);

  useEffect(() => {
    if (route.params.type === 'shared') {
      loadCollaborators();
    }
  }, []);

  const loadCollaborators = async () => {
    try {
      const user = auth().currentUser;
      const checklistRef = firestore()
        .collection('users')
        .doc(user.uid)
        .collection('checklists')
        .doc(title);

      const checklistSnapshot = await checklistRef.get();

      if (checklistSnapshot.exists) {
        const checklistData = checklistSnapshot.data();
        setCollaborators(checklistData.sharedWith || []);
      }
    } catch (error) {
      console.error('Error loading collaborators:', error);
    }
  };

  const addCollaborator = async () => {
    try {
      const user = auth().currentUser;
      const checklistRef = firestore()
        .collection('users')
        .doc(user.uid)
        .collection('checklists')
        .doc(title);

      await checklistRef.update({
        sharedWith: firestore.FieldValue.arrayUnion(collaboratorEmail),
      });

      // Refresh collaborators list
      loadCollaborators();

      
    } catch (error) {
      console.error('Error adding collaborator:', error);
    }
  };

  const removeCollaborator = async (email) => {
    try {
      const user = auth().currentUser;
      const checklistRef = firestore()
        .collection('users')
        .doc(user.uid)
        .collection('checklists')
        .doc(title);

      await checklistRef.update({
        sharedWith: firestore.FieldValue.arrayRemove(email),
      });

      // Refresh collaborators list
      loadCollaborators();
    } catch (error) {
      console.error('Error removing collaborator:', error);
    }
  };

  const toggleTitleModal = () => {
    setTitleModalVisible(!isTitleModalVisible);
  };

  const toggleItemTextModal = (index) => {
    setEditIndex(index);
    setItemTextModalVisible(!isItemTextModalVisible);
  };

  const handleItemCheck = (index) => {
    const updatedItems = [...items];
    updatedItems[index].checked = !updatedItems[index].checked;
    setItems(updatedItems);
  };

  const addNewItem = () => {
    if (newItemText.trim() !== '') {
      const newItem = { text: newItemText, checked: false };
      setItems([...items, newItem]);
      setNewItemText('');
    }
  };

  const updateItemText = () => {
    const updatedItems = [...items];
    updatedItems[editIndex].text = newItemText;
    setItems(updatedItems);
    setItemTextModalVisible(false);
    setEditIndex(null);
  };

  const deleteItem = () => {
    const updatedItems = [...items];
    updatedItems.splice(editIndex, 1);
    setItems(updatedItems);
    setItemTextModalVisible(false);
    setEditIndex(null);
  };

  const saveChanges = async () => {
    const user = auth().currentUser;
    const { type } = route.params;
    console.log('title: ', title);
    await firestore().collection('users').doc(user.uid)
      .collection('checklists').doc(title).set({
        title: title,
        type: type || 'personal',
        items: items,
        sharedWith: collaborators,
      });

    // console.log('Saving changes:', title, type, items);
    // console.log('Saved changes');
    if (route.params.updateCallback) {
      route.params.updateCallback();
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleTitleModal}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>

      {route.params.type === 'shared' && (
        <View>
          {/* Collaborators UI */}
          <Text style={{ color: 'black', fontSize: 18 }}>Collaborators:</Text>
          {collaborators.map((collaborator, index) => (
            <View key={index}>
              <Text style={{ color: 'black' }}>{collaborator}</Text>
              <TouchableOpacity onPress={() => removeCollaborator(collaborator)}>
                <Text style={{ color: 'red' }}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TextInput
            style={styles.input}
            placeholder="Enter collaborator email"
            onChangeText={(text) => setCollaboratorEmail(text)}
          />
          <TouchableOpacity style={styles.addButton} onPress={addCollaborator}>
            <Text style={styles.buttonText}>Add Collaborator</Text>
          </TouchableOpacity>
        </View>
      )}


      <Modal visible={isTitleModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={(text) => setTitle(text)}
            placeholder="Edit checklist title"
          />
          <TouchableOpacity style={styles.editButton} onPress={toggleTitleModal}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <ScrollView style={styles.itemsContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <TouchableOpacity onPress={() => toggleItemTextModal(index)}>
              {item.checked !== null && (
                <CheckBox value={item.checked} onValueChange={() => handleItemCheck(index)} />
              )}
              <Text style={styles.itemText}>{item.text}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.addItemContainer}>
        <TextInput
          style={styles.input}
          value={newItemText}
          onChangeText={(text) => setNewItemText(text)}
          placeholder="Add a new item"
        />
        <TouchableOpacity style={styles.addButton} onPress={addNewItem}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <Modal visible={isItemTextModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            value={newItemText}
            onChangeText={(text) => setNewItemText(text)}
            placeholder="Edit item text"
          />
          <TouchableOpacity style={styles.editButton} onPress={updateItemText}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={deleteItem}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black'
  },
  input: {
    height: 40,
    borderColor: 'lightgrey',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  itemsContainer: {
    flex: 1,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemText: {
    marginLeft: 10,
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'lightgrey',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: 'lightblue',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  editButton: {
    backgroundColor: 'lightgrey',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
});

export default ChecklistScreen;