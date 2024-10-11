import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { handleSignIn } from '../../../firebase/auth';
const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignInClick = () => {
    handleSignIn(email, password, navigation, setEmailError, setPasswordError, setIsLoading);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={{ color: 'white', width: '99%'}}
            placeholder="Email"
            placeholderTextColor={'white'}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={{ color: 'white', width: '80%', paddingLeft: 10 }}
            placeholderTextColor={'white'}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Feather name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="white" />
          </TouchableOpacity>
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgetPassword')}
          style={styles.forgetPasswordLink}
        >
          <Text style={styles.forgetPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#f44336" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSignInClick}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      )}
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
    paddingLeft: 20,
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
    marginBottom: 20, 
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 20,
    marginBottom: 5,
  },
  loader: {
    marginHorizontal: 20,
    paddingBottom: 20,
    alignSelf: 'center',
  },
});

export default SignInScreen;
