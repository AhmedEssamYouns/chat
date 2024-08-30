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
            }
        });

        // Listen for network status changes
        netInfoSubscription = NetInfo.addEventListener((state) => {
            if (!state.isConnected) {
                set(userStatusDatabaseRef, isOfflineForDatabase)
            } else {
                set(userStatusDatabaseRef, isOnlineForDatabase)
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
        const isOnline = status && status.state === 'online'; 

        // Update the Firestore document based on the online status
        updateDoc(UserDocRef, {
            online: isOnline,
        }).then(() => {
        }).catch((error) => {
        });

        // Call the callback to update the component state
        if (callback) callback(isOnline);
    });

    // Return the function to unsubscribe
    return unsubscribe;
};