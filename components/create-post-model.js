import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { storage, db } from '../firebase/config';
import { FIREBASE_AUTH } from '../firebase/config';
import { addDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection } from 'firebase/firestore';
import { getUserById } from '../firebase/getUser';
import * as ImageManipulator from 'expo-image-manipulator';

const CreatePostModal = ({ visible, onClose }) => {
    useEffect(() => {
        const fetchUserDetails = async () => {
            const userData = await getUserById(FIREBASE_AUTH.currentUser.uid);
            setuser(userData)
        }
        fetchUserDetails();
    }, [FIREBASE_AUTH.currentUser.uid]);


    const navigation = useNavigation();
    const [user, setuser] = useState('');
    const [postText, setPostText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handlePost = async () => {
        if (!postText && !selectedImage) {
            alert('Please enter text or upload an image to post.');
            return;
        }

        setUploading(true);
        try {
            let imageUrl = '';

            // Handle image upload
            if (selectedImage) {
                const imageRef = ref(storage, `posts/${Date.now()}`);
                const response = await fetch(selectedImage);
                const blob = await response.blob();
                await uploadBytes(imageRef, blob);
                imageUrl = await getDownloadURL(imageRef);
            }

            // Create a new document in Firestore to get the auto-generated ID
            const postRef = await addDoc(collection(db, 'posts'), {
                text: postText,
                imageUrl,
                id: FIREBASE_AUTH.currentUser.uid,
                time: new Date().toISOString()
            });

            // Update the document with the auto-generated ID as postId
            await setDoc(doc(db, 'posts', postRef.id), {
                postId: postRef.id,
                text: postText,
                imageUrl,
                id: FIREBASE_AUTH.currentUser.uid,
                time: new Date().toISOString(),
            });
            setPostText(null)
            setSelectedImage(null)
            // Navigate to the Stories tab screen
            navigation.navigate("Tabs", { screen: "profile" });
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post.');
        } finally {
            setUploading(false);
        }
    };



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
            aspect: [4, 3],
            quality: 1,
        });


        if (!result.canceled) {
            const compressedUri = await compressImage(result.assets[0].uri);

            setSelectedImage(compressedUri);
        }
    };


    const cancelImage = () => {
        setSelectedImage(null); // Clear the selected image
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                {/* Top Bar */}
                <View style={styles.topBar}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <TouchableOpacity style={{ padding: 10 }} onPress={onClose}>
                            <Feather name="x" size={24} color="white" />
                        </TouchableOpacity>
                        <View style={styles.userInfo}>
                            <Image
                                source={{ uri: user.profileImage || 'https://th.bing.com/th/id/R.4491e84d823cc08ecfb45c4dcd65dbc0?rik=xKmsWMy9Rwkbxg&pid=ImgRaw&r=0' }}
                                style={styles.profileImage}
                            />
                            <Text style={styles.username}>{user.username}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handlePost} disabled={uploading || (!postText && !selectedImage)}>
                        <Text style={[styles.postButton, { opacity: uploading || postText || selectedImage ? 1 : 0.5 }]}>
                            {uploading ? 'Posting...' : 'Post'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Text Input */}
                <TextInput
                    style={styles.textInput}
                    placeholder="Share your thoughts..."
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
        paddingTop: 20,
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
