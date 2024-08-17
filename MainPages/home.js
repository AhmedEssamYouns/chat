import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import icons

const fakeChats = [
  {
    id: '1',
    name: 'John Doe',
    message: 'Hey, how are you?',
    time: '12:34 PM',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    status: 'seen', // 'delivered' or 'seen'
  },
  {
    id: '2',
    name: 'Jane Smith',
    message: 'See you tomorrow!',
    time: '11:15 AM',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    status: 'delivered',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    message: 'Thanks for the update.',
    time: 'Yesterday',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    status: 'seen',
  },
  // Add more fake data as needed
];

const ChatScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState(fakeChats);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = fakeChats.filter((chat) =>
      chat.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredChats(filtered);
  };

  const renderChatItem = ({ item }) => (
    <View style={styles.chatItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <View style={styles.chatMessageContainer}>
          <Text style={styles.chatMessage}>{item.message}</Text>
          {item.status === 'seen' ? (
            <Ionicons name="checkmark-done" size={16} color="#1DA1F2" style={styles.statusIcon} />
          ) : (
            <Ionicons name="checkmark" size={16} color="#BBBBBB" style={styles.statusIcon} />
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color="#AAAAAA" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Flirt chats by name"
          placeholderTextColor="#AAAAAA"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
      />
      <View style={styles.encryptionMessageContainer}>
        <Text style={styles.encryptionMessage}>
          Messages are <Text style={{color:"tomato"}}>end-to-end </Text>encrypted.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 25,
    margin: 15,
    paddingLeft: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    padding: 10,
    color: '#FFFFFF',
  },
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
    position:"absolute",
    right:10
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
});

export default ChatScreen;
