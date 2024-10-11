import { collection, query, where, onSnapshot, orderBy,doc } from 'firebase/firestore';
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
            orderBy('time', 'desc') 
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const posts = querySnapshot.docs.map(doc => doc.data());

            const postImages = posts.map(post => post.imageUrls);
            
            callback(postImages);
        });

        return unsubscribe;
    } catch (error) {
        console.error('Error setting up real-time listener for user posts:', error);
        return () => {}; 
    }
};

export const fetchPostById = (postId, callback) => {
    const postDocRef = doc(db, 'posts', postId);
  
    const unsubscribe = onSnapshot(postDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const postData = docSnapshot.data();
        callback(postData);
      } else {
        console.log('No such post!');
      }
    });
  
    return unsubscribe;
  };