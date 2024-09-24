import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, FIREBASE_AUTH } from './config';



// Function to listen for changes to the chat document
export const listenForChatWallpaper = (chatId, setWallpaperUrl) => {
    const chatDocRef = doc(db, 'chats', chatId);

    const unsubscribe = onSnapshot(chatDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            if (data.wallpaper) {
                setWallpaperUrl(data.wallpaper); // Update wallpaper URL in state
            }
        }
    });

    // Return the unsubscribe function to stop listening when needed
    return unsubscribe;
};
// Function to pick image from the device
export const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 3],
        quality: 1,
    });

    if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        return imageUri; // Return selected image URI
    } else {
        return null;
    }
};

// Function to upload image to Firebase Storage and set wallpaper in Firestore
export const uploadImageAsyncAndSetWallpaper = async (imageUri, friendId) => {
    const chatId = [FIREBASE_AUTH.currentUser.uid, friendId].sort().join('_');
    const storage = getStorage();
    const storageRef = ref(storage, `chat-wallpapers/${chatId}`);

    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Upload image to Firebase Storage
    await uploadBytes(storageRef, blob);
    
    // Get the download URL for the image
    const downloadURL = await getDownloadURL(storageRef);
    
    // Update Firestore with the wallpaper URL
    await setChatWallpaper(chatId, downloadURL);
    return downloadURL;
};

// Function to update Firestore with the wallpaper URL
const setChatWallpaper = async (chatId, wallpaperUrl) => {
    const chatDocRef = doc(db, 'chats', chatId);

    try {
        // Update Firestore with the new wallpaper URL
        await updateDoc(chatDocRef, {
            wallpaper: wallpaperUrl // New wallpaper property
        });
        console.log('Wallpaper has been updated!');
    } catch (error) {
        console.error("Error updating wallpaper: ", error);
    }
};
