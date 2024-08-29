import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { FIREBASE_AUTH } from '../firebase/config';
import { Ionicons } from '@expo/vector-icons';
import ConfirmationModal from './alert';
import { deleteMessage } from '../firebase/manage-Chat-room'; // Ensure this function is available

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // 12-hour format
  });
};

const MessageItem = ({ item, searchQuery, onLongPressMessage }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  const lowerCaseText = item.text.toLowerCase();
  const lowerCaseSearchQuery = searchQuery.toLowerCase();
  const matchIndex = lowerCaseText.indexOf(lowerCaseSearchQuery);
  const isSentByCurrentUser = item.senderId === FIREBASE_AUTH.currentUser.uid;
  const messageStyle = isSentByCurrentUser ? styles.sentMessage : styles.receivedMessage;

  const handleLongPressImage = () => {
    setImageToDelete(item);
    setModalVisible(true);
  };

  const handleDeleteImage = async () => {
    try {
      if (imageToDelete) {
        await deleteMessage(item.receiverId,imageToDelete.id); // Implement deleteMessage in your firebase utility
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
            isSentByCurrentUser && pressed && styles.pressedMessage // Apply pressed style only if message is sent by the current user
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
              <View style={styles.statusIcons}>
                {isSentByCurrentUser && (
                  <>
                    {item.deleverd ? (
                      item.seen ? (
                        <Ionicons name="checkmark-done" size={16} color="#00BFFF" /> // Delivered and Seen
                      ) : (
                        <Ionicons name="checkmark-done" size={16} color="#aaa" /> // Delivered but not Seen
                      )
                    ) : (
                      <Ionicons name="checkmark" size={16} color="#eeee" /> // Not Delivered
                    )}
                  </>
                )}
              </View>
            </View>
          </View>
        </Pressable>
      )}
      {item.imageUrl && (
        <Pressable onLongPress={handleLongPressImage}>
          <Image
            style={[styles.image, {
              alignSelf: isSentByCurrentUser ? 'flex-end' : 'flex-start'
            }]}
            source={{ uri: item.imageUrl }}
          />
          {isSentByCurrentUser && (
            <View style={styles.statusIconContainer}>
              {item.deleverd ? (
                item.seen ? (
                  <Ionicons name="checkmark-done" size={16} color="#00BFFF" /> // Delivered and Seen
                ) : (
                  <Ionicons name="checkmark-done" size={16} color="#aaa" /> // Delivered but not Seen
                )
              ) : (
                <Ionicons name="checkmark" size={16} color="#eeee" /> // Not Delivered
              )}
            </View>
          )}
        </Pressable>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={modalVisible}
        onConfirm={handleDeleteImage}
        onCancel={() => setModalVisible(false)}
        message="Do you want to delete this image?"
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
    width: 200,
    height: 200,
    resizeMode: 'center',
    marginTop: 10, // Optional, add margin if needed
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
    opacity: 0.7, // Example of style change when pressed
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
});

export default MessageItem;
