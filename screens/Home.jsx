import React, { useEffect, useState, useCallback } from 'react';
import { View, Button, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Card from '../components/Card';

const HomeScreen = ({ navigation }) => {

  const [cards, setCards] = useState([]);
  const [currentChecklist, setCurrentChecklist] = useState('personal');

  const getData = async () => {
    const user = auth().currentUser;

    // Check if user document exists in Firestore
    const userChecklistRef = await firestore().collection('users').doc(user.uid).collection('checklists');

    const checklistSnapshot = await userChecklistRef.get();
    const userCards = checklistSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    setCards(userCards);

  };

  useEffect(() => {
    getData();
  }, []);


  const addNewCard = async () => {
    const newCard = { title: 'Untitled', type: currentChecklist };

    // Add new card to Firestore
    const checklistRef = await firestore().collection('users').doc(auth().currentUser.uid)
      .collection('checklists').add({
        title: newCard.title,
        type: newCard.type,
        items: [],
        sharedWith: [],
      });

    setCards((prevCards) => [...prevCards, { ...newCard, id: checklistRef.id }]);
  };

  const deleteCard = async (index) => {
    const cardToDelete = cards[index];

    // Delete card from Firestore
    await firestore().collection('users').doc(auth().currentUser.uid)
      .collection('checklists').where('title', '==', cardToDelete.title).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.delete();
        });
      });

    setCards((prevCards) => {
      const updatedCards = prevCards.filter((card) => card.type === currentChecklist);
      updatedCards.splice(index, 1);
      const newCards = prevCards.filter((card) => card.type !== currentChecklist).concat(updatedCards);
      return newCards;
    });
  };

  const toggleChecklist = (type) => {
    setCurrentChecklist(type);
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await auth().signOut();
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Sign Out Error: ', error);
    }
  };

  const updateCallback = useCallback(() => {
    getData();
  }, []);

  const openChecklist = (title, type, items) => {
    navigation.navigate('Checklist', { title: title, type: type, items: items, updateCallback });
  };



  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Image
          source={{ uri: auth().currentUser?.photoURL }}
          style={styles.userImage}
        />
        <Text style={styles.userName}>
          Hi, {auth().currentUser?.displayName || 'User'}
        </Text>
      </View>


      <TouchableOpacity
        style={styles.signOutButton}
        onPress={signOut}
      >
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.checklistButton, currentChecklist === 'personal' && styles.activeButton]}
          onPress={() => toggleChecklist('personal')}
        >
          <Text style={styles.buttonText}>Personal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.checklistButton, currentChecklist === 'shared' && styles.activeButton]}
          onPress={() => toggleChecklist('shared')}
        >
          <Text style={styles.buttonText}>Shared</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.cardContainer}>
        {cards
          .filter((card) => card.type === currentChecklist)
          .map((card, index) => (
            <Card
              key={index}
              title={card.title}
              onPress={() => openChecklist(card.title, card.type, card.items)}
              onDelete={() => deleteCard(index)}
            />
          ))}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={addNewCard}
      >
        <Text style={styles.addButtonText}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  userInfoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  userImage: {
    width: 50,
    height: 50,
    marginVertical: 10,
    borderRadius: 50
  },
  userName: {
    marginVertical: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    // backgroundColor:'lightgrey',
  },
  cardContainer: {
    backgroundColor: 'lightgrey',
    borderRadius: 8,
    elevation: 6,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    marginHorizontal: 10,
    marginTop: 10,
    padding: 10,
    height: 400,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'lightgrey',
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
  checklistButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  activeButton: {
    backgroundColor: '#6589D0',
  },
  buttonText: {
    color: 'black',
  },
  signOutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FF8080', // Light red color
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  signOutButtonPressed: {
    backgroundColor: '#D9534F', // Darker red color when pressed
  },
  signOutButtonText: {
    color: 'white', // White text color for better visibility
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;