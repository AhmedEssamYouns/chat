import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadAudio = async (audioUri) => {
    try {
        const storage = getStorage();
        
        const audioFilename = `${Date.now()}_audio`;

        const audioRef = ref(storage, `chatAudios/${audioFilename}`);

        const response = await fetch(audioUri);
        const blob = await response.blob();

        await uploadBytes(audioRef, blob);

        const downloadURL = await getDownloadURL(audioRef);

        return downloadURL;  
    } catch (error) {
        console.error('Error uploading audio:', error);
        throw error;
    }
};