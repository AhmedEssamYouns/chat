import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const handleChangePassword = () => {
    if (currentPassword === '' || newPassword === '' || confirmNewPassword === '') {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    // Here you would typically handle password change logic
    // For example, by making a request to your authentication API

    Alert.alert('Success', 'Password changed successfully!');
    navigation.navigate('SignIn'); // Navigate back to the sign-in screen after password change
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Current Password"
          placeholderTextColor={'white'}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Feather name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="New Password"
          placeholderTextColor={'white'}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Feather name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Confirm New Password"
          placeholderTextColor={'white'}
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry={!isConfirmPasswordVisible}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
        >
          <Feather name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} size={20} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    height: 60,
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  inputField: {
    color: 'white',
    flex: 1,
  },
  eyeIcon: {
    padding: 10,
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

export default ChangePasswordScreen;
