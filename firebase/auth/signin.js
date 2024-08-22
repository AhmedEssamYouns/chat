import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../config';

// Function to handle user sign-in
export const handleSignIn = async (email, password, navigation, setEmailError, setPasswordError, setIsLoading) => {
  setEmailError('');
  setPasswordError('');
  setIsLoading(true); // Show the loading indicator

  if (email === '' || password === '') {
    setEmailError('Please fill in all fields.');
    setIsLoading(false); // Hide the loading indicator
    return;
  }

  try {
    await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
    navigation.navigate('Tabs'); // Navigate to the main screen after sign-in
  } catch (error) {
    if (error.code.includes('auth/invalid-email')) {
      setEmailError('Invalid email address.');
    } else if (error.code.includes('auth/wrong-password')) {
      setPasswordError('Incorrect password.');
    } else if (error.code.includes('auth/user-not-found')) {
      setEmailError('User not found.');
    } else {
      const generalError = error.code.replace('auth/', '').replace(/-/g, ' ');
      setEmailError(`Sign in failed, ${generalError}`);
    }
  } finally {
    setIsLoading(false); // Hide the loading indicator
  }
};
