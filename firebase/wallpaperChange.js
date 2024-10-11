import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, FIREBASE_AUTH } from './config';



export const listenForChatWallpaper = (chatId, setWallpaperUrl) => {
    const chatDocRef = doc(db, 'chats', chatId);

    const unsubscribe = onSnapshot(chatDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            if (data.wallpaper) {
                setWallpaperUrl(data.wallpaper); 
            }
        }
    });

    return unsubscribe;
};
export const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 3],
        quality: 1,
    });

    if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        return imageUri;
    } else {
        return null;
    }
};

export const uploadImageAsyncAndSetWallpaper = async (imageUri, friendId) => {
    const chatId = [FIREBASE_AUTH.currentUser.uid, friendId].sort().join('_');
    const storage = getStorage();
    const storageRef = ref(storage, `chat-wallpapers/${chatId}`);

    const response = await fetch(imageUri);
    const blob = await response.blob();

    await uploadBytes(storageRef, blob);
    
    const downloadURL = await getDownloadURL(storageRef);
    
    await setChatWallpaper(chatId, downloadURL);
    return downloadURL;
};

const setChatWallpaper = async (chatId, wallpaperUrl) => {
    const chatDocRef = doc(db, 'chats', chatId);

    try {
        await updateDoc(chatDocRef, {
            wallpaper: wallpaperUrl
        });
        console.log('Wallpaper has been updated!');
    } catch (error) {
        console.error("Error updating wallpaper: ", error);
    }
};
