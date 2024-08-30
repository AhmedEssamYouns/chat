import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, ActivityIndicator } from 'react-native';
import PostsList from '../../Components/posts/posts-list/posts-list';
import { FIREBASE_AUTH, db } from '../../firebase/config';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const StoriesScreen = () => {
  const [posts, setPosts] = useState([]);
  const [hasFriends, setHasFriends] = useState(false);
  const [friendsHavePosts, setFriendsHavePosts] = useState(true);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigation = useNavigation();

  useEffect(() => {
    const userId = FIREBASE_AUTH.currentUser.uid;

    // Fetch user data
    const userDocRef = doc(db, 'users', userId);
    const unsubscribeUser = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const friends = userData.friends || [];
        setHasFriends(friends.length > 0);

        if (friends.length > 0) {
          // Fetch user and friends posts
          const postsRef = collection(db, 'posts');
          const postsQuery = query(postsRef, where('id', 'in', [userId, ...friends]));
          const unsubscribePosts = onSnapshot(postsQuery, (querySnapshot) => {
            const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(posts);

            // Check if friends have posts
            const friendsPosts = posts.filter(post => friends.includes(post.id));
            setFriendsHavePosts(friendsPosts.length > 0);

            // Update loading state
            setLoading(false); // Set loading to false after fetching posts

            return () => unsubscribePosts();
          });
        } else {
          // If no friends, set loading to false
          setLoading(false);
        }
      }
    });

    return () => unsubscribeUser();
  }, []);

  if (loading) {
    // Show loading indicator while data is being fetched
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f44336" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      {hasFriends ? (
        friendsHavePosts ? (
          <>
            <PostsList
              posts={posts}
              currentUserId={FIREBASE_AUTH.currentUser.uid}
              handleLovePress={(postId) => console.log('Love pressed for post:', postId)}
              onEditPost={(postId) => console.log('Edit post:', postId)}
              onDeletePost={(postId) => console.log('Delete post:', postId)}
            />
          </>
        ) : (
          <View style={styles.noFriendsContainer}>
            <Text style={styles.noFriendsText}>Your friends haven't posted anything yet.</Text>
            <TouchableOpacity
              style={styles.addFriendsButton}
              onPress={() => navigation.navigate('search')}
            >
              <Text style={styles.addFriendsText}>Add More Friends to See New Posts</Text>
            </TouchableOpacity>
          </View>
        )
      ) : (
        <View style={styles.noFriendsContainer}>
          <Image
            source={{ uri: 'https://c8.alamy.com/comp/2CTAYPY/social-network-monitoring-abstract-concept-vector-illustration-2CTAYPY.jpg' }}
            style={styles.noFriendsImage}
          />
          <Text style={styles.noFriendsText}>You have no friends to show posts from.</Text>
          <TouchableOpacity
            style={styles.addFriendsButton}
            onPress={() => navigation.navigate('search')}
          >
            <Text style={styles.addFriendsText}>Add Friends to Share and Communicate</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  noFriendsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  noFriendsText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  noFriendsImage: {
    width: 240,
    height: 240,
    borderRadius: 300,
    marginBottom: 15,
  },
  addFriendsButton: {
    padding: 10,
    borderRadius: 5,
  },
  addFriendsText: {
    color: 'tomato',
    fontSize: 15,
  },
});

export default StoriesScreen;
