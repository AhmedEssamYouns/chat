import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const PostItem = ({ item, currentUserId, onEdit, onDelete, handleLovePress }) => {
    const isOwner = item.id === currentUserId;
    const navigation = useNavigation()
    return (
        <View style={styles.storyItem}>
            <View style={styles.header}>
                <Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => !isOwner && navigation.navigate('account')}>
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    </View>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.storyName}>{item.name}</Text>
                        <Text style={styles.storyTime}>{item.time}</Text>
                    </View>
                </Pressable>
                {isOwner && (
                    <View style={styles.actionIcons}>
                        <TouchableOpacity onPress={() => onEdit(item.id)} style={styles.iconButton}>
                            <AntDesign name="edit" size={20} color="#bbbb" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.iconButton}>
                            <AntDesign name="delete" size={20} color="#bbbb" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <View style={styles.storyContent}>
                <View style={styles.storyTextContainer}>
                    <Text style={styles.storyTitle}>{item.storyTitle}</Text>
                    <Image source={{ uri: item.photo }} style={styles.storyPhoto} />
                </View>
                <View style={styles.actionContainer}>
                    <View style={styles.loveSection}>
                        <TouchableOpacity onPress={() => handleLovePress(item.id)} style={styles.loveIcon}>
                            <AntDesign name="hearto" size={20} color="tomato" />
                        </TouchableOpacity>
                        <Text style={styles.likesCount}>{item.likes}</Text>
                    </View>

                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    storyItem: {
        marginLeft: 35,
        paddingBottom: 15,
        marginHorizontal: 10,
        marginTop: 15,
        borderRadius: 10,
        borderColor: '#333',
        borderBottomWidth: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        top: 10,
    },
    avatarContainer: {
        borderRadius: 70,
        borderRightWidth: 0.8,
        borderLeftWidth: 1,
        borderBottomLeftRadius: 0,
        borderTopWidth: 2,
        borderColor:'#bbb',
        // borderTopColor: '#d6a2a2',
        // borderLeftColor: '#c4b9b9',
        // borderEndColor: '#ea9b9b',
        // borderRightColor: 'tomato',
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    headerTextContainer: {
        marginLeft: 10,
    },
    storyName: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#FFFFFF',
    },
    storyTime: {
        color: '#BBBBBB',
        fontSize: 12,
    },
    storyContent: {
        marginTop: 10,
    },
    storyTextContainer: {
        paddingHorizontal: 30,
        borderLeftWidth: 1,
        borderLeftColor: '#bbb',
    },
    storyTitle: {
        paddingTop: 12,
        fontSize: 16,
        color: '#DDDDDD',
        marginBottom: 10,
    },
    storyPhoto: {
        width: '100%',
        resizeMode: 'cover',
        height: 200,
        borderRadius: 10,
        borderWidth: 1,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
    },
    loveSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        right: 10
    },
    loveIcon: {
        marginRight: 10,
    },
    likesCount: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionIcons: {
        flexDirection: 'row',
        position: 'absolute',
        right: 15
    },
    iconButton: {
        marginHorizontal: 10,
    },
});

export default PostItem;
