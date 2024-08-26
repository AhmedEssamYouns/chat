import { doc, updateDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db, FIREBASE_AUTH } from './config';

export const setOnlineStatus = async (isOnline) => {
    const userId = FIREBASE_AUTH.currentUser.uid;
    const userDocRef = doc(db, 'users', userId);

    try {
        // Update the user's online status
        await updateDoc(userDocRef, {
            online: isOnline,
            lastOnline: isOnline ? serverTimestamp() : null,
        });

        if (isOnline) {
            // If the user is online, update the delivered status of messages
            await updateDeliveredMessages(userId);
            await updateDeliveredChats(userId);
        }
    } catch (error) {
        console.error('Error updating online status:', error);
    }
};

const updateDeliveredMessages = async (userId) => {
    try {
        // Query all chat documents
        const chatsRef = collection(db, 'chats');
        const chatsSnapshot = await getDocs(chatsRef);

        // Filter chat IDs that contain the userId
        const chatIds = chatsSnapshot?.docs
            .filter(doc => doc.id.split('_').includes(userId))
            .map(doc => doc.id);

        // Update delivered status for messages in these chats
        for (const chatId of chatIds) {
            const messagesRef = collection(db, 'chats', chatId, 'messages');

            // Query for messages where the current user is the receiver and not yet delivered
            const messagesQuery = query(
                messagesRef,
                where('receiverId', '==', userId),
            );
            const messagesSnapshot = await getDocs(messagesQuery);

            // Update each message's delivered status
            const updatePromises = messagesSnapshot.docs.map((messageDoc) => {
                const messageDocRef = doc(db, 'chats', chatId, 'messages', messageDoc.id);
                return updateDoc(messageDocRef, {
                    deleverd: true,
                });
            });

            const chatRef = doc(db, 'chats', chatId);
            const chatquery = query(
                chatRef,
                where('receiverId', '==', userId),
            );
            const chatSnapshot = await getDocs(chatquery);

            const updatePromises2 = chatSnapshot.docs.map((messageDoc) => {
                const chatDocRef = doc(db, 'chats', chatId);
                return updateDoc(chatDocRef, {
                    deleverd: true,
                });
            });


            await Promise.all(updatePromises,updatePromises2);
        }
    } catch (error) {
        console.error('Error updating delivered messages:', error);
    }
};

const updateDeliveredChats = async (userId) => {
    try {
        // Query all chat documents where the current user is a receiver
        const chatsRef = collection(db, 'chats');
        const chatsQuery = query(chatsRef, where('receiverId', '==', userId));
        const chatsSnapshot = await getDocs(chatsQuery);

        // Update delivered status for each chat document
        const updatePromises = chatsSnapshot.docs.map((chatDoc) => {
            const chatDocRef = doc(db, 'chats', chatDoc.id);
            return updateDoc(chatDocRef, {
                deleverd: true,
            });
        });

        await Promise.all(updatePromises);
    } catch (error) {
        console.error('Error updating delivered chats:', error);
    }
};