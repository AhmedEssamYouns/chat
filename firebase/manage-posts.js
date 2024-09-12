import { deleteDoc, doc } from 'firebase/firestore';
import { db,FIREBASE_AUTH,storage } from './config';
import { ToastAndroid } from 'react-native';
import { sendMessage } from './manage-Chat-room';
import { addDoc, setDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImageManipulator from 'expo-image-manipulator';



export const compressImage = async (uri) => {
    const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Resize to a smaller width
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Adjust quality
    );
    return manipResult.uri;
};

// Function to upload images and return their URLs
export const uploadImages = async (selectedImages) => {
    const imageUrls = await Promise.all(
        selectedImages.map(async (imageUri) => {
            const imageRef = ref(storage, `posts/${Date.now()}`);
            const response = await fetch(imageUri);
            const blob = await response.blob();
            await uploadBytes(imageRef, blob);
            return await getDownloadURL(imageRef);
        })
    );
    return imageUrls;
};

// Function to create a new post
export const createPost = async (postText, selectedImages) => {
    try {
        const imageUrls = await uploadImages(selectedImages);

        const postRef = await addDoc(collection(db, 'posts'), {
            text: postText,
            imageUrls,
            id: FIREBASE_AUTH.currentUser.uid,
            time: new Date().toISOString(),
        });

        await setDoc(doc(db, 'posts', postRef.id), {
            postId: postRef.id,
            text: postText,
            imageUrls,
            id: FIREBASE_AUTH.currentUser.uid,
            time: new Date().toISOString(),
        });

        return { success: true };
    } catch (error) {
        console.error('Error creating post:', error);
        return { success: false, error };
    }
};

// Function to delete a post by its ID
const deletePostById = async (postId) => {
    try {
        // Create a reference to the document with the specified postId
        const postRef = doc(db, 'posts', postId);

        // Delete the document
        await deleteDoc(postRef);
        ToastAndroid.show('Post deleted.', ToastAndroid.LONG);

        console.log(`Post with ID ${postId} deleted successfully.`);
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post.');
    }
};

export default deletePostById;




export const sharePostWithFriends = async (selectedFriends, post, user, onSuccess, onFailure) => {
    if (selectedFriends.length === 0) {
        onFailure('No Friends Selected', 'Please select at least one friend to share the post with.');
        return;
    }

    try {
        for (const friend of selectedFriends) {
            await sendMessage(friend.uid, '', null, post, user); // Share the post with each selected friend
        }
        ToastAndroid.show('Post shared successfully.', ToastAndroid.LONG);
        onSuccess();
    } catch (error) {
        console.error('Error sharing post:', error);
        onFailure('Share Failed', 'There was an error sharing the post. Please try again.');
    }
};
