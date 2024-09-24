
import React, { useState, useRef, useEffect, } from 'react';
import { View, Text, StyleSheet, Modal, Button, BackHandler, ImageBackground, TouchableOpacity } from 'react-native';
import { FloatingButton } from '../Buttons/Floating-Button';
import MessageInput from './Messege-Input';
import Navbar from './chat-navbar';
import MessageList from './Messege-list';
import { Keyboard } from 'react-native';
import DropdownMenu from './chat-menu-model';
import { fetchMessages, deleteMessage, editMessage, sendMessage } from '../../firebase/manage-Chat-room';
import { db, FIREBASE_AUTH } from '../../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { listenForChatWallpaper } from '../../firebase/wallpaperChange';

const ChatConversationScreen = ({ route, navigation }) => {

  const [messages, setMessages] = useState([]);
  const { friendId } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const inputRef = useRef(null);
  const flatListRef = useRef(null);
  const [wallpaperUrl, setWallpaperUrl] = useState(null); // Store wallpaper URL
  const chatId = [FIREBASE_AUTH.currentUser.uid, friendId].sort().join('_');

  // Real-time listener for wallpaper changes
  useEffect(() => {
    const unsubscribe = listenForChatWallpaper(chatId, setWallpaperUrl);

    // Clean up the listener on component unmount
    return () => unsubscribe();
}, [chatId]);


  useEffect(() => {
    if (searchQuery) {
      const results = messages
        .map((message, index) => ({ ...message, index }))
        .filter((message) =>
          message.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .reverse();

      setSearchResults(results);
      if (results.length > 0) {
        setCurrentSearchIndex(0);
        setTimeout(() => {
          scrollToSearchedMessage(0);
        }, 100);
      }
    } else {
      setSearchResults([]);
      setCurrentSearchIndex(0);
    }
  }, [searchQuery]);

  useEffect(() => {
    const unsubscribe = fetchMessages(friendId, (data) => {
      setMessages(data);
    });

    return () => {
      unsubscribe();
    };
  }, [friendId]);

  useEffect(() => {
    const handleBackPress = () => {
      if (isSearchMode) {
        setIsSearchMode(false);
        return true; // Indicates that the back press event has been handled
      }

      if (isEditing) {
        setIsEditing(false);
        setNewMessage('')
        return true; // Indicates that the back press event has been handled
      }

      // If neither search mode nor editing mode is active, allow the default back action
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [isSearchMode, isEditing]);

  useEffect(() => {
    if (!isSearchMode) {
      setSearchQuery('');
    }
  }, [isSearchMode]);

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => inputRef.current.focus(), 100); // Ensure the input is focused
    }
  }, [isEditing]);

  const scrollToSearchedMessage = (index) => {
    if (searchResults.length > 0 && flatListRef.current) {
      const adjustedIndex = messages.length - searchResults[index].index - 1;
      flatListRef.current.scrollToIndex({ index: adjustedIndex, animated: true });
    }
  };

  const handleSend = () => {
    if (newMessage.trim() !== '') {
      if (isEditing) {
        editMessage(friendId, editingMessageId, newMessage);
        setIsEditing(false);
        setEditingMessageId(null);
        Keyboard.dismiss(); // Hide the keyboard after sending

      } else {
        sendMessage(friendId, newMessage);
        scrollToEnd();
      }
      setNewMessage('');
    }
  };

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    const isAtBottom = contentOffset.y <= 20;
    setIsButtonVisible(!isAtBottom);
  };

  const scrollToEnd = () => {
    flatListRef.current.scrollToOffset({ offset: 0, animated: true });
  };

  const handleLongPressMessage = (message) => {
    setSelectedMessage(message);
    setIsModalVisible(true);
  };

  const handleDeleteMessage = () => {
    deleteMessage(friendId, selectedMessage.id);
    setIsModalVisible(false);
  };

  const handleEditMessage = () => {

    setNewMessage(selectedMessage.text);
    setIsEditing(true);
    setEditingMessageId(selectedMessage.id);
    setIsModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Navbar
        frindID={friendId}
        isSearchMode={isSearchMode}
        setIsSearchMode={setIsSearchMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentSearchIndex={currentSearchIndex}
        searchResults={searchResults}
        handleSearchSubmit={() =>
          searchResults.length > 0 && scrollToSearchedMessage(currentSearchIndex)
        }
        handleNextResult={() => {
          if (searchResults.length > 1) {
            const nextIndex = (currentSearchIndex + 1) % searchResults.length;
            setCurrentSearchIndex(nextIndex);
            scrollToSearchedMessage(nextIndex);
          }
        }}
        handlePreviousResult={() => {
          if (searchResults.length > 1) {
            const prevIndex =
              (currentSearchIndex - 1 + searchResults.length) %
              searchResults.length;
            setCurrentSearchIndex(prevIndex);
            scrollToSearchedMessage(prevIndex);
          }
        }}
        navigation={navigation}
      />
      <ImageBackground
        source={{
          uri: wallpaperUrl ? wallpaperUrl : 'https://i.pinimg.com/736x/a6/a8/b6/a6a8b6eca9c2f1063ca457b143c2ac4f.jpg',
        }}
        style={{
          flex: 1,
          resizeMode: 'cover',
        }}
      >
        <MessageList
          ref={flatListRef}
          messages={[...messages].reverse()}
          handleScroll={handleScroll}
          searchQuery={searchQuery}
          onLongPressMessage={handleLongPressMessage}
        />
        {isEditing && (
          <View style={styles.overlayContainer}>
            <View style={styles.editingMessageContainer}>
              <Text style={styles.editingMessageText}>Editing: {newMessage}</Text>
            </View>
          </View>
        )}
        {(isButtonVisible && !isEditing) && (
          <FloatingButton icon={'arrow-down'} up={20} onPress={scrollToEnd} />
        )}
      </ImageBackground>
      {!isSearchMode &&
        <MessageInput
          friendId={friendId}
          ref={inputRef}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSend={handleSend}
          isEditing={isEditing}
          style={styles.messageInput}
        />
      }
      <DropdownMenu
        isMenuVisible={isModalVisible}
        handleMenuToggle={() => setIsModalVisible(!isModalVisible)}
        handleEditMessage={handleEditMessage}
        handleDeleteMessage={handleDeleteMessage}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    width: 250,
  },
  option: {
    color: "white",
    marginTop: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  modalTitle: {
    paddingVertical: 13,
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  close: {
    paddingVertical: 13,
    color: '#999',
    fontSize: 15,
    right: 0,
    bottom: -20,
    position: "absolute"
  },
  absoluteBlur: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 99,
  },
  editingMessageContainer: {
    backgroundColor: '#A8342A',
    padding: 8,
    bottom: 10,
    right: 10,
    position: 'absolute',
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 5,
    maxWidth: '70%',
  },
  editingMessageText: {
    color: '#fff',
    fontSize: 14,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageInput: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
});


export default ChatConversationScreen;