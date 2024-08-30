import { deleteDoc, doc } from 'firebase/firestore';
import { db } from './config';
import { ToastAndroid } from 'react-native';

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
