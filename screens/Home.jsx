import React, { useEffect, useState } from 'react';
import { View, Button, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Card from '../components/Card';


const HomeScreen = ({ navigation }) => {

  const getData = async () => {
    const user = auth().currentUser;
    console.log('User data:', user.displayName, user.photoURL);
  };


  useEffect(() => {
    getData();
  }, [])


  const [cards, setCards] = useState([
    { title: 'Untitled', type: '' },
  ]);
  const [currentChecklist, setCurrentChecklist] = useState('personal');

  const addNewCard = () => {
    const newCard = { title: 'Untitled', type: currentChecklist };
    setCards([...cards, newCard]);
  };

  const toggleChecklist = (type) => {
    setCurrentChecklist(type);
  };

  const deleteCard = (index) => {
    // console.log('deleteCard', index);
    // alert(`Deleting card number ${index + 1}`);
    setCards((prevCards) => {
      const updatedCards = prevCards.filter((card) => card.type === currentChecklist);
      updatedCards.splice(index, 1);

      const newCards = prevCards.filter((card) => card.type !== currentChecklist).concat(updatedCards);

      return newCards;
    });
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await auth().signOut();
      navigation.navigate('SignIn'); // Redirect to the sign-in screen after signing out
    } catch (error) {
      console.error('Sign Out Error: ', error);
    }
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
              onPress={() => navigation.navigate('Checklist', { title: card.title })}
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