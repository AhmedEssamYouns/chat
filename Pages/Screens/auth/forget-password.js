import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (email === '') {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    // Here you would typically handle password reset logic
    // For example, by sending a password reset link to the email

    Alert.alert('Success', 'Password reset link sent to your email.');
    navigation.navigate('SignIn'); // Navigate back to the sign-in screen after reset
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor={'white'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.link}>Back to Sign In</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
    borderRadius: 25,
  },
  button: {
    backgroundColor: '#f44336',
    padding: 15,
    width: 200,
    alignSelf: 'center',
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  link: {
    color: '#BBBBBB',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ForgotPasswordScreen;
