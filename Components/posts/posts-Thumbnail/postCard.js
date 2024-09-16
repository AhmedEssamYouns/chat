// PostCard.js
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather, MaterialIcons,MaterialCommunityIcons, } from '@expo/vector-icons';

const PostCard = ({ imageUrl, onPress }) => {
    const screenWidth = Dimensions.get('window').width;
    return (
        <TouchableOpacity onPress={onPress} style={[styles.card,{width:screenWidth*0.3}]}>
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
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
        height:150
    },
    image: {
        resizeMode:'cover',
        width: '100%',
        height: 150,
    },
});

export default PostCard;
