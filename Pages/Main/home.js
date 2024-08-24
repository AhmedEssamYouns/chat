import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../Components/Search-Bar';
import { subscribeToChats } from '../../firebase/getChatRooms';

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
        setChats(data);
        setFilteredChats(data);
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
          <Text style={styles.chatTime}>{item.timestamp.toLocaleTimeString()}</Text>
        </View>
        <View style={styles.chatMessageContainer}>
          <Text style={styles.chatMessage}>{item.lastMessage}</Text>
          {/* {item.status === 'seen' ? (
            <Ionicons name="checkmark-done" size={16} color="#1DA1F2" style={styles.statusIcon} />
          ) : (
            <Ionicons name="checkmark" size={16} color="#BBBBBB" style={styles.statusIcon} />
          )} */}
        </View>
      </View>
    </TouchableOpacity>
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
      <Text style={styles.emptyMessage}>No chats found by this name.</Text>
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
  },
  chatMessage: {
    color: '#DDDDDD',
    marginRight: 5,
  },
  statusIcon: {
    position: 'absolute',
    right: 10,
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
    fontSize: 12,
  },
  emptyMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  emptyMessage: {
    color: '#BBBBBB',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default ChatScreen;
