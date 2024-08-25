const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.onMessageCreate = functions.firestore
    .document("chats/{chatId}/messages/{messageId}")
    .onCreate(async (snap, context) => {
        const newMessage = snap.data();
        const { receiverId } = newMessage;

        // Get the recipient's device token (assuming you have a field in the user document for this)
        const userDocRef = admin.firestore().doc(`users/${receiverId}`);
        const userDoc = await userDocRef.get();
        const userData = userDoc.data();
        const deviceToken = userData.deviceToken;

        if (deviceToken) {
            const messagePayload = {
                notification: {
                    title: "New Message",
                    body: "You have a new message",
                },
            };

            try {
                await admin.messaging().sendToDevice(deviceToken, messagePayload);
                console.log("Notification sent successfully.");
            } catch (error) {
                console.error("Error sending notification:", error);
            }

            // Update the message as delivered
            await snap.ref.update({ delivered: true });
        }
    });
