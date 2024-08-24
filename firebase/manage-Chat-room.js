// services/chatConversationService.js

import { collection, query, onSnapshot, addDoc, Timestamp, doc, updateDoc, deleteDoc, setDoc, orderBy } from 'firebase/firestore';
import { FIREBASE_AUTH, db } from '../firebase/config';

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

        // Add the message document and get the document reference
        const messageDocRef = await addDoc(messagesRef, {
            senderId: userId,
            receiverId: friendId,
            text: newMessage,
            timestamp: Timestamp.now(),
        });

        // Update the document with the ID (document ID is the message ID)
        await setDoc(messageDocRef, {
            id: messageDocRef.id, // Add the document ID to the message
        }, { merge: true });

        // Update the chat document with the last message
        const chatDocRef = doc(db, 'chats', chatId);
        await setDoc(chatDocRef, {
            user1: userId,
            user2: friendId,
            last: newMessage,
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
        const messageRef = doc(db, 'chats', chatId, 'messages', messageId);
        await updateDoc(messageRef, { text: newMessage });
    } catch (error) {
        console.error('Error editing message:', error);
    }
};

export const deleteMessage = async (friendId, messageId) => {
    try {
        const userId = FIREBASE_AUTH.currentUser.uid;
        const chatId = [userId, friendId].sort().join('_');
        await deleteDoc(doc(db, 'chats', chatId, 'messages', messageId));
    } catch (error) {
        console.error('Error deleting message:', error);
    }
};
