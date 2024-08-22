import { doc, getDoc } from 'firebase/firestore';
import { db } from './config';


export const getUserById = async (userId) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            console.log('No such user!');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};
