import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import MessageItem from './Messege-Item'

const MessageList = React.forwardRef(({ messages, handleScroll, searchQuery, onLongPressMessage, fotter }, ref) => (
    <FlatList
        ref={ref}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <MessageItem item={item} searchQuery={searchQuery}
                onLongPressMessage={onLongPressMessage}
            />
        )}
        contentContainerStyle={styles.listContainer}
        onScroll={handleScroll}
        ListHeaderComponent={fotter}
        ListHeaderComponentStyle={{ alignSelf: 'flex-start' }}
        inverted
    />
));

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
});

export default MessageList;
