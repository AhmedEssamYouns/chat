import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import MessageItem from './Messege-Item';

const MessageList = React.forwardRef(({ messages, handleScroll, searchQuery }, ref) => (
    <FlatList
        ref={ref}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <MessageItem item={item} searchQuery={searchQuery} />
        )}
        contentContainerStyle={styles.listContainer}
        onScroll={handleScroll}
        inverted
    />
));

const styles = StyleSheet.create({
    listContainer: {
        paddingBottom: 20,
        paddingHorizontal:20,
    },
});

export default MessageList;
