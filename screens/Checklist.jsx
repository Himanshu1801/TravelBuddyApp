import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';

const ChecklistScreen = () => {
  const navigation = useNavigation();

  const [title, setTitle] = useState('New Checklist');
  const [items, setItems] = useState([{ text: '', checked: null }]);
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    // This effect will run when the component mounts
    // You can use it to load data or perform other actions
  }, []); // Empty dependency array means this effect runs once

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

  const saveChanges = () => {
    // You can save the changes here, e.g., update a database or store in state
    // For demonstration purposes, we'll just log the changes
    console.log("Title:", title);
    console.log("Items:", items);

    // After saving, navigate back to the home page
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={(text) => setTitle(text)}
        placeholder="Enter checklist title"
      />

      <ScrollView style={styles.itemsContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            {item.checked !== null && (
              <CheckBox
                value={item.checked}
                onValueChange={() => handleItemCheck(index)}
              />
            )}
            <Text style={styles.itemText}>{item.text}</Text>
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
});

export default ChecklistScreen;