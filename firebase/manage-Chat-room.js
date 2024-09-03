// services/chatConversationService.js

import { collection, query, onSnapshot, addDoc, Timestamp, doc, updateDoc, deleteDoc, setDoc, orderBy, getDoc, getDocs, where, writeBatch, limit, arrayUnion, arrayRemove } from 'firebase/firestore';
import { FIREBASE_AUTH, db, storage } from '../firebase/config';
import { getDatabase, ref, get } from 'firebase/database';
import { getMessaging, getToken } from "firebase/messaging";
import { uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as w } from 'firebase/storage';
import { ToastAndroid } from 'react-native';




export const fetchUserGroupChats = async () => {
    try {
        const userId = FIREBASE_AUTH.currentUser.uid;
        const groupChatsRef = collection(db, 'groupChats');
        const userGroupChatsQuery = query(groupChatsRef, where('members', 'array-contains', userId));

        const querySnapshot = await getDocs(userGroupChatsQuery);
        const groupChats = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return groupChats;
    } catch (error) {
        console.error('Error fetching group chats:', error);
        throw error;
    }
};


const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const userId = FIREBASE_AUTH.currentUser.uid;
    const imageRef = w(storage, `images/${userId}/${Date.now()}`);

    await uploadBytes(imageRef, blob);
    return getDownloadURL(imageRef);
};
export const deleteChatDocument = async (currentUserId, friendId) => {
    try {
        // Create chatId by sorting the IDs and joining them with an underscore
        const chatId = [currentUserId, friendId].sort().join('_');

        // Reference to the chat document and its messages subcollection
        const chatDocRef = doc(db, 'chats', chatId);
        const messagesRef = collection(db, 'chats', chatId, 'messages');

        // Fetch all messages in the subcollection
        const messagesSnapshot = await getDocs(messagesRef);

        // Delete each message document
        const deleteMessagesPromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deleteMessagesPromises);

        // Delete the chat document
        await deleteDoc(chatDocRef);
        ToastAndroid.show('chat deleted.', ToastAndroid.LONG);

        console.log(`Chat document with ID ${chatId} has been deleted.`);
    } catch (error) {
        console.error('Error deleting chat document:', error);
    }
};


export const fetchMessages = (friendId, callback) => {
    try {
        const userId = FIREBASE_AUTH.currentUser.uid;
        const chatId = [userId, friendId].sort().join('_');
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messagesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(messagesData);
        });

        return () => unsubscribe();
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
};

export const sendMessage = async (friendId, newMessage, imageUrl = null, postShared = null, user = null) => {
    if (newMessage.trim() === '' && !imageUrl && !postShared && !user) return;

    try {
        const userId = FIREBASE_AUTH.currentUser.uid;
        const chatId = [userId, friendId].sort().join('_');
        const messagesRef = collection(db, 'chats', chatId, 'messages');

        const isFriendOnline = await checkIfUserIsOnline(friendId);
        const isFriendInChat = await new Promise((resolve) => {
            const unsubscribe = checkUserInChat(chatId, friendId, (isOnline) => {
                resolve(isOnline);
                unsubscribe();
            });
        });

        let image = null;
        if (imageUrl) {
            image = await uploadImage(imageUrl);
        }

        const wow = isFriendOnline == 1 ? true : false;

        const messageDocRef = await addDoc(messagesRef, {
            senderId: userId,
            receiverId: friendId,
            user: user,
            seen: isFriendInChat && wow,
            deleverd: wow,
            postShared: postShared,
            isEdited: false,
            imageUrl: image,
            text: newMessage,
            timestamp: Timestamp.now(),
        });

        await setDoc(messageDocRef, { id: messageDocRef.id }, { merge: true });

        const chatDocRef = doc(db, 'chats', chatId);
        await setDoc(chatDocRef, {
            receiverId: friendId,
            senderId: userId,
            imageUrl: image,
            postShared: postShared,
            last: postShared != null ? 'shared a post' : newMessage,
            deleverd: wow,
            seen: isFriendInChat && wow,
        }, { merge: true });

        // Cloud Function will handle the notification sending

    } catch (error) {
        console.error('Error sending message:', error);
    }
};



export const editMessage = async (friendId, messageId, newMessage) => {
    if (!messageId || newMessage.trim() === '') return;

    try {
        const userId = FIREBASE_AUTH.currentUser.uid;
        const chatId = [userId, friendId].sort().join('_');
        const chatDocRef = doc(db, 'chats', chatId);
        await updateDoc(chatDocRef, { last: newMessage })
        const messageRef = doc(db, 'chats', chatId, 'messages', messageId);
        await updateDoc(messageRef, { text: newMessage, isEdited: true });
        ToastAndroid.show('messege edited.', ToastAndroid.LONG);

    } catch (error) {
        console.error('Error editing message:', error);
    }
};

export const deleteMessage = async (friendId, messageId) => {
    try {
        const userId = FIREBASE_AUTH.currentUser.uid;
        const chatId = [userId, friendId].sort().join('_');

        // Reference to the chat messages collection
        const messagesRef = collection(db, 'chats', chatId, 'messages');

        // Reference to the chat document
        const chatDocRef = doc(db, 'chats', chatId);

        // Fetch all messages to find the last one
        const messagesQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
        const snapshot = await getDocs(messagesQuery);

        if (!snapshot.empty) {
            // Get the last message
            const lastMessage = snapshot.docs[0].data();

            // Check if the deleted message was the last message
            if (messageId === lastMessage.id) {
                // If it was the last message, update the chat document
                await updateDoc(chatDocRef, {
                    last: 'Messege Deleted' // or any placeholder indicating no recent message
                });
            }
        }

        // Delete the message
        await deleteDoc(doc(db, 'chats', chatId, 'messages', messageId));
        ToastAndroid.show('messege deleted.', ToastAndroid.LONG);

    } catch (error) {
        console.error('Error deleting message:', error);
    }
};

export const checkForNewMessages = async (friendId, callback) => {
    try {
        const userId = FIREBASE_AUTH.currentUser.uid;
        const chatId = [userId, friendId].sort().join('_');
        const chatDocRef = doc(db, 'chats', chatId);

        // Fetch the chat document
        const chatDoc = await getDoc(chatDocRef);

        if (chatDoc.exists()) {
            const chatData = chatDoc.data();

            // Check if the sender is not the current user and the message is unseen
            if (chatData.senderId !== userId && chatData.seen === false) {
                // Trigger the callback to show "New message" indicator
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    } catch (error) {
        console.error('Error checking for new messages:', error);
        callback(false);
    }
};

export const createGroupChat = async (selectedFriends, groupName) => {
    if (selectedFriends.length === 0) return;

    try {
        const userId = FIREBASE_AUTH.currentUser.uid;
        const groupId = `group_${new Date().getTime()}`; // Generate a unique group ID
        const groupChatRef = doc(db, 'groupChats', groupId);

        const members = selectedFriends.map(friend => friend.uid);
        members.push(userId);

        await setDoc(groupChatRef, {
            groupName: groupName,
            members: members,
            createdAt: Timestamp.now(),
        });

        // Optionally, you can also create an initial message or perform additional setup here

        return groupId;

    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
};

export const checkAndUpdateSeenStatus = async (friendId, currentUserId) => {
    const chatId = [currentUserId, friendId].sort().join('_');
    const chatDocRef = doc(db, 'chats', chatId);

    try {
        // Fetch the chat document
        const chatDocSnapshot = await getDoc(chatDocRef);
        if (chatDocSnapshot.exists()) {
            const chatData = chatDocSnapshot.data();

            // Check if the message is from the other user and if it is not yet seen
            if (chatData.senderId !== currentUserId && chatData.seen === false) {
                await updateDoc(chatDocRef, { seen: true });
            }
        }

        // Fetch unseen messages
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const unseenMessagesQuery = query(
            messagesRef,
            where('senderId', '==', friendId), // Messages sent by the friend
            where('seen', '==', false) // Only unseen messages
        );

        const snapshot = await getDocs(unseenMessagesQuery);
        const batch = writeBatch(db);

        snapshot.docs.forEach((doc) => {
            // Update each message to set 'seen' to true
            batch.update(doc.ref, { seen: true });
        });

        await batch.commit();
    } catch (error) {
    }
};


export function trackUnseenMessages(setUnreadMessagesCount) {
    const userId = FIREBASE_AUTH.currentUser.uid;

    const chatCollectionRef = collection(db, 'chats');

    // Fetch all messages where 'seen' is false
    const q = query(chatCollectionRef, where('seen', '==', false));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        // Filter out messages where senderId is the current user
        const filteredMessages = querySnapshot?.docs?.filter(doc => doc.data().receiverId == userId);
        setUnreadMessagesCount(filteredMessages.length);
    });

    return unsubscribe;
}
export const listenToLastMessage = (friendId, callback) => {
    const userId = FIREBASE_AUTH.currentUser.uid;
    const chatId = [userId, friendId].sort().join('_');
    const messagesRef = collection(db, 'chats', chatId, 'messages');

    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));

    return onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            callback({ lastMessage: 'No messages yet', deleverdo: false, seeno: false });
            return;
        }

        const lastMessageDoc = snapshot.docs[0];
        const lastMessageData = lastMessageDoc.data();
        callback({
            lastMessage: lastMessageData.text || 'sent messege',
            deleverdo: lastMessageData.deleverd || false,
            seeno: lastMessageData.seen || false,
            senderId: lastMessageData.senderId || ''
        });
    });
};



export const checkIfUserIsOnline = async (userId) => {
    const db = getDatabase();
    const userStatusDatabaseRef = ref(db, `/status/${userId}`);

    try {
        const snapshot = await get(userStatusDatabaseRef);
        if (snapshot.exists()) {
            const userData = snapshot.val();
            return userData.state == 'online'; // Return true if the user is online
        }
    } catch (error) {
        console.error('Error checking user online status:', error);
        return false; // Return false if there's an error
    }
};

export const updateOnlineStatus = async (friendId, userId) => {
    const chatId = [userId, friendId].sort().join('_');
    const chatDocRef = doc(db, 'chats', chatId);
    await updateDoc(chatDocRef, {
        currentOnline: arrayUnion(userId)
    });
};

export const updateOfflineStatus = async (friendId, userId) => {
    const chatId = [userId, friendId].sort().join('_');
    const chatDocRef = doc(db, 'chats', chatId);
    await updateDoc(chatDocRef, {
        currentOnline: arrayRemove(userId)
    });
};

export const checkUserInChat = (chatId, userId, callback) => {
    const chatDocRef = doc(db, 'chats', chatId);

    // Set up an onSnapshot listener on the chat document
    const unsubscribe = onSnapshot(chatDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const isOnline = data.currentOnline && data.currentOnline.includes(userId);
            callback(isOnline); // Call the callback function with the result
        } else {
            callback(false); // Document does not exist, so user is not online
        }
    });

    // Return the unsubscribe function so the listener can be cleaned up if needed
    return unsubscribe;
};

export const removeUserFromAllChats = async (userId) => {
    try {
        // Query all chat documents where the user is in the 'currentOnline' array
        const chatsRef = collection(db, 'chats');
        const userChatsQuery = query(
            chatsRef,
            where('currentOnline', 'array-contains', userId)
        );

        const querySnapshot = await getDocs(userChatsQuery);

        // Create a batch to update each chat document
        const batch = writeBatch(db);
        const removedChatIds = []; // Array to store removed chat IDs

        querySnapshot.forEach((chatDoc) => {
            const chatDocRef = chatDoc.ref;
            batch.update(chatDocRef, {
                currentOnline: arrayRemove(userId)
            });
            removedChatIds.push(chatDoc.id); // Store the chat ID
        });

        // Commit the batch
        await batch.commit();

        // Store the removed chat IDs
        await storeRemovedChats(userId, removedChatIds);

        console.log(`User ${userId} removed from chats with IDs: ${removedChatIds.join(', ')}`);
        return removedChatIds; // Return the list of removed chat IDs
    } catch (error) {
        console.error('Error removing user from chats:', error);
        throw error; // Optionally rethrow the error to handle it outside this function
    }
};


export const rejoinChats = async (userId, chatIds) => {
    try {
        // Create a batch to update each chat document
        const batch = writeBatch(db);

        for (const chatId of chatIds) {
            const chatDocRef = doc(db, 'chats', chatId);
            batch.update(chatDocRef, {
                currentOnline: arrayUnion(userId) // Add user back to the 'currentOnline' array
            });

            // Also check and update seen status for each chat
            // Assuming the friendId can be derived from chat data or another mechanism
            const chatDocSnapshot = await getDoc(chatDocRef);
            if (chatDocSnapshot.exists()) {
                const chatData = chatDocSnapshot.data();
                if (chatData) {
                    const friendId = chatData.senderId
                    if (friendId) {
                        await checkAndUpdateSeenStatus(friendId, userId);
                    }
                }
            }
        }

        // Commit the batch
        await batch.commit();

        console.log(`User ${userId} rejoined chats with IDs: ${chatIds.join(', ')}`);
    } catch (error) {
        console.error('Error rejoining chats:', error);
        throw error; // Optionally rethrow the error to handle it outside this function
    }
};


export const storeRemovedChats = async (userId, chatIds) => {
    try {
        const removedChatsRef = collection(db, 'removedChats');
        // Store the removed chat IDs with the userId
        const userRemovedChatsRef = doc(removedChatsRef, userId);
        await setDoc(userRemovedChatsRef, { chatIds }, { merge: true });

        console.log(`Stored removed chats for user ${userId}`);
    } catch (error) {
        console.error('Error storing removed chats:', error);
        throw error; // Optionally rethrow the error to handle it outside this function
    }
};

export const getRemovedChats = async (userId) => {
    try {
        const removedChatsRef = collection(db, 'removedChats');
        const userRemovedChatsRef = doc(removedChatsRef, userId);
        const docSnapshot = await getDoc(userRemovedChatsRef);

        if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            return data.chatIds || [];
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error retrieving removed chats:', error);
        throw error; // Optionally rethrow the error to handle it outside this function
    }
};
export const saveTokenToFirestore = async () => {
    const userId = FIREBASE_AUTH.currentUser.uid;
    const token = await getToken(getMessaging());
    if (token) {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, { fcmToken: token }, { merge: true });
    }
};