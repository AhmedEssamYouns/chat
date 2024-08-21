import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Import Feather icons

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to control password visibility

  const handleSignIn = () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Here you would typically handle authentication
    // For example, by making a request to your authentication API

    Alert.alert('Success', 'Signed in successfully!');
    navigation.navigate('Tabs'); // Navigate to the main screen after sign-in
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={'white'}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={{ color: 'white',width:'80%',paddingLeft:10 }}
            placeholderTextColor={'white'}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible} // Control visibility based on state
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Feather name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgetPassword')}
          style={styles.forgetPasswordLink}
        >
          <Text style={styles.forgetPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#333',
    height: 60,
    color: '#fff',
    padding: 10,
    paddingLeft:20,
    marginBottom: 10,
    borderRadius: 25,
  },
  passwordContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#333',
    height: 60,
    borderRadius: 25,
    marginBottom: 10,
    elevation: 5,
  },
  eyeIcon: {
    marginRight: 10,
  },
  forgetPasswordLink: {
    alignSelf: 'flex-end',
    marginTop: 5,
    marginBottom: 20,
  },
  forgetPasswordText: {
    color: '#BBBBBB',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#f44336',
    padding: 15,
    width: 200,
    alignSelf: 'center',
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20, // Add margin for spacing
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  link: {
    color: '#BBBBBB',
    textAlign: 'center',
    fontSize: 14,
  },
  signupContainer: {
    alignItems: 'center',
  },
});

export default SignInScreen;
