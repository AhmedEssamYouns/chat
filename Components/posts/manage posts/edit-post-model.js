import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, ScrollView, ToastAndroid } from 'react-native';
import { Feather, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase/config';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

const EditPostModal = ({ item, visible, onClose, postId, existingText, existingImages }) => {
    const navigation = useNavigation();
    const [postText, setPostText] = useState(existingText || '');
    const [selectedImages, setSelectedImages] = useState(item.imageUrls || []);
    const [uploading, setUploading] = useState(false);
    const [selectionLimit, setSelectionLimit] = useState(4);

    useEffect(() => {
        if (selectedImages.length === 3) {
            setSelectionLimit(1);
        } else if (selectedImages.length === 2) {
            setSelectionLimit(2);
        } else if (selectedImages.length === 1) {
            setSelectionLimit(3);
        } else {
            setSelectionLimit(4);
        }
    }, [selectedImages.length]);

    const handleUpdate = async () => {
        if (selectedImages.length === 0 && !postText) {
            alert('Please enter text or upload an image to update the post.');
            return;
        }

        setUploading(true);
        try {
            let imageUrls = [...selectedImages];

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

            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, {
                text: postText,
                imageUrls: imageUrls,
            });
            ToastAndroid.show('Post edited successfully.', ToastAndroid.LONG);

            setPostText('');
            setSelectedImages([]);
            onClose(); 
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
            [{ resize: { width: 800 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
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
                ...compressedUris.slice(0, 4 - prevImages.length) 
            ]);
        }
    };

    const editImage = async (index) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [17, 20],
            quality: 1,
        });

        if (!result.canceled) {
            const compressedUri = await compressImage(result.assets[0].uri);
            setSelectedImages((prevImages) => {
                const updatedImages = [...prevImages];
                updatedImages[index] = compressedUri;
                return updatedImages;
            });
        }
    };

    const cancelImage = (index) => {
        setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={() => {
            onClose();
            setPostText(existingText);
            setSelectedImages(item.imageUrls);
        }}>
            <View style={styles.modalContainer}>
                <View style={styles.topBar}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <TouchableOpacity style={{ padding: 10 }} onPress={onClose}>
                            <Feather name="x" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Edit Post</Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleUpdate}
                        disabled={uploading || (selectedImages.length === 0 && !postText)}
                    >
                        <Text style={[styles.postButton, { opacity: uploading || (selectedImages.length > 0 || postText) ? 1 : 0.5 }]}>
                            {uploading ? 'Updating...' : 'Update'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={styles.textInput}
                    placeholder="Update your story..."
                    placeholderTextColor="#aaa"
                    multiline
                    value={postText}
                    onChangeText={setPostText}
                />

                {selectedImages.length > 0 && (
                    <ScrollView style={styles.imageContainer} horizontal>
                        {selectedImages.map((uri, index) => (
                            <View key={index} style={styles.imageWrapper}>
                                <Image source={{ uri }} style={styles.selectedImage} />
                                <TouchableOpacity style={styles.editImageButton} onPress={() => editImage(index)}>
                                    <MaterialIcons name="edit" size={24} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelImageButton} onPress={() => cancelImage(index)}>
                                    <AntDesign name="closecircle" size={24} color="white" />
                                    <Text style={styles.cancelImageText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                )}

                {selectedImages.length < 4 && (
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
        flexDirection: 'row',
        marginTop: 20,
        paddingLeft: 10,
    },
    imageWrapper: {
        marginRight: 10,
        position: 'relative',
    },
    selectedImage: {
        width: 238,
        height: 280,
        borderRadius: 10,
    },
    editImageButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#333',
        padding: 5,
        borderRadius: 20,
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

export default EditPostModal;
