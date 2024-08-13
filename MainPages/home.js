import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

const fakeChats = [
  {
    id: '1',
    name: 'John Doe',
    message: 'Hey, how are you?',
    time: '12:34 PM',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Jane Smith',
    message: 'See you tomorrow!',
    time: '11:15 AM',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    message: 'Thanks for the update.',
    time: 'Yesterday',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  // Add more fake data as needed
];

const ChatScreen = () => {
  const renderChatItem = ({ item }) => (
    <View style={styles.chatItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <Text style={styles.chatMessage}>{item.message}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={fakeChats}
      renderItem={renderChatItem}
      keyExtractor={(item) => item.id}
      style={styles.chatList}
    />
  );
};

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',  // Darker border color
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
    color: '#FFFFFF', // White text color for dark mode
  },
  chatTime: {
    color: '#BBBBBB', // Light gray for the time
    fontSize: 12,
  },
  chatMessage: {
    color: '#DDDDDD', // Lighter gray for the message text
  },
  chatList: {
    backgroundColor: '#121212', // Dark background color
  },
});

export default ChatScreen;
