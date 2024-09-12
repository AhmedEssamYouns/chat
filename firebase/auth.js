import { 
    createUserWithEmailAndPassword, 
    updateProfile, 
    signInWithEmailAndPassword, 
    updatePassword, 
    sendPasswordResetEmail 
} from 'firebase/auth';

import { 
    doc, 
    setDoc, 
    collection, 
    query, 
    where, 
    getDocs, 
    getDoc, 
    updateDoc 
} from 'firebase/firestore';

import { 
    getDownloadURL, 
    ref, 
    uploadBytes 
} from 'firebase/storage';

import { FIREBASE_AUTH, db, storage } from './config';
import { ToastAndroid } from 'react-native';
import { CommonActions} from '@react-navigation/native';

/**
 * Fetches the user's profile data.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Object>} - The user's profile data.
 */
export const loadUserProfile = async (userId) => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        return userDoc.data();
    }
    throw new Error('Failed to load profile data.');
};

/**
 * Updates the user's profile data.
 * @param {string} userId - The user's ID.
 * @param {Object} profileData - The profile data to update.
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (userId, profileData) => {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, profileData);
};

/**
 * Uploads a profile image and returns its URL.
 * @param {string} imageUri - The URI of the image to upload.
 * @param {string} userId - The user's ID.
 * @returns {Promise<string>} - The URL of the uploaded image.
 */
export const uploadProfileImage = async (imageUri, userId) => {
    const fileName = imageUri.split('/').pop(); // Extract file name from URI
    const imageRef = ref(storage, `profileImages/${userId}/${fileName}`);
    const img = await fetch(imageUri);
    const bytes = await img.blob();

    await uploadBytes(imageRef, bytes);
    return await getDownloadURL(imageRef);
};

/**
 * Updates the Firebase Authentication profile.
 * @param {Object} user - The Firebase user object.
 * @param {Object} profileData - The profile data to update.
 * @returns {Promise<void>}
 */
export const updateAuthProfile = async (user, profileData) => {
    await updateProfile(user, profileData);
};

export const handleLogout = async (navigation) => {
    try {


        await FIREBASE_AUTH.signOut();

        // Reset the navigation stack and navigate to the SignIn screen
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'SignIn' }],
            })
        );
    } catch (error) {
        console.log('Error signing out:', error.message);
    }
};

export const handleForgotPassword = async (email, setEmailError, setIsLoading) => {
    setEmailError('');
    setIsLoading(true); // Show the loading indicator

    if (email === '') {
        setEmailError('Please enter your email address.');
        setIsLoading(false); // Hide the loading indicator
        return;
    }

    try {
        await sendPasswordResetEmail(FIREBASE_AUTH, email);
        setEmailError('Password reset email sent. Please check your inbox.');
    } catch (error) {
        if (error.code.includes('auth/invalid-email')) {
            setEmailError('Invalid email address.');
        } else if (error.code.includes('auth/user-not-found')) {
            setEmailError('User not found.');
        } else {
            setEmailError('Failed to send reset email. Please try again.');
        }
    } finally {
        setIsLoading(false); // Hide the loading indicator
    }
};

// Function to check username availability
export const checkUsernameAvailability = async (username, setUsernameStatus, setUsernameError) => {
    if (username.length >= 3) {
        try {
            const q = query(collection(db, 'users'), where('username', '==', username));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setUsernameStatus('taken');
                setUsernameError('Username is already taken.');
            } else {
                setUsernameStatus('available');
                setUsernameError('');
            }
        } catch (error) {
            setUsernameStatus(null);
            setUsernameError('Error checking username availability.');
        }
    } else {
        setUsernameStatus(null);
        setUsernameError('');
    }
};

// Function to handle user sign-up
export const handleSignUp = async (email, password, username, confirmPassword, usernameStatus, navigation, setLoading, setEmailError, setPasswordError, setConfirmPasswordError, setUsernameError) => {
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

    if (username.includes(' ')) {
        setUsernameError('Username should not contain spaces.');
        return;
    }
    if (username === '' || email === '' || password === '' || confirmPassword === '') {
        setFill('Please fill in all fields.');
        return;
    }

    if (username.length < 3) {
        setUsernameError('Username must be at least 3 characters long.');
        return;
    }

    if (!usernameRegex.test(username)) {
        setUsernameError('Username can only contain letters, numbers, and underscores.');
        return;
    }

    if (!passwordRegex.test(password)) {
        setPasswordError('Password must be at least 8 characters long and include at least one capital letter and one number.');
        return;
    }

    if (password !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match.');
        return;
    }

    if (usernameStatus !== 'available') {
        return; // Exit if username is not available
    }

    setLoading(true);

    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
        const user = userCredential.user;

        // Update the displayName in Firebase Auth
        await updateProfile(user, { displayName: username });

        // Save user data to Firestore
        await setDoc(doc(db, 'users', user.uid), {
            username: username,
            uid: user.uid,
            email: email,
            profileImage: 'https://th.bing.com/th/id/R.4491e84d823cc08ecfb45c4dcd65dbc0?rik=xKmsWMy9Rwkbxg&pid=ImgRaw&r=0', // Empty profile image field since we're not handling images
        });

    } catch (error) {
        if (error.code.includes('auth/invalid-email')) {
            setEmailError('Invalid email address.');
        } else if (error.code.includes('auth/email-already-in-use')) {
            setEmailError('Email is already in use.');
        } else if (error.code.includes('auth/weak-password')) {
            setPasswordError('Password is too weak.');
        } else {
            setEmailError('Failed to create account. Please try again.');
        }
    } finally {
        setLoading(false);
        // Show success message
        ToastAndroid.show('You have successfully signed up!', ToastAndroid.LONG);
        // Navigate to Sign In screen after a delay to allow the toast to be visible
        setTimeout(() => {
            navigation.navigate('SignIn');
        }, 1000); // Adjust the delay to match the toast visibility time
    }
};

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
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Tabs' }],
            })
        );
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

export const handleChangePassword = async (currentPassword, newPassword, setPasswordError, setIsLoading) => {
    setPasswordError('');
    setIsLoading(true); // Show the loading indicator

    if (newPassword === '') {
        setPasswordError('Please enter your new password.');
        setIsLoading(false); // Hide the loading indicator
        return;
    }

    if (newPassword.length < 8) {
        setPasswordError('Password must be at least 8 characters long.');
        setIsLoading(false); // Hide the loading indicator
        return;
    }

    try {
        const user = FIREBASE_AUTH.currentUser;
        await updatePassword(user, newPassword);
        setPasswordError('Password updated successfully.');
    } catch (error) {
        if (error.code.includes('auth/requires-recent-login')) {
            setPasswordError('You need to sign in again before changing your password.');
        } else {
            setPasswordError('Failed to update password. Please try again.');
        }
    } finally {
        setIsLoading(false); // Hide the loading indicator
    }
};
