import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

const EditPostModal = ({ visible, onClose, postId, existingText, existingImage }) => {
    const navigation = useNavigation();
    const [postText, setPostText] = useState(existingText || '');
    const [selectedImage, setSelectedImage] = useState(existingImage || null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setPostText(existingText);
        setSelectedImage(existingImage);
    }, [existingText, existingImage]);

    const handleUpdate = async () => {
        if (!postText && !selectedImage) {
            alert('Please enter text or upload an image to update the post.');
            return;
        }

        setUploading(true);
        try {
            let imageUrl = selectedImage;

            // Handle image upload
            if (selectedImage && selectedImage !== existingImage) {
                // If the image has changed, delete the old image
                if (existingImage) {
                    const oldImageRef = ref(storage, existingImage);
                    await deleteObject(oldImageRef);
                }
                // Upload new image
                const imageRef = ref(storage, `posts/${Date.now()}`);
                const response = await fetch(selectedImage);
                const blob = await response.blob();
                await uploadBytes(imageRef, blob);
                imageUrl = await getDownloadURL(imageRef);
            }

            // Update post in Firestore
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, {
                text: postText,
                imageUrl,
            });
            setPostText(null)
            setSelectedImage(null)
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post.');
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
                    <View style={{ flexDirection: 'row', justifyContent: "space-between", gap: 20 }}>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Edit Post</Text>
                    </View>
                    <TouchableOpacity onPress={handleUpdate} disabled={uploading || (!postText && !selectedImage)}>
                        <Text style={[styles.postButton, { opacity: uploading || postText || selectedImage ? 1 : 0.5 }]}>
                            {uploading ? 'Updating...' : 'Update'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Text Input */}
                <TextInput
                    style={styles.textInput}
                    placeholder="Update your thoughts..."
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
    title: {
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

export default EditPostModal;
