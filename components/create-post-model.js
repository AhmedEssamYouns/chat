import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, ScrollView, ToastAndroid } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { storage, db } from '../firebase/config';
import { FIREBASE_AUTH } from '../firebase/config';
import { addDoc, doc, setDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getUserById } from '../firebase/getUser';
import * as ImageManipulator from 'expo-image-manipulator';

const CreatePostModal = ({ visible, onClose }) => {
    useEffect(() => {
        // Subscribe to real-time updates
        const unsubscribe = getUserById(FIREBASE_AUTH.currentUser.uid, (userData) => {
            setuser(userData);
        });

        // Cleanup function to stop listening for updates
        return () => unsubscribe();
    }, [FIREBASE_AUTH.currentUser.uid]);

    const navigation = useNavigation();
    const [user, setuser] = useState('');
    const [postText, setPostText] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectionLimit, setSelectionLimit] = useState(4); // Default limit
    useEffect(() => {
        if (selectedImages.length == 3) {
            setSelectionLimit(1);
        } else if (selectedImages.length == 2) {
            setSelectionLimit(2);
        } else if (selectedImages.length == 1) {
            setSelectionLimit(3);
        } else {
            setSelectionLimit(4);
        }
        console.log(selectionLimit)

    }, [selectedImages.length]); // Depend on selectedImages
    const handlePost = async () => {
        
        if (selectedImages.length === 0) {
            alert('Please upload at least one image to post.');
            return;
        }
        setUploading(true);
        try {
            let imageUrls = [];

            // Handle image uploads
            if (selectedImages.length > 0) {
                const uploadPromises = selectedImages.map(async (imageUri) => {
                    const imageRef = ref(storage, `posts/${Date.now()}`);
                    const response = await fetch(imageUri);
                    const blob = await response.blob();
                    await uploadBytes(imageRef, blob);
                    return await getDownloadURL(imageRef);
                });

                imageUrls = await Promise.all(uploadPromises);
            }

            // Create a new document in Firestore to get the auto-generated ID
            const postRef = await addDoc(collection(db, 'posts'), {
                text: postText,
                imageUrls,
                id: FIREBASE_AUTH.currentUser.uid,
                time: new Date().toISOString(),
            });

            // Update the document with the auto-generated ID as postId
            await setDoc(doc(db, 'posts', postRef.id), {
                postId: postRef.id,
                text: postText,
                imageUrls,
                id: FIREBASE_AUTH.currentUser.uid,
                time: new Date().toISOString(),
            });

            setPostText('');
            setSelectedImages([]);
        ToastAndroid.show('snap shared successfully.', ToastAndroid.LONG);

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

    const pickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: true,
            selectionLimit: selectionLimit
        });

        if (!result.canceled) {
            const compressedUris = await Promise.all(
                result.assets.map(async (asset) => await compressImage(asset.uri))
            );
            setSelectedImages((prevImages) => [
                ...prevImages,
                ...compressedUris.slice(0, 4 - prevImages.length) // Ensure total is not more than 4
            ]);
        }
    };

    const cancelImage = (index) => {
        setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
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
                    <TouchableOpacity
                        onPress={handlePost}
                        disabled={uploading || selectedImages.length === 0}
                    >
                        <Text style={[styles.postButton, { opacity: uploading || selectedImages.length > 0 ? 1 : 0.5 }]}>
                            {uploading ? 'Posting...' : 'Post'}
                        </Text>
                    </TouchableOpacity>

                </View>

                {/* Text Input */}
                <TextInput
                    style={styles.textInput}
                    placeholder="Share your story..."
                    placeholderTextColor="#aaa"
                    multiline
                    value={postText}
                    onChangeText={setPostText}
                />

                {/* Display Selected Images */}
                {selectedImages.length > 0 && (
                    <ScrollView style={styles.imageContainer} horizontal>
                        {selectedImages.map((uri, index) => (
                            <View key={index} style={styles.imageWrapper}>
                                <Image source={{ uri }} style={styles.selectedImage} />
                                <TouchableOpacity style={styles.cancelImageButton} onPress={() => cancelImage(index)}>
                                    <AntDesign name="closecircle" size={24} color="white" />
                                    <Text style={styles.cancelImageText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                )}

                {selectedImages.length != 4 && (
                    <TouchableOpacity style={styles.imagePickerIcon} onPress={pickImages}>
                        <AntDesign name="picture" size={28} color="white" />
                    </TouchableOpacity>
                )}
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
        flexDirection: 'row',
        marginTop: 20,
        paddingLeft:10
    },
    imageWrapper: {
        marginRight: 10,
    },
    selectedImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    cancelImageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        backgroundColor: '#333',
        padding: 5,
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
