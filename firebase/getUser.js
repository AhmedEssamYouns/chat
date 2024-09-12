import { doc, onSnapshot } from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './config';
// profileBackend.js
/**
 * Subscribes to real-time updates for a user's document.
 * 
 */
export const getUserById = (userId, callback) => {
    try {
        const userDocRef = doc(db, 'users', userId);

        // Subscribe to real-time updates
        const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.data());
            } else {
                callback(null);
            }
        }, (error) => {
            callback(null); // Optionally handle errors by setting a default state or notifying the user
        });

        // Return the unsubscribe function to stop listening for updates
        return unsubscribe;
    } catch (error) {
        throw error;
    }
};


export const fetchUsers = async (currentUserId) => {
    try {
        const q = query(collection(db, 'users'), where('uid', '!=', currentUserId));
        const querySnapshot = await getDocs(q);
        const userList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return userList;
    } catch (error) {
        console.error("Error fetching users: ", error);
        return [];
    }
};

// profileBackend.js

// Fetch user data
export const fetchUserData = (userId, setUserProfile) => {
    const userDocRef = doc(db, 'users', userId);
    const unsubscribeUser = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setUserProfile((prevProfile) => ({
                ...prevProfile,
                id: userId,
                name: userData.username,
                avatar: userData.profileImage || 'https://th.bing.com/th/id/R.4491e84d823cc08ecfb45c4dcd65dbc0?rik=xKmsWMy9Rwkbxg&pid=ImgRaw&r=0',
                bio: userData.bio,
                friends: userData.friends?.length,
            }));
        }
    });
    return unsubscribeUser;
};

// Fetch user posts
export const fetchUserPosts = (userId, setUserProfile) => {
    const postsRef = collection(db, 'posts');
    const postsQuery = query(postsRef, where('id', '==', userId));

    const unsubscribePosts = onSnapshot(postsQuery, (querySnapshot) => {
        const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserProfile(prevProfile => ({
            ...prevProfile,
            posts,
        }));
    });

    return unsubscribePosts;
};
