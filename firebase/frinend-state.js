import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { db } from './config';

// Function to handle friend requests and status changes
export const handleStatusChange = async (targetUserId, currentUserId, friendStatuses, setFriendStatuses) => {
    const userDocRef = doc(db, 'users', currentUserId);
    const targetUserDocRef = doc(db, 'users', targetUserId);

    const currentStatus = friendStatuses[targetUserId] || 'Add Friend';

    try {
        if (currentStatus === 'Add Friend') {
            // Send friend request
            await updateDoc(userDocRef, {
                friendRequestsSent: arrayUnion(targetUserId),
            });
            await updateDoc(targetUserDocRef, {
                friendRequestsReceived: arrayUnion(currentUserId),
            });
        } else if (currentStatus === 'Cancel Request') {
            // Cancel friend request
            await updateDoc(userDocRef, {
                friendRequestsSent: arrayRemove(targetUserId),
            });
            await updateDoc(targetUserDocRef, {
                friendRequestsReceived: arrayRemove(currentUserId),
            });
        } else if (currentStatus === 'Accept Request') {
            // Accept friend request
            await updateDoc(userDocRef, {
                friendRequestsReceived: arrayRemove(targetUserId),
                friends: arrayUnion(targetUserId),
            });
            await updateDoc(targetUserDocRef, {
                friendRequestsSent: arrayRemove(currentUserId),
                friends: arrayUnion(currentUserId),
            });
        } else if (currentStatus === 'Unfriend') {
            // Remove friend
            await updateDoc(userDocRef, {
                friends: arrayRemove(targetUserId),
            });
            await updateDoc(targetUserDocRef, {
                friends: arrayRemove(currentUserId),
            });
        }
    } catch (error) {
        console.error('Error updating friend status:', error);
    }
};

// Function to get and monitor the friend status
export const monitorFriendStatuses = (currentUserId, setFriendStatuses) => {
    const userDocRef = doc(db, 'users', currentUserId);

    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const friendStatuses = {};

            data.friendRequestsSent?.forEach((userId) => {
                friendStatuses[userId] = 'Cancel Request';
            });

            data.friendRequestsReceived?.forEach((userId) => {
                friendStatuses[userId] = 'Accept Request';
            });

            data.friends?.forEach((userId) => {
                friendStatuses[userId] = 'Friend';
            });

            setFriendStatuses(friendStatuses);
        }
    });

    return unsubscribe;
};


export const removeFriend = async (friendId, currentUserId) => {
    try {
        // Reference to the current user's document
        const currentUserRef = doc(db, 'users', currentUserId);

        // Reference to the friend's document
        const friendRef = doc(db, 'users', friendId);

        // Update the current user's document to remove the friend's ID
        await updateDoc(currentUserRef, {
            friends: arrayRemove(friendId),
        });

        // Update the friend's document to remove the current user's ID
        await updateDoc(friendRef, {
            friends: arrayRemove(currentUserId),
        });

        Alert.alert('Friend Removed', 'You have successfully removed this friend.');
    } catch (error) {
        console.error('Error removing friend:', error);
        Alert.alert('Error', 'There was a problem removing the friend.');
    }
};