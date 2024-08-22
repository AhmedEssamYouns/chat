import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, Pressable } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const CreatePostModal = ({ visible, onClose }) => {
    const navigation = useNavigation();
    const [postText, setPostText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    const handlePost = () => {
        if (postText || selectedImage) {
            // Handle post submission logic here
            console.log('Post content:', { postText, selectedImage });
            // After posting, navigate to the Stories tab screen
            navigation.navigate("Tabs", { screen: "thoughts" });
            onClose(); // Close the modal
        } else {
            alert('Please enter text or upload an image to post.');
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const cancelImage = () => {
        setSelectedImage(null); // Clear the selected image
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false}
            onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                {/* Top Bar */}
                <View style={styles.topBar}>
                    <View style={{flexDirection:'row',
                        alignItems:'center',
                        gap:20
                    }}>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color="white" />
                        </TouchableOpacity>
                        <View style={styles.userInfo}>
                            <Image
                                source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                                style={styles.profileImage}
                            />
                            <Text style={styles.username}>John Doe</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handlePost} disabled={!postText && !selectedImage}>
                        <Text style={[styles.postButton, { opacity: postText || selectedImage ? 1 : 0.5 }]}>
                            Post
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Text Input */}
                <TextInput
                    style={styles.textInput}
                    placeholder="Share your thougths.."
                    placeholderTextColor="#aaa"
                    multiline
                    value={postText}
                    onChangeText={setPostText}
                />

                {/* Display Selected Image */}
                {selectedImage && (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                        <TouchableOpacity style={styles.cancelImageButton} onPress={cancelImage}>
                            <AntDesign name="closecircle" size={24} color="white" />
                            <Text style={styles.cancelImageText}>Cancel Image</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {!selectedImage &&
                    <TouchableOpacity style={styles.imagePickerIcon} onPress={pickImage}>
                        <AntDesign name="picture" size={28} color="white" />
                    </TouchableOpacity>
                }
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#121212',
        paddingTop: 40,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        marginRight: 10,
    },
    username: {
        color: 'white',
        fontSize: 16,
    },
    postButton: {
        color: '#f44336',
        fontWeight: 'bold',
        fontSize: 16,
    },
    textInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
        color: 'white',
        fontSize: 16,
        textAlignVertical: 'top',
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    selectedImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    cancelImageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 20,
    },
    cancelImageText: {
        color: 'white',
        marginLeft: 5,
    },
    imagePickerIcon: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 30,
    },
});

export default CreatePostModal;
