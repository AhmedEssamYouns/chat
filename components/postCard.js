// PostCard.js
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialIcons,MaterialCommunityIcons } from '@expo/vector-icons';

const PostCard = ({ imageUrl, onPress }) => {
    console.log(imageUrl[1])
    return (
        <TouchableOpacity onPress={onPress} style={styles.card}>
            {imageUrl[1] &&
                <MaterialCommunityIcons size={20} color={'#fff'} name='card-multiple' style={{position:'absolute',zIndex:2,top:5,right:10}}/>}
            <Image source={{ uri: imageUrl[0] }} style={styles.image} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 2,
        borderRadius: 2,
        overflow: 'hidden',
    },
    image: {
        width: 105,
        height: 105,
    },
});

export default PostCard;
