
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, ScrollView, ToastAndroid } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { createPost, compressImage} from '../../../firebase/manage-posts';
import { getUserById } from '../../../firebase/getUser';
import { FIREBASE_AUTH } from '../../../firebase/config';


const CreatePostModal = ({ visible, onClose }) => {
    const navigation = useNavigation();
    const [user, setUser] = useState('');
    const [postText, setPostText] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectionLimit, setSelectionLimit] = useState(4);

    useEffect(() => {
        // Subscribe to real-time updates
        const unsubscribe = getUserById(FIREBASE_AUTH.currentUser.uid, (userData) => {
            setUser(userData);
        });

        // Cleanup function to stop listening for updates
        return () => unsubscribe();
    }, [FIREBASE_AUTH.currentUser.uid]);

    useEffect(() => {
        setSelectionLimit(4 - selectedImages.length);
    }, [selectedImages.length]);

    const handlePost = async () => {
        if (selectedImages.length === 0) {
            alert('Please upload at least one image to post.');
            return;
        }
        setUploading(true);
        const result = await createPost(postText, selectedImages);
        setUploading(false);

        if (result.success) {
            setPostText('');
            setSelectedImages([]);
            ToastAndroid.show('Snap shared successfully.', ToastAndroid.LONG);
            navigation.navigate("Tabs", { screen: "profile" });
            onClose();
        } else {
            alert('Failed to create post.');
        }
    };

    const pickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: true,
            selectionLimit,
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

    const cancelImage = (index) => {
        setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.topBar}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <TouchableOpacity style={{ padding: 10 }} onPress={onClose}>
                            <Feather name="x" size={24} color="white" />
                        </TouchableOpacity>
                        <View style={styles.userInfo}>
                            <Image
                                source={{ uri: user.profileImage || 'https://defaultimage.com' }}
                                style={styles.profileImage}
                            />
                            <Text style={styles.username}>{user.username}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handlePost} disabled={uploading || selectedImages.length === 0}>
                        <Text style={[styles.postButton, { opacity: uploading || selectedImages.length > 0 ? 1 : 0.5 }]}>
                            {uploading ? 'Posting...' : 'Post'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={styles.textInput}
                    placeholder="Share your story..."
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
