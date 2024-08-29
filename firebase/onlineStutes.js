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
            await updateDeliveredChats(userId);
        }
    } catch (error) {
        console.error('Error updating online status:', error);
    }
};

export const updateDeliveredMessages = async (userId) => {
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



            await Promise.all(updatePromises);
        }
        updateDeliveredField(db, userId);

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

const updateDeliveredField = async (db, userId) => {
    // Reference to the collection
    const chatsRef = collection(db, 'chats');
  
    // Create a query to find documents where receiverId matches userId
    const q = query(chatsRef, where('receiverId', '==', userId));
  
    // Fetch documents matching the query
    const chatSnapshot = await getDocs(q);
  
    // Create an array of update promises
    const updatePromises = chatSnapshot.docs.map((chatDoc) => {
      const chatDocRef = doc(db, 'chats', chatDoc.id); // Use chatDoc.id to get the document reference
      return updateDoc(chatDocRef, { deleverd: true }); // Correct the field name from 'deleverd' to 'delivered'
    });
  
    // Wait for all updates to complete
    await Promise.all(updatePromises);
  
    console.log('All matching documents updated');
  };