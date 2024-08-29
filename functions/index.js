
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendMessageNotification = functions.firestore
    .document('chats/{chatId}/messages/{messageId}')
    .onCreate(async (snapshot, context) => {
        const messageData = snapshot.data();
        const receiverId = messageData.receiverId;

        const userDoc = await admin.firestore().collection('users').doc(receiverId).get();
        const fcmToken = userDoc.data().fcmToken;

        const payload = {
            notification: {
                title: 'New Message',
                body: messageData.text || 'You received a new message',
                clickAction: 'FLUTTER_NOTIFICATION_CLICK', // Adjust according to your app
            },
            token: fcmToken,
        };

        if (fcmToken) {
            await admin.messaging().send(payload);
        }
    });