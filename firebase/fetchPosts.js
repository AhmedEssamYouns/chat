import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from './config';

/**
 * Fetch user posts in real-time using onSnapshot.
 * @param {string} userId - The ID of the user whose posts you want to fetch.
 * @param {function} callback - A callback function that will be called with the new posts data whenever it changes.
 */
export const fetchUserPostsRealtime = (userId, callback) => {
    try {
        const postsRef = collection(db, 'posts');
        const q = query(
            postsRef,
            where('id', '==', userId),
            orderBy('time', 'desc') // Order posts by time in descending order
        );

        // Set up a real-time listener
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const posts = querySnapshot.docs.map(doc => doc.data());

            // Extract the first image URL from each post
            const postImages = posts.map(post => post.imageUrls); // Assuming `imageUrls` is an array
            
            // Call the callback function with the new posts data
            callback(postImages);
        });

        // Return the unsubscribe function so that the listener can be removed when no longer needed
        return unsubscribe;
    } catch (error) {
        console.error('Error setting up real-time listener for user posts:', error);
        return () => {}; // Return a no-op function as a fallback
    }
};
