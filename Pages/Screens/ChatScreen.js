import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../Components/Search';

const ChatConversationScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hey, how are you?',
      time: '12:34 PM',
      isSentByMe: false,
    },
    {
      id: '2',
      text: 'I’m good! How about you?',
      time: '12:36 PM',
      isSentByMe: true,
    },
    {
      id: '3',
      text: 'Doing well, thanks!',
      time: '12:37 PM',
      isSentByMe: false,
    },
    {
      id: '4',
      text: 'Doing well, thanks!Doing well, thanks!Doing well, thanks!Doing well, thanks!Doing well, thanks!Doing well, thanks!',
      time: '12:37 PM',
      isSentByMe: false,
    }, {
      id: '5',
      text: 'Doing well, thanks!',
      time: '12:37 PM',
      isSentByMe: false,
    },
    {
      id: '6',
      text: 'Doing well, thanks!',
      time: '12:37 PM',
      isSentByMe: false,
    },
    {
      id: '7',
      text: 'hey',
      time: '12:37 PM',
      isSentByMe: true,
    },
    // More messages here...
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);

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
        .reverse(); // Reverse the filtered results

      setSearchResults(results);
      if (results.length > 0) {
        setCurrentSearchIndex(0);
        setTimeout(() => {
          scrollToSearchedMessage(0);
        }, 100); // Adjust timeout if needed
      }
    } else {
      setSearchResults([]);
      setCurrentSearchIndex(0);
    }
  }, [searchQuery]);

  const scrollToSearchedMessage = (index) => {
    if (searchResults.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: searchResults[index].index, animated: true });
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

  const renderMessageItem = ({ item }) => {
    const lowerCaseText = item.text.toLowerCase();
    const lowerCaseSearchQuery = searchQuery.toLowerCase();

    const matchIndex = lowerCaseText.indexOf(lowerCaseSearchQuery);

    if (matchIndex !== -1 && searchQuery !== '') {
      const beforeMatch = item.text.substring(0, matchIndex);
      const matchText = item.text.substring(matchIndex, matchIndex + searchQuery.length);
      const afterMatch = item.text.substring(matchIndex + searchQuery.length);

      return (
        <View
          style={[
            styles.messageContainer,
            item.isSentByMe ? styles.sentMessage : styles.receivedMessage,
          ]}
        >
          <Text style={styles.messageText}>
            {beforeMatch}
            <Text style={styles.highlightedText}>{matchText}</Text>
            {afterMatch}
          </Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageContainer,
          item.isSentByMe ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
    );
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
          <View style={{width:'100%',flexDirection:"row",backgroundColor:"#333",borderRadius:30,paddingHorizontal:10,}}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setIsSearchMode(false)}>
                <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TextInput
                placeholder="Search messages..."
                style={{ width: 180, padding: 15, color: 'white' }}
                placeholderTextColor="#AAAAAA"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <View style={styles.navigationButtons}>
              <TouchableOpacity onPress={handlePreviousResult}>
                <Ionicons name="arrow-up" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.navigationText}>
                {currentSearchIndex + 1} / {searchResults.length}
              </Text>
              <TouchableOpacity onPress={handleNextResult}>
                <Ionicons name="arrow-down" size={24} color="#FFFFFF" />
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
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 20, paddingBottom: 20 }}
        style={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          multiline
          style={styles.input}
          placeholder="Type a message"
          placeholderTextColor="#AAAAAA"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity onPress={handleSend}>
          <Ionicons name="send" size={24} color="tomato" style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
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
  messageList: {
    backgroundColor: '#121212',
    paddingHorizontal: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  sentMessage: {
    backgroundColor: '#A8342A',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#333333',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  highlightedText: {
    color: 'tomato',
    fontWeight: 'bold',
  },
  messageTime: {
    color: '#BBBBBB',
    fontSize: 10,
    marginTop: 5,
    textAlign: 'right',
  },
  navigationButtons: {
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationText: {
    color: '#FFFFFF',
    marginHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#333',
  },
  sendIcon: {
    marginLeft: 10,
  },
});

export default ChatConversationScreen;