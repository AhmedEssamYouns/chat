// services/chatConversationService.js

import { collection, query, onSnapshot, addDoc, Timestamp, doc, updateDoc, deleteDoc, setDoc, orderBy, getDoc, getDocs, where, writeBatch, limit, arrayUnion, arrayRemove } from 'firebase/firestore';
import { FIREBASE_AUTH, db } from '../firebase/config';
import { useState, useEffect } from 'react';
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

export const sendMessage = async (friendId, newMessage) => {
    if (newMessage.trim() === '') return;

    try {
        const userId = FIREBASE_AUTH.currentUser.uid;
        const chatId = [userId, friendId].sort().join('_');
        const messagesRef = collection(db, 'chats', chatId, 'messages');

        // Check if the friend is online
        const isFriendOnline = await checkIfUserIsOnline(friendId);

        const isFriendInChat = await new Promise((resolve) => {
            const unsubscribe = checkUserInChat(chatId, friendId, (isOnline) => {
                resolve(isOnline);
                unsubscribe(); // Clean up listener after getting the status
            });
        });
        const wow = isFriendOnline == 1 ? true : false
        console.log(wow)
        console.log(isFriendInChat)
        // Add the message
        const messageDocRef = await addDoc(messagesRef, {
            senderId: userId,
            receiverId: friendId,
            seen: isFriendInChat,
            deleverd: wow, // Set based on online status
            isEdited: false,
            text: newMessage,
            timestamp: Timestamp.now(),
        });

        // Update the message with its ID
        await setDoc(messageDocRef, {
            id: messageDocRef.id,
        }, { merge: true });

        // Update the chat document
        const chatDocRef = doc(db, 'chats', chatId);
        await setDoc(chatDocRef, {
            receiverId: friendId,
            senderId: userId,
            deleverd: wow, // Set based on online status
            last: newMessage,
            seen: isFriendInChat
        }, { merge: true });

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
                console.log("Chat message marked as seen.");
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
        console.log("All unseen messages updated to seen.");
    } catch (error) {
        console.error("Error updating seen status:", error);
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
            lastMessage: lastMessageData.text || 'No messages yet',
            deleverdo: lastMessageData.deleverd || false,
            seeno: lastMessageData.seen || false,
            senderId: lastMessageData.senderId || ''
        });
    });
};

export const monitorUserOnlineStatus = (currentUserId) => {
    const userDocRef = doc(db, 'users', receiverId); // Monitor the receiver's status

    // Listen for online status changes of the receiver
    const unsubscribe = onSnapshot(userDocRef, async (docSnapshot) => {
        if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            const isOnline = userData.online;

            if (isOnline) {
                await updateDeliveredMessages(currentUserId);
            }
        }
    });

    // Optionally return the unsubscribe function for cleanup
    return unsubscribe;
};

export const checkIfUserIsOnline = async (userId) => {
    const userDocRef = doc(db, 'users', userId);

    try {
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            return userData.online; // Return the online status (true or false)
        }
    } catch (error) {
        console.error('Error checking user online status:', error);
        return false; // Return false if there's an error
    }
};
const updateDeliveredMessages = async (receiverId) => {
    try {
        const chatsRef = collection(db, 'chats');
        const undeliveredMessagesQuery = query(
            chatsRef,
            where('receiverId', '==', receiverId), // Messages received by the user
            where('delivered', '==', false) // Only undelivered messages
        );

        const snapshot = await getDocs(undeliveredMessagesQuery);

        if (!snapshot.empty) {
            const batch = writeBatch(db);

            snapshot.forEach((doc) => {
                // Update each message to set 'delivered' to true
                batch.update(doc.ref, { delivered: true });
            });

            await batch.commit();
        }
    } catch (error) {
        console.error("Error updating delivered status: ", error);
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