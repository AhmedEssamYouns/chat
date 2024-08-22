import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('John Doe');
    const [bio, setBio] = useState('Fitness enthusiast, Gym lover, and aspiring bodybuilder.');
    const [profileImage, setProfileImage] = useState('https://randomuser.me/api/portraits/men/1.jpg');

    const handleSaveProfile = () => {
        // Handle profile update logic here
        console.log('Profile updated:', { username, bio, profileImage });
        Alert.alert('Success', 'Profile updated successfully!');
        navigation.goBack(); // Go back to the previous screen after saving
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
                <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                />
                <View style={styles.addIconContainer}>
                    <Feather name="plus" size={20} color="white" />
                </View>
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={'white'}
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Bio"
                placeholderTextColor={'white'}
                value={bio}
                onChangeText={setBio}
                multiline
            />

            <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
                <Text style={styles.buttonText}>Save</Text>
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
        right: 0,
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
});

export default EditProfileScreen;
