import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, db } from './config';
import { CommonActions } from '@react-navigation/native';
import { setOnlineStatus } from './onlineStutes';
import { updatePassword } from 'firebase/auth';
import { sendPasswordResetEmail } from 'firebase/auth';




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
            online:true,
            email: email,
            profileImage: 'https://th.bing.com/th/id/R.4491e84d823cc08ecfb45c4dcd65dbc0?rik=xKmsWMy9Rwkbxg&pid=ImgRaw&r=0', // Empty profile image field since we're not handling images
        });

        navigation.navigate('SignIn');
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
        await setOnlineStatus(true);
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
