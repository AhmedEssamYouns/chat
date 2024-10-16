import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot, getDocs, query, where, collection  } from 'firebase/firestore';
import { FIREBASE_AUTH,db } from './config';
import { useState, useEffect } from 'react';


const useFriends = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = FIREBASE_AUTH.currentUser.uid;
        const userDocRef = doc(db, 'users', userId);

        const unsubscribe = onSnapshot(userDocRef, async (docSnapshot) => {
            setLoading(true);
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                const friendsIds = userData.friends || [];

                if (friendsIds.length > 0) {
                    const friendsQuery = query(
                        collection(db, 'users'),
                        where('uid', 'in', friendsIds)
                    );

                    const querySnapshot = await getDocs(friendsQuery);
                    const friendsData = querySnapshot.docs.map(doc => doc.data());
                    setFriends(friendsData);
                } else {
                    setFriends([]); 
                }
            }
            setLoading(false);
        });

        return () => unsubscribe(); 
    }, []);

    return { friends, loading };
};

export default useFriends;


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
        const currentUserRef = doc(db, 'users', currentUserId);

        const friendRef = doc(db, 'users', friendId);

        await updateDoc(currentUserRef, {
            friends: arrayRemove(friendId),
        });

        await updateDoc(friendRef, {
            friends: arrayRemove(currentUserId),
        });

        Alert.alert('Friend Removed', 'You have successfully removed this friend.');
    } catch (error) {
        console.error('Error removing friend:', error);
        Alert.alert('Error', 'There was a problem removing the friend.');
    }
};



export const subscribeToFriends = (userId, setFriends, setLoading) => {
    const userDocRef = doc(db, 'users', userId);

    const unsubscribe = onSnapshot(userDocRef, async (docSnapshot) => {
        setLoading(true);
        if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            const friendsIds = userData.friends || [];

            if (friendsIds.length > 0) {
                const friendsQuery = query(
                    collection(db, 'users'),
                    where('uid', 'in', friendsIds)
                );

                const querySnapshot = await getDocs(friendsQuery);
                const friendsData = querySnapshot.docs.map(doc => doc.data());
                setFriends(friendsData);
            } else {
                setFriends([]); 
            }
        }
        setLoading(false);
    });

    return unsubscribe; 
};

export const acceptFriendRequest = async (currentUserId, requestId) => {
    const userDocRef = doc(db, 'users', currentUserId);
    const targetUserDocRef = doc(db, 'users', requestId);

    await updateDoc(userDocRef, {
        friends: arrayUnion(requestId),
        friendRequestsReceived: arrayRemove(requestId),
    });

    await updateDoc(targetUserDocRef, {
        friends: arrayUnion(currentUserId),
        friendRequestsSent: arrayRemove(currentUserId),
    });
};

export const declineFriendRequest = async (currentUserId, requestId) => {
    const userDocRef = doc(db, 'users', currentUserId);
    const targetUserDocRef = doc(db, 'users', requestId);

    await updateDoc(userDocRef, {
        friendRequestsReceived: arrayRemove(requestId),
    });

    await updateDoc(targetUserDocRef, {
        friendRequestsSent: arrayRemove(currentUserId),
    });
};

export const subscribeToFriendRequests = (currentUserId, setFriendRequests, setUserDetails) => {
    const userDocRef = doc(db, 'users', currentUserId);

    const unsubscribe = onSnapshot(userDocRef, async (docSnapshot) => {
        if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const requests = data.friendRequestsReceived || [];
            setFriendRequests(requests);

            const details = {};
            for (const requestId of requests) {
                const userDocRef = doc(db, 'users', requestId);
                await new Promise((resolve) => {
                    const unsubscribeUser = onSnapshot(userDocRef, (userSnapshot) => {
                        if (userSnapshot.exists()) {
                            details[requestId] = userSnapshot.data();
                            setUserDetails(prevDetails => ({ ...prevDetails, ...details }));
                            resolve();
                        }
                    });
                    return () => unsubscribeUser();
                });
            }
        }
    });

    return unsubscribe; 
};
