import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { checkUsernameAvailability, handleSignUp } from '../../firebase/auth';

const SignUpScreen = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [usernameStatus, setUsernameStatus] = useState(null); 

    useEffect(() => {
        checkUsernameAvailability(username, setUsernameStatus, setUsernameError);
    }, [username]);

    const handleSignUpClick = () => {
        handleSignUp(
            email,
            password,
            username,
            confirmPassword,
            usernameStatus,
            navigation,
            setLoading,
            setEmailError,
            setPasswordError,
            setConfirmPasswordError,
            setUsernameError,
           
        );
    };

    return (
        <View style={styles.container}>
            <Text style={{ color: "white", padding: 40, fontSize: 30, alignSelf: 'center' }}>Sign Up</Text>

            <View style={styles.usernameContainer}>
                <TextInput
                    maxLength={12}
                    style={[styles.input, { marginBottom: 10 }]}
                    placeholder="Username"
                    placeholderTextColor={'white'}
                    value={username}
                    onChangeText={(text) => setUsername(text.replace(/\s/g, ''))}
                />
                {usernameStatus === 'available' && username !== '' && (
                    <Feather name="check-circle" size={24} color="green" style={styles.statusIcon} />
                )}
                {usernameStatus === 'taken' && (
                    <Feather name="x-circle" size={24} color="red" style={styles.statusIcon} />
                )}
            </View>
            <Text style={usernameError ? styles.errorText : styles.validationText}>
                {usernameError || 'Username can only contain letters, numbers, and underscores.'}
            </Text>

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Email"
                    placeholderTextColor={'white'}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
            </View>
            <Text style={emailError ? styles.errorText : styles.validationText}>
                {emailError || 'Email must be verified.'}
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
            <Text style={passwordError ? styles.errorText : styles.validationText}>
                {passwordError || 'Password must be at least 8 characters long, include one capital letter, and one number.'}
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
            <Text style={confirmPasswordError ? styles.errorText : styles.validationText}>
                {confirmPasswordError}
            </Text>

            {loading ? (
                <ActivityIndicator size="large" color="#f44336" style={{ marginTop: 20 }} />
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleSignUpClick}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity style={{ paddingTop: 40 }} onPress={() => navigation.navigate('SignIn')}>
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
    input: {
        backgroundColor: '#333',
        height: 50,
        color: '#fff',
        padding: 10,
        marginTop: 10,
        borderRadius: 25,
        flex: 1,
    },
    usernameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIcon: {
        position: 'absolute',
        right: 20,
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
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 10,
        marginVertical: 10,
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
