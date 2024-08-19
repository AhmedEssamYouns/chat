import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FloatingButton from '../../Components/Floating-Button';
import MessageInput from '../../Components/Messege-Input';
import MessageItem from '../../Components/Messege-Item';

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
  const flatListRef = useRef(null);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const lastScrollY = useRef(new Animated.Value(0)).current;



  const handleSearchSubmit = () => {
    if (searchResults.length > 0) {
      scrollToSearchedMessage(currentSearchIndex);
    }
  };
  const handleSend = () => {
    if (newMessage.trim() !== '') {
      const newMsg = {
        id: (messages.length + 1).toString(),
        text: newMessage,
        time: 'Now',
        isSentByMe: true,
      };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage('');
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const results = messages
        .map((message, index) => ({ ...message, index }))
        .filter((message) => message.text.toLowerCase().includes(searchQuery.toLowerCase()))
        .reverse(); // Reverse results to match inverted FlatList

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
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [isSearchMode]);

  useEffect(() => {
    if (!isSearchMode) {
      setSearchQuery('');
    }
  }, [isSearchMode]);

  const scrollToSearchedMessage = (index) => {
    if (searchResults.length > 0 && flatListRef.current) {
      // Adjust index for inverted FlatList
      const adjustedIndex = messages.length - searchResults[index].index - 1;
      flatListRef.current.scrollToIndex({ index: adjustedIndex, animated: true });
    }
  };

  const handleNextResult = () => {
    if (searchResults.length > 1) {
      const nextIndex = (currentSearchIndex + 1) % searchResults.length;
      setCurrentSearchIndex(nextIndex);
      scrollToSearchedMessage(nextIndex);
    }
  };

  const handlePreviousResult = () => {
    if (searchResults.length > 1) {
      const prevIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
      setCurrentSearchIndex(prevIndex);
      scrollToSearchedMessage(prevIndex);
    }
  };

  const renderMessageItem = ({ item }) => (
    <MessageItem item={item} searchQuery={searchQuery} />
  );

  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    const isAtBottom = contentOffset.y <= 20; // 20px buffer for precision
    setIsButtonVisible(!isAtBottom);
  };


  const scrollToEnd = () => {
    flatListRef.current.scrollToOffset({ offset: 0, animated: true });
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <View style={styles.navbar}>
        {!isSearchMode ? (
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Image
              style={styles.Image}
              source={{
                uri: 'https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Cat-512.png',
              }}
            />
            <Text style={styles.navbarTitle}>Chat</Text>
          </View>
        ) : (
          <View style={{ width: '100%', flexDirection: 'row', backgroundColor: '#333', borderRadius: 30, paddingHorizontal: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setIsSearchMode(false)}>
                <Ionicons name="arrow-back" size={25} color="#FFFFFF" />
              </TouchableOpacity>
              <TextInput
                placeholder="Search messages..."
                style={{ width: 180, padding: 15, color: 'white' }}
                placeholderTextColor="#AAAAAA"
                value={searchQuery}
                returnKeyType='search'
                onSubmitEditing={handleSearchSubmit}
                onChangeText={setSearchQuery}
              />
            </View>
            <View style={styles.navigationButtons}>
              <TouchableOpacity onPress={handleNextResult}>
                <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={{ width: 60, alignItems: 'center' }}>
                <Text style={styles.navigationText}>
                  {currentSearchIndex + 1} / {searchResults.length}
                </Text>
              </View>
              <TouchableOpacity onPress={handlePreviousResult}>
                <Ionicons name="arrow-down" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.navbarIcons}>
          {!isSearchMode && (
            <>
              <TouchableOpacity style={styles.icon} onPress={() => setIsSearchMode(true)}>
                <Ionicons name="search" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.icon}>
                <Ionicons name="ellipsis-horizontal" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={[...messages].reverse()}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15 }}
        style={styles.messageList}
        inverted
        onScroll={handleScroll}
      />

      {isButtonVisible && (
        <FloatingButton icon={'arrow-down'} up={80} onPress={scrollToEnd} />
      )}
      <MessageInput newMessage={newMessage} setNewMessage={setNewMessage} handleSend={handleSend} />
    </View>

  );
};

const styles = StyleSheet.create({
  navbar: {
    paddingTop: '12%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  navbarTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  navbarIcons: {
    flexDirection: 'row',
  },
  Image: {
    width: 32,
    height: 32,
    borderRadius: 40,
  },
  icon: {
    marginLeft: 20,
  },
  messageTime: {
    color: '#BBBBBB',
    fontSize: 10,
    marginTop: 5,
    textAlign: 'right',
  },
  navigationButtons: {
    right: 10,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  navigationText: {
    alignSelf: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontSize: 12,
    marginHorizontal: 10,
  },
});

export default ChatConversationScreen;