import NetInfo from '@react-native-community/netinfo';
import { getDatabase, ref, onDisconnect, set, onValue } from 'firebase/database';
import { FIREBASE_AUTH } from './config';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { db as hi } from './config';
let netInfoSubscription;

export const trackUserPresence = () => {
    const db = getDatabase();
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
        const userStatusDatabaseRef = ref(db, `/status/${user.uid}`);

        const isOfflineForDatabase = {
            state: 'offline',
            last_changed: Date.now(),
        };

        const isOnlineForDatabase = {
            state: 'online',
            last_changed: Date.now(),
        };

        const connectedRef = ref(db, '.info/connected');
        const userDocRef = doc(hi, 'users', FIREBASE_AUTH.currentUser.uid);

        onValue(connectedRef, (snapshot) => {
            if (snapshot.val() === true) {
                set(userStatusDatabaseRef, isOnlineForDatabase)
                .then(() => updateDoc(userDocRef, {
                    online: true,
                }))

                onDisconnect(userStatusDatabaseRef).set(isOfflineForDatabase)
            } else {
                set(userStatusDatabaseRef, isOfflineForDatabase)
                    .then(() => console.log('Status set to offline (disconnected from Firebase).'));
            }
        });

        // Listen for network status changes
        netInfoSubscription = NetInfo.addEventListener((state) => {
            if (!state.isConnected) {
                set(userStatusDatabaseRef, isOfflineForDatabase)
                    .then(() => console.log('Status set to offline due to network disconnect.'));
            } else {
                set(userStatusDatabaseRef, isOnlineForDatabase)
                    .then(() => console.log('Status set to online due to network reconnect.'));
            }
        });
    }

    return () => {
        if (netInfoSubscription) {
            netInfoSubscription();
        }
    };
};

// Function to subscribe to user's online status
export const subscribeToUserOnlineStatus = (userId, callback) => {
    const db = getDatabase();
    const userStatusRef = ref(db, `/status/${userId}`);
    const UserDocRef = doc(hi, 'users', userId);

    // Listen for real-time updates
    const unsubscribe = onValue(userStatusRef, (snapshot) => {
        const status = snapshot.val();
        console.log('Retrieved status:', status); // Debugging line
        const isOnline = status && status.state === 'online'; 
        console.log(`User is ${isOnline ? 'online' : 'offline'}`); // Debugging line

        // Update the Firestore document based on the online status
        updateDoc(UserDocRef, {
            online: isOnline,
        }).then(() => {
            console.log(`User document updated. User is now ${isOnline ? 'online' : 'offline'}.`);
        }).catch((error) => {
            console.error('Error updating Firestore document:', error);
        });

        // Call the callback to update the component state
        if (callback) callback(isOnline);
    });

    // Return the function to unsubscribe
    return unsubscribe;
};