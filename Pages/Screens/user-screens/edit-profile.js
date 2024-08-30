import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator, ToastAndroid } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, db, storage } from '../../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { checkUsernameAvailability } from '../../../firebase/auth';
import * as ImageManipulator from 'expo-image-manipulator';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [wow, setwow] = useState('');

    const [profileImage, setProfileImage] = useState(null);
    const [initialUsername, setInitialUsername] = useState('');
    const [initialBio, setInitialBio] = useState('');
    const [initialProfileImage, setInitialProfileImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [usernameStatus, setUsernameStatus] = useState(null);
    const [usernameError, setUsernameError] = useState('');

    const currentUser = FIREBASE_AUTH.currentUser;

    useEffect(() => {
        checkUsernameAvailability(username, setUsernameStatus, setUsernameError);
    }, [username]);

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUsername(userData.username || '');
                    setBio(userData.bio || '');
                    setProfileImage(userData.profileImage || null); // Default to null if no image is set

                    // Set initial values
                    setInitialUsername(userData.username || '');
                    setInitialBio(userData.bio || '');
                    setInitialProfileImage(userData.profileImage || null);
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to load profile data.');
            } finally {
                setIsLoading(false);
            }
        };

        loadUserProfile();
    }, []);

    const compressImage = async (uri) => {
        const manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 800 } }], // Resize to a smaller width
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Adjust quality
        );
        return manipResult.uri;
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const compressedUri = await compressImage(result.assets[0].uri);
            setProfileImage(compressedUri);
        }
    };

    const handleSaveProfile = async () => {
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (username.includes(' ')) {
            setUsernameError('Username should not contain spaces.');
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

        setIsUpdating(true);

        try {
            const userDocRef = doc(db, 'users', currentUser.uid);

            let updatedProfileImageUrl = profileImage;

            if (profileImage && !profileImage.startsWith('http')) {
                const imageRef = ref(storage, `profileImages/${currentUser.uid}`);
                const img = await fetch(profileImage);
                const bytes = await img.blob();

                await uploadBytes(imageRef, bytes);
                updatedProfileImageUrl = await getDownloadURL(imageRef);
            }

            await updateDoc(userDocRef, {
                username,
                bio,
                profileImage: updatedProfileImageUrl,
            });

            await updateProfile(currentUser, {
                displayName: username,
                photoURL: updatedProfileImageUrl,
            });

            ToastAndroid.show('Profile Updated successfully.', ToastAndroid.LONG);

            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile. Please try again later.');
        } finally {
            setIsUpdating(false);
        }
    };


    const handleChangeText = (text) => {
        const lines = text.split('\n').length
        if (lines <= 5) {
            setBio(text);
        } else {
            ToastAndroid.show('can not add more than 5 lines.', ToastAndroid.LONG);

        }
    };

    // Determine if the save button should be enabled
    const isSaveButtonDisabled =
        username === initialUsername &&
        bio === initialBio &&
        profileImage === initialProfileImage;

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#f44336" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
                <Image
                    source={{ uri: profileImage || 'https://th.bing.com/th/id/OIP.iUYZm2KUP1mKVQ2qtXbnbQHaH_?rs=1&pid=ImgDetMain' }}
                    style={styles.profileImage}
                />
                <View style={styles.addIconContainer}>
                    <Feather name="plus" size={20} color="white" />
                </View>
            </TouchableOpacity>

            <View style={styles.usernameContainer}>
                <TextInput
                    maxLength={20}
                    style={{ color: "white", width: '85%' }}
                    placeholder="Username"
                    placeholderTextColor={'white'}
                    value={username}
                    onChangeText={(text) => setUsername(text.replace(/\s/g, ''))}
                />
                {usernameStatus === 'available' && username !== '' && (
                    <Feather name="check-circle" size={24} color="green" style={styles.statusIcon} />
                )}
                {usernameStatus === 'taken' && username !== currentUser.displayName && (
                    <Feather name="x-circle" size={24} color="red" style={styles.statusIcon} />
                )}
            </View>
            {username !== currentUser.displayName && (
                <Text style={usernameError ? styles.errorText : styles.validationText}>
                    {usernameError || 'Username can only contain letters, numbers, and underscores.'}
                </Text>
            )}
            <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Bio"
                placeholderTextColor={'white'}
                value={bio}
                maxLength={80}
                onChangeText={handleChangeText}
                multiline

            />

            <TouchableOpacity style={styles.button} onPress={handleSaveProfile} disabled={isSaveButtonDisabled || isUpdating}>
                {isUpdating ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Save</Text>
                )}
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
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#333',
    },
    addIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 110,
        backgroundColor: '#f44336',
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: '#333',
        height: 50,
        width: '100%',
        color: '#fff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 25,
    },
    button: {
        backgroundColor: '#f44336',
        padding: 15,
        width: 200,
        alignSelf: 'center',
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    usernameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        height: 50,
        width: '100%',
        borderRadius: 20,
        marginBottom: 10,
        padding: 10,
    },
    statusIcon: {
        position: 'absolute',
        right: 20,
        top: 14,
        marginLeft: 10,
    },
    validationText: {
        color: '#BBBBBB',
        fontSize: 10,
        marginBottom: 5,
        height: 15,
        marginLeft: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 10,
        marginBottom: 5,
        height: 15,
        marginLeft: 10,
    },
});

export default EditProfileScreen;
