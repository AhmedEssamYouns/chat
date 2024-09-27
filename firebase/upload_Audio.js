import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadAudio = async (audioUri) => {
    try {
        // Get a reference to Firebase storage
        const storage = getStorage();
        
        // Create a unique filename for the audio
        const audioFilename = `${Date.now()}_audio`;

        // Get a reference to where the audio file will be stored
        const audioRef = ref(storage, `chatAudios/${audioFilename}`);

        // Convert the audio URI to a Blob object (required by Firebase Storage)
        const response = await fetch(audioUri);
        const blob = await response.blob();

        // Upload the audio blob to Firebase Storage
        await uploadBytes(audioRef, blob);

        // Get the download URL for the uploaded audio
        const downloadURL = await getDownloadURL(audioRef);

        return downloadURL;  // Return the audio's URL to save in Firestore
    } catch (error) {
        console.error('Error uploading audio:', error);
        throw error;
    }
};