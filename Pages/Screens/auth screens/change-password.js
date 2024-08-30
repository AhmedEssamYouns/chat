import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { handleChangePassword } from '../../../firebase/auth'; // Import the handleChangePassword function

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (currentPassword === '' || newPassword === '' || confirmNewPassword === '') {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    await handleChangePassword(currentPassword, newPassword, setPasswordError, setIsLoading);

    if (passwordError === '') {
      Alert.alert('Success', 'Password changed successfully!');
      navigation.navigate('SignIn'); // Navigate back to the sign-in screen after password change
    } else {
      Alert.alert('Error', passwordError);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Current Password"
          placeholderTextColor="white"
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
          placeholderTextColor="white"
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
          placeholderTextColor="white"
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

      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handlePasswordChange} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Change Password</Text>
        )}
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  link: {
    color: '#BBBBBB',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ChangePasswordScreen;
