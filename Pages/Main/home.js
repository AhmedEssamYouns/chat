
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import SearchBar from '../../Components/elements/Search-Bar';
import { subscribeToChats } from '../../firebase/getChatRooms';
import { Feather } from '@expo/vector-icons';

const formatTimestamp = (timestamp) => {
  const now = new Date();
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp.toDate());
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

  if (diffDays === 0) {
    return date.toLocaleTimeString([], timeOptions);
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString([], options);
  }
};

const ChatScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToChats((data, error) => {
      if (error) {
        setError(error);
        setChats([]);
        setFilteredChats([]);
      } else {
        const sortedChats = data.sort((a, b) => b.timestamp - a.timestamp);
        setChats(sortedChats);
        setFilteredChats(sortedChats);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);


  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = chats.filter(chat =>
      chat.friendName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredChats(filtered);
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('chat', { friendId: item.friendId })}
    >
      <Image source={{ uri: item.friendImage }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.friendName}</Text>
          <Text style={styles.chatTime}>{formatTimestamp(item.timestamp)}</Text>
        </View>
        <View style={styles.chatMessageContainer}>


          <Text style={styles.chatMessage}>

            {item.lastMessage == 'Messege Deleted' ?
              <Text>{item.lastMessage}</Text>
              :
              <>

                {item.imageUrl ? <Text>Photo {' '}<Feather name='camera' size={15} /></Text> : item.lastMessage}
              </>

            }
          </Text>
        </View>
      </View>
    </TouchableOpacity >
  );

  const renderEncryptionMessage = () => (
    <View style={styles.encryptionMessageContainer}>
      <Text style={styles.encryptionMessage}>
        <Ionicons name="lock-closed" size={12} color="#BBBBBB" /> Your messages are <Text style={{ color: 'tomato' }}>end-to-end encrypted</Text>.
      </Text>
    </View>
  );

  const renderEmptyListMessage = () => (
    <View style={styles.emptyMessageContainer}>
      <Text style={styles.emptyMessage}>No chats found.</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <SearchBar
        searchQuery={searchQuery}
        onChangeSearch={handleSearch}
        placeholder="Search chats by name"
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="tomato" />
          <Text style={styles.loadingText}>Loading chats...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.friendId}
          style={styles.chatList}
          ListEmptyComponent={renderEmptyListMessage}
          ListFooterComponent={renderEncryptionMessage}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginHorizontal: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  chatTime: {
    color: '#BBBBBB',
    fontSize: 12,
  },
  chatMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  chatMessage: {
    width: '80%',
    textAlign: 'left',
    height: 20,
    marginRight: 5,
    color: '#bbbb'

  },
  newMessageIndicatorContainer: {
    position: 'absolute',
    right: 0,
    padding: 5,
    paddingHorizontal: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    height: 25,
    minWidth: 25,
    backgroundColor: '#A8342A',
    zIndex: 1,
  },
  newMessageIndicator: {
    alignSelf: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  statusIcon: {
    position: 'absolute',
    right: 0,
  },
  chatList: {
    backgroundColor: '#121212',
  },
  encryptionMessageContainer: {
    padding: 10,
    borderTopColor: '#333',
    alignItems: 'center',
  },
  encryptionMessage: {
    color: '#BBBBBB',
  },
  emptyMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  emptyMessage: {
    color: '#BBBBBB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#BBBBBB',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
});

export default ChatScreen;
