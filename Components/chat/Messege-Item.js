import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { FIREBASE_AUTH } from '../../firebase/config';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import ConfirmationModal from '../elements/alert';
import { deleteMessage } from '../../firebase/manage-Chat-room';
import { useNavigation } from '@react-navigation/native';
import { fetchPostById } from '../../firebase/fetchPosts';

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, 
  });
};

const formatTimestamp2 = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    hour12: true, 
  });
};

const MessageItem = ({ item, searchQuery, onLongPressMessage }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [sound, setSound] = useState(null); 
  const navigation = useNavigation();
  const lowerCaseText = item.text?.toLowerCase();
  const lowerCaseSearchQuery = searchQuery.toLowerCase();
  const matchIndex = lowerCaseText ? lowerCaseText.indexOf(lowerCaseSearchQuery) : -1;
  const isSentByCurrentUser = item.senderId === FIREBASE_AUTH.currentUser.uid;
  const messageStyle = isSentByCurrentUser ? styles.sentMessage : styles.receivedMessage;
  const [postData, setPostData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (item.postShared?.postId) {
      const unsubscribe = fetchPostById(item.postShared.postId, (data) => {
        setPostData(data);
      });

      return () => unsubscribe();
    }
  }, [item.postShared?.postId]);

  const [duration, setDuration] = useState(0);

  const playAudio = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isPlaying) {
        console.log("Stopping audio playback.");
        await sound.stopAsync(); 
        setIsPlaying(false);
        setDuration(0);
        return; 
      } else {
        await sound.unloadAsync();
      }
    }

    const { sound: newSound, status } = await Audio.Sound.createAsync({ uri: item.audioUrl });

    if (status.isLoaded) {
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);

      const duration = status.durationMillis;
      setTimeout(() => {
        setIsPlaying(false);
        newSound.unloadAsync();
        setDuration(0);
      }, duration);
    } else {
      console.log("Failed to load new audio.");
    }
  };




  const handleLongPressImage = () => {
    if (isSentByCurrentUser) {
      setImageToDelete(item);
      setModalVisible(true);
    }
  };

  const handleDeleteImage = async () => {
    try {
      if (imageToDelete) {
        await deleteMessage(item.receiverId, imageToDelete.id);
        setModalVisible(false);
        setImageToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleLongPress = () => {
    if (isSentByCurrentUser) {
      onLongPressMessage(item);
    }
  };

  return (
    <>
      {item.text && (
        <Pressable
          onLongPress={handleLongPress}
          style={({ pressed }) => [
            styles.messageContainer,
            messageStyle,
            isSentByCurrentUser && pressed && styles.pressedMessage,
          ]}
        >
          <View>
            {matchIndex !== -1 && searchQuery !== '' ? (
              <Text style={styles.messageText}>
                {item.text.substring(0, matchIndex)}
                <Text style={styles.highlightedText}>
                  {item.text.substring(matchIndex, matchIndex + searchQuery.length)}
                </Text>
                {item.text.substring(matchIndex + searchQuery.length)}
              </Text>
            ) : (
              <Text style={styles.messageText}>{item.text}</Text>
            )}
            <View style={styles.messageInfo}>
              <Text style={styles.messageTime}>{formatTimestamp(item.timestamp)}</Text>
              {item.isEdited && <Text style={styles.editedTag}>Edited</Text>}
            </View>
          </View>
        </Pressable>
      )}

      {item.imageUrl && (
        <Pressable
          style={[
            styles.image,
            {
              alignSelf: isSentByCurrentUser ? 'flex-end' : 'flex-start',
            },
          ]}
          onPress={() => navigation.navigate('ImageScreen', { imageUri: item.imageUrl })}
          onLongPress={handleLongPressImage}
        >
          <Image
            style={{
              width: 200,
              height: 200,
              borderRadius: 10,
            }}
            source={{ uri: item.imageUrl }}
          />
          <Text style={styles.messageTime2}>{formatTimestamp(item.timestamp)}</Text>
        </Pressable>
      )}

      {item.audioUrl && (
        <Pressable
          onLongPress={handleLongPressImage}
          onPress={playAudio}
          style={[
            {
              alignSelf: isSentByCurrentUser ? 'flex-end' : 'flex-start',
            },
          ]}
        >
          <View style={styles.audioContainer}>
            <Ionicons name={isPlaying ? 'stop-circle' : "play-circle"} size={32} color="tomato" />
            <Text style={styles.audioText}>{isPlaying ? 'Playing..' : 'Play Audio'}</Text>
          </View>
          <Text style={styles.messageTime2}>{formatTimestamp(item.timestamp)}</Text>
        </Pressable>
      )}
      {/* Render Shared Post */}
      {item.postShared && postData && (
        <Pressable
          onLongPress={handleLongPressImage}
          onPress={() => navigation.navigate('PostScreen', { post: item.postShared })}
          style={[styles.sharedPostContainer, messageStyle]}
        >
          <View style={styles.sharedPostTextContainer}>
            {item.user.profileImage && (
              <Image style={styles.sharedPostImage} source={{ uri: item.user.profileImage }} />
            )}
            <Text style={styles.sharedPostTitle}>{item.user.username}</Text>
            <Text style={styles.time}>{formatTimestamp2(item.postShared.time)}</Text>
          </View>
          <View style={styles.TextContainer}>
            {postData.text && <Text style={styles.sharedPostDescription}>{postData.text}</Text>}
          </View>
          {postData.imageUrls && postData.imageUrls.length > 0 && (
            <View style={{ backgroundColor: 'white' }}>
              <Image
                style={{
                  width: 240,
                  height: 250,
                  resizeMode: 'contain',
                }}
                source={{ uri: postData.imageUrls[0] }}
              />
            </View>
          )}
          <Text style={styles.messageTime2}>{formatTimestamp(item.timestamp)}</Text>
        </Pressable>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={modalVisible}
        onConfirm={handleDeleteImage}
        onCancel={() => setModalVisible(false)}
        message="Do you want to delete this message?"
        confirm="Delete"
      />
    </>
  );
};




const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
    maxWidth: '80%',
  },
  image: {
    borderRadius: 10,
    resizeMode: 'center',
    marginTop: 10,
  },
  sentMessage: {
    backgroundColor: '#A8342A',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#333333',
    alignSelf: 'flex-start',
  },
  pressedMessage: {
    opacity: 0.7, 
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  highlightedText: {
    color: 'yellow',
    fontWeight: 'bold',
  },
  messageTime: {
    color: '#BBBBBB',
    fontSize: 10,
    marginTop: 5,
    textAlign: 'right',
  },
  messageTime2: {
    position: 'absolute',
    padding: 5,
    borderRadius: 10,
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#BBBBBB',
    fontSize: 10,
    marginTop: 5,
    textAlign: 'right',
  },
  editedTag: {
    color: '#BBBBBB',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'right',
  },
  messageInfo: {
    top: 5,
    gap: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIcons: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  statusIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 5,
    borderRadius: 20,
  },
  sharedPostContainer: {
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  sharedPostImage: {
    height: 30,
    width: 30,
    borderRadius: 40,
    resizeMode: 'cover',
  },
  sharedPostTextContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#444444',
  },
  TextContainer: {
    paddingHorizontal: 10,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444444',
  },
  sharedPostTitle: {
    fontSize: 16,
    width: 110,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  time: {
    position: 'absolute',
    fontSize: 10,
    color: '#FFFFFF',
    right: 10
  },
  sharedPostDescription: {
    fontSize: 14,
    color: '#DDDDDD',
    marginTop: 5,
  },
  audioContainer: {
    marginBottom: 35,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 140,
    alignItems: 'center',
    borderRadius: 20,
    padding: 10
  },
  audioText: { color: '#FFFFFF', marginLeft: 10 },
  pressedMessage: { opacity: 0.5 },
});

export default MessageItem;
