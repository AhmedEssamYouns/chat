// services/chatService.js

import { collection, doc, getDoc, query, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';
import { FIREBASE_AUTH, db } from './config';

export const fetchLastMessage = async (chatId) => {
  try {
    const chatDocRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatDocRef);
    if (chatDoc.exists()) {
      const chatData = chatDoc.data();
      return chatData.last;
    } else {
      return 'No messages yet';
    }
  } catch (error) {
    console.error('Error fetching chat document:', error);
    return 'Error retrieving messages';
  }
};
export const fetchImage = async (chatId) => {
  try {
    const chatDocRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatDocRef);
    if (chatDoc.exists()) {
      const chatData = chatDoc.data();
      return chatData.imageUrl || null;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching chat document:', error);
    return 'Error retrieving messages';
  }
};
export const fetchPost = async (chatId) => {
  try {
    const chatDocRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatDocRef);
    if (chatDoc.exists()) {
      const chatData = chatDoc.data();
      return chatData.postShared || null;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching chat document:', error);
    return 'Error retrieving messages';
  }
};


export const checkSender = async (chatId) => {
  try {
    const chatDocRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatDocRef);
    if (chatDoc.exists()) {
      const chatData = chatDoc.data();
      return chatData.senderId || 'No messages yet';
    } else {
      return 'No messages yet';
    }
  } catch (error) {
    console.error('Error fetching chat document:', error);
    return 'Error retrieving messages';
  }
};

export const subscribeToChats = (callback) => {
  const userId = FIREBASE_AUTH.currentUser.uid;
  const chatsRef = collection(db, 'chats');

  return onSnapshot(chatsRef, async (snapshot) => {
    try {
      const chatRooms = snapshot.docs
        .map(doc => doc.id)
        .filter(chatId => chatId.includes(userId));

      const chatData = await Promise.all(
        chatRooms.map(async (chatId) => {
          const chatRef = collection(db, 'chats', chatId, 'messages');
          const messagesQuery = query(chatRef, orderBy('timestamp', 'desc'), limit(1));

          const messagesSnapshot = await getDocs(messagesQuery);
          let lastMessage = null;
          if (!messagesSnapshot.empty) {
            lastMessage = messagesSnapshot.docs[0].data();
          }

          const [user1, user2] = chatId.split('_');
          const friendId = user1 === userId ? user2 : user1;

          const friendDoc = await getDoc(doc(db, 'users', friendId));
          const friendData = friendDoc.exists() ? friendDoc.data() : { username: 'Unknown', profileImage: '' };

          return {
            friendId,
            friendName: friendData.username,
            friendImage: friendData.profileImage,
            lastMessage: await fetchLastMessage(chatId),
            imageUrl:await fetchImage(chatId),
            post: await fetchPost(chatId),
            timestamp: lastMessage ? lastMessage.timestamp.toDate() : new Date(),
            senderId:await checkSender(chatId)
          };
        })
      );

      callback(chatData);
    } catch (error) {
      console.error('Error fetching chats:', error);
      callback(null, 'Failed to fetch chats.');
    }
  });
};
 