import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './config';
import { collection, query, where, getDocs } from 'firebase/firestore';

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


