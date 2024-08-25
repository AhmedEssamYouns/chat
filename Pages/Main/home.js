import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import SearchBar from '../../Components/Search-Bar';
import { subscribeToChats } from '../../firebase/getChatRooms';
import { checkForNewMessages } from '../../firebase/manage-Chat-room';
import { FIREBASE_AUTH } from '../../firebase/config';

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
  const [newMessageStatus, setNewMessageStatus] = useState({});

  useEffect(() => {
    const unsubscribe = subscribeToChats((data, error) => {
      if (error) {
        setError(error);
        setChats([]);
        setFilteredChats([]);
      } else {
        // Sort chats by timestamp in descending order
        const sortedChats = data.sort((a, b) => b.timestamp - a.timestamp);
        setChats(sortedChats);
        setFilteredChats(sortedChats);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Check for new messages for each chat
    const checkNewMessagesForChats = async () => {
      const status = {};
      for (const chat of chats) {
        await checkForNewMessages(chat.friendId, (hasNewMessage) => {
          status[chat.friendId] = hasNewMessage;
        });
      }
      setNewMessageStatus(status);
    };

    if (chats.length > 0) {
      checkNewMessagesForChats();
    }
  }, [chats]);

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
          <Text style={styles.chatMessage}>{item.lastMessage}</Text>
          {/* Conditionally show the "New message" text */}
          {newMessageStatus[item.friendId] && (
            <View style={{
              position: 'absolute', right: 0,
              padding: 5,
              backgroundColor: '#121212',
              zIndex: 1,
            }}>
              <Text style={styles.newMessageIndicator}>New message</Text>
            </View>
          )}
          {/* Message status icons */}
          {item.lastMessage == 'Messege Deleted' ?
            <MaterialIcons name="do-not-disturb" size={16} color="#BBBBBB" style={styles.statusIcon} />
            : (
              <>
                {item.senderId == FIREBASE_AUTH.currentUser.uid && (
                  <>
                    {item.seen == true ? (
                      <Ionicons name="checkmark-done" size={16} color="#1DA1F2" style={styles.statusIcon} />
                    ) : (
                      <Ionicons name="checkmark" size={16} color="#BBBBBB" style={styles.statusIcon} />
                    )}
                  </>
                )
                }
              </>)
          }
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
          keyExtractor={(item) => item.id}
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
    color: '#DDDDDD',
    marginRight: 5,
  },
  newMessageIndicator: {

    color: 'red',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 10,
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
