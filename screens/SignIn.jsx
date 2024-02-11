import React, { useEffect } from 'react';
import { Alert, View, Text, Image, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';

const SignIn = ({ navigation }) => {

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: process.env.WEB_CLIENT_ID,
        });
    }, []);

    const onGoogleButtonPress = async () => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const { idToken, user } = await GoogleSignin.signIn();

            Alert.alert('Logged in', `Hi ${user.name}!`);
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            await auth().signInWithCredential(googleCredential);
            return true;  // Indicate success
        } catch (error) {
            console.error('Google Sign-In Error: ', error);
            return false;  // Indicate failure
        }
    };

    const handleSignIn = async () => {
        const success = await onGoogleButtonPress();
        if (success) {
            console.log('Signed in with Google!');
            navigation.navigate('Home');
        } else {
            console.log('Failed to sign in with Google.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome to Travel Buddy!</Text>
            <Image source={require('../assets/plane.png')} style={styles.logo} />
            <GoogleSigninButton
                style={styles.googleButton}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={handleSignIn}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color:'black'
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    googleButton: {
        width: 192,
        height: 48,
    },
});

export default SignIn;