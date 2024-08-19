// components/MessageItem.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageItem = ({ item, searchQuery }) => {
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

const styles = StyleSheet.create({
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
    color: 'yellow',
    fontWeight: 'bold',
  },
  messageTime: {
    color: '#BBBBBB',
    fontSize: 10,
    marginTop: 5,
    textAlign: 'right',
  },
});

export default MessageItem;
