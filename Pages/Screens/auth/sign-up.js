import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    const handleSignUp = () => {
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

        if (username === '' || email === '' || password === '' || confirmPassword === '') {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (!usernameRegex.test(username)) {
            Alert.alert('Error', 'Username can only contain letters, numbers, and underscores.');
            return;
        }

        if (!passwordRegex.test(password)) {
            Alert.alert(
                'Error',
                'Password must be at least 8 characters long and include at least one capital letter and one number.'
            );
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('SignIn');
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
            {/* Profile Image Section */}
            <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
                <Image
                    source={profileImage ? { uri: profileImage } : { uri: 'https://cdn.iconscout.com/icon/free/png-512/avatar-375-456327.png' }}
                    style={styles.profileImage}
                />
                <View style={styles.addIconContainer} >
                    <Feather name="plus" size={20} color="white" />
                </View>
            </TouchableOpacity>


            <TextInput
                style={[styles.input, { marginBottom: 10 }]}
                placeholder="Username"
                placeholderTextColor={'white'}
                value={username}
                onChangeText={setUsername}
            />
            <Text style={styles.validationText}>
                Username can only contain letters, numbers, and underscores.
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={'white'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <Text style={[styles.validationText, { marginTop: 10 }]}>
                Email must be verfied.
            </Text>

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
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
            <Text style={styles.validationText}>
                at least 8 characters long, include one capital letter, and one number.
            </Text>

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholderTextColor={'white'}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!isConfirmPasswordVisible}
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                >
                    <Feather name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} size={20} color="white" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{paddingTop:40}} onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.link}>Already have an account? Sign In</Text>
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
        color: '#fff',
        padding: 10,
        marginTop: 10, // Uniform margin between inputs
        borderRadius: 25,
    },
    validationText: {
        color: '#BBBBBB',
        fontSize: 10,
        marginBottom: 5,
        height: 15,
        marginLeft: 10,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 10,
        marginVertical: 10, // Uniform margin between inputs
    },
    passwordInput: {
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
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    link: {
        color: '#BBBBBB',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default SignUpScreen;
