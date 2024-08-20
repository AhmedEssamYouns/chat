
import React, { useState, useRef, useEffect, } from 'react';
import { View, Text, StyleSheet, Modal, Button, BackHandler, ImageBackground, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import FloatingButton from '../../Components/Floating-Button';
import MessageInput from '../../Components/Messege-Input';
import Navbar from '../../Components/chat-navbar';
import MessageList from '../../Components/Messege-list';
import { Keyboard } from 'react-native';
import DropdownMenu from '../../Components/menu-model';

const ChatConversationScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hey, how are you?', time: '12:34 PM', isSentByMe: false },
    { id: '2', text: 'I’m good! How about you?', time: '12:36 PM', isSentByMe: true },
    { id: '3', text: 'Doing well, thanks! Just finished a workout. 😅', time: '12:37 PM', isSentByMe: false },
    { id: '4', text: 'Nice! What did you do today?', time: '12:38 PM', isSentByMe: true },
    { id: '5', text: 'I did a full-body workout. Squats, bench press, deadlifts... you know the drill. 💪', time: '12:40 PM', isSentByMe: false },
    { id: '6', text: 'Sounds intense! I just did some cardio today. Running is always a challenge. 🏃‍♂️', time: '12:42 PM', isSentByMe: true },
    { id: '7', text: 'Cardio is great too! What’s your favorite running route?', time: '12:43 PM', isSentByMe: false },
    { id: '8', text: 'I usually run along the river. It’s peaceful and scenic. What about you?', time: '12:45 PM', isSentByMe: true },
    { id: '9', text: 'I like to run in the park near my place. It’s nice to be surrounded by nature.', time: '12:46 PM', isSentByMe: false },
    { id: '10', text: 'Sounds lovely. Do you usually listen to music while running?', time: '12:48 PM', isSentByMe: true },
    { id: '11', text: 'Definitely! I can’t run without my playlist. What do you listen to?', time: '12:50 PM', isSentByMe: false },
    { id: '12', text: 'I’m into podcasts lately. It’s a great way to stay entertained while exercising.', time: '12:52 PM', isSentByMe: true },
    { id: '13', text: 'Podcasts are awesome! Any recommendations?', time: '12:53 PM', isSentByMe: false },
    { id: '14', text: 'I’d recommend “The Daily” for news and “How I Built This” for inspiring stories.', time: '12:55 PM', isSentByMe: true },
    { id: '15', text: 'Great suggestions, thanks! I’ll check them out.', time: '12:56 PM', isSentByMe: false },
    { id: '16', text: 'No problem! Let me know what you think once you’ve listened.', time: '12:58 PM', isSentByMe: true },
    { id: '17', text: 'Will do. By the way, do you have any plans for the weekend?', time: '01:00 PM', isSentByMe: false },
    { id: '18', text: 'I’m thinking of going hiking if the weather’s good. How about you?', time: '01:02 PM', isSentByMe: true },
    { id: '19', text: 'That sounds like a lot of fun. I might just relax at home and catch up on some reading.', time: '01:04 PM', isSentByMe: false },
    { id: '20', text: 'Relaxing sounds perfect too. Any books you’re excited about?', time: '01:06 PM', isSentByMe: true },
    { id: '21', text: 'I just got “Project Hail Mary” by Andy Weir. Heard it’s a great read!', time: '01:08 PM', isSentByMe: false },
    { id: '22', text: 'Nice choice! I loved “The Martian.” I’m sure it’ll be good.', time: '01:10 PM', isSentByMe: true },
    { id: '23', text: 'Me too! I’ll let you know how it goes.', time: '01:12 PM', isSentByMe: false },
    { id: '24', text: 'Looking forward to it. Alright, I need to get back to work. Catch you later?', time: '01:14 PM', isSentByMe: true },
    { id: '25', text: 'Sure thing! Have a great day at work!', time: '01:16 PM', isSentByMe: false },
    { id: '26', text: 'Thanks, you too! Bye for now!', time: '01:18 PM', isSentByMe: true },
    { id: '27', text: 'Bye!', time: '01:20 PM', isSentByMe: false },
  ]);


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
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === editingMessageId ? { ...msg, text: newMessage, isEdited: true } : msg
          )
        );
        setIsEditing(false);
        setEditingMessageId(null);
        Keyboard.dismiss(); // Hide the keyboard after sending

      } else {
        const newMsg = {
          id: (messages.length + 1).toString(),
          text: newMessage,
          time: 'Now',
          isSentByMe: true,
        };
        setMessages((prevMessages) => [...prevMessages, newMsg]);
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
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== selectedMessage.id)
    );
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
          uri: 'https://i.pinimg.com/736x/a6/a8/b6/a6a8b6eca9c2f1063ca457b143c2ac4f.jpg',
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark transparent overlay
    zIndex: 1, // Ensure it appears above other components but below the input
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageInput: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2, // Ensure the input is above the overlay
  },
});


export default ChatConversationScreen;