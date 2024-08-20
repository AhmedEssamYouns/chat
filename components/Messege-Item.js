import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MessageItem = ({ item, searchQuery, onLongPressMessage }) => {
  const lowerCaseText = item.text.toLowerCase();
  const lowerCaseSearchQuery = searchQuery.toLowerCase();

  const matchIndex = lowerCaseText.indexOf(lowerCaseSearchQuery);

  if (matchIndex !== -1 && searchQuery !== '') {
    const beforeMatch = item.text.substring(0, matchIndex);
    const matchText = item.text.substring(
      matchIndex,
      matchIndex + searchQuery.length
    );
    const afterMatch = item.text.substring(matchIndex + searchQuery.length);

    return (
      <TouchableOpacity
        onLongPress={() => onLongPressMessage(item)}
        style={[
          styles.messageContainer,
          item.isSentByMe ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <View>
          <Text style={styles.messageText}>
            {beforeMatch}
            <Text style={styles.highlightedText}>{matchText}</Text>
            {afterMatch}
          </Text>
          <Text style={styles.messageTime}>{item.time}</Text>
          {item.isEdited && (
            <Text style={styles.editedTag}>Edited</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onLongPress={() => onLongPressMessage(item)}
      style={[
        styles.messageContainer,
        item.isSentByMe ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <View>
        <Text style={styles.messageText}>{item.text}</Text>
        <View style={{ flexDirection: 'row',gap:10,justifyContent:'space-between' }}>
          <Text style={styles.messageTime}>{item.time}</Text>
          {item.isEdited && (
            <Text style={styles.editedTag}>Edited</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
  editedTag: {
    color: '#BBBBBB',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'right',
  },
});

export default MessageItem;
