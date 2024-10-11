import { collection, query, onSnapshot, addDoc, Timestamp, doc, updateDoc, deleteDoc, setDoc, orderBy, getDoc, getDocs, where, writeBatch, limit, arrayUnion, arrayRemove } from 'firebase/firestore';
import { FIREBASE_AUTH, db, storage } from '../firebase/config';
import { uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as w } from 'firebase/storage';
import { ToastAndroid } from 'react-native';
import { uploadAudio } from './upload_Audio';




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
        const chatId = [currentUserId, friendId].sort().join('_');

        const chatDocRef = doc(db, 'chats', chatId);
        const messagesRef = collection(db, 'chats', chatId, 'messages');

        const messagesSnapshot = await getDocs(messagesRef);

        const deleteMessagesPromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deleteMessagesPromises);

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

export const sendMessage = async (friendId, newMessage, imageUrl = null, audioUrl = null, postShared = null, user = null) => {
    if (newMessage.trim() === '' && !imageUrl && !audioUrl && !postShared && !user) return;

    try {
        const userId = FIREBASE_AUTH.currentUser.uid;
        const chatId = [userId, friendId].sort().join('_');
        const messagesRef = collection(db, 'chats', chatId, 'messages');

        let image = null;
        if (imageUrl) {
            image = await uploadImage(imageUrl);
        }

        let audio = null;
        if (audioUrl) {
            audio = await uploadAudio(audioUrl);
        }

        const messageDocRef = await addDoc(messagesRef, {
            senderId: userId,
            receiverId: friendId,
            user: user,
            postShared: postShared,
            isEdited: false,
            imageUrl: image,        
            audioUrl: audio,       
            text: newMessage,      
            timestamp: Timestamp.now(),
        });

        await setDoc(messageDocRef, { id: messageDocRef.id }, { merge: true });

        const chatDocRef = doc(db, 'chats', chatId);
        await setDoc(chatDocRef, {
            receiverId: friendId,
            senderId: userId,
            imageUrl: image,
            audioUrl: audio,
            seen:false,
            postShared: postShared,
            last: audio != null ? 'shared an audio' : postShared != null ? 'shared a post' : newMessage,
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
        ToastAndroid.show('messege edited.', ToastAndroid.LONG);

    } catch (error) {
        console.error('Error editing message:', error);
    }
};

export const deleteMessage = async (friendId, messageId) => {
    try {
        const userId = FIREBASE_AUTH.currentUser.uid;
        const chatId = [userId, friendId].sort().join('_');

        const messagesRef = collection(db, 'chats', chatId, 'messages');

        const chatDocRef = doc(db, 'chats', chatId);

        const messagesQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
        const snapshot = await getDocs(messagesQuery);

        if (!snapshot.empty) {
            const lastMessage = snapshot.docs[0].data();

            if (messageId === lastMessage.id) {
                await updateDoc(chatDocRef, {
                    last: 'Messege Deleted' 
                });
            }
        }

        await deleteDoc(doc(db, 'chats', chatId, 'messages', messageId));
        ToastAndroid.show('messege deleted.', ToastAndroid.LONG);

    } catch (error) {
        console.error('Error deleting message:', error);
    }
};