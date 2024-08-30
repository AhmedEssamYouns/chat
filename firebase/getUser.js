import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './config';

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
