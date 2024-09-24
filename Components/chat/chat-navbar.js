import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Easing, Modal, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RotatingButton from '../Buttons/animated-rotate-button';
import { getUserById } from '../../firebase/getUser';
import ConfirmationModal from '../elements/alert';
import { deleteChatDocument } from '../../firebase/manage-Chat-room';
import { FIREBASE_AUTH } from '../../firebase/config';
import { pickImage, uploadImageAsyncAndSetWallpaper } from '../../firebase/wallpaperChange';

const Navbar = ({ isSearchMode, setIsSearchMode, searchQuery, setSearchQuery, currentSearchIndex,
  searchResults, handleSearchSubmit, handleNextResult, handlePreviousResult, navigation, frindID }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [user, setUser] = useState(null); // Initialize with null
  const [isModalVisible, setIsModalVisible] = useState(false);
  const searchAnim = useRef(new Animated.Value(-300)).current;
  const searchInputRef = useRef(null);
  const currentUserId = FIREBASE_AUTH.currentUser.uid


  const [wallpaperUrl, setWallpaperUrl] = useState(null); // Store wallpaper URL
  const [loading, setLoading] = useState(false); // Loading state
  // Function that handles the complete process
  const handleSetWallpaper = async () => {
    try {
      setLoading(true); // Set loading to true
      const imageUri = await pickImage(); // Pick image
      if(!imageUri){
        setLoading(false)
      }
      if (imageUri) {
        const uploadedWallpaperUrl = await uploadImageAsyncAndSetWallpaper(imageUri, frindID); // Upload and update Firestore
        setWallpaperUrl(uploadedWallpaperUrl);
        setLoading(false); // Set loading to true
      }
    } catch (error) {
      console.error("Error setting wallpaper: ", error);
    }
  };



  useEffect(() => {
    if (frindID) {
      const unsubscribe = getUserById(frindID, (userData) => {
        setUser(userData);
      });

      return () => unsubscribe();
    }
  }, [frindID]);


  useEffect(() => {
    Animated.timing(searchAnim, {
      toValue: isSearchMode ? 0 : -300,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    if (isSearchMode) {
      setTimeout(() => {
        searchInputRef.current?.focus(); // Optional chaining to avoid errors
      }, 300);
    }
  }, [isSearchMode]);

  const handleMenuToggle = () => {
    setIsMenuVisible(!isMenuVisible);
    setExpanded(!expanded);
  };

  const handleSearchMenuClick = () => {
    setIsSearchMode(true);
    setIsMenuVisible(false);
  };

  const handleClearChat = async () => {
    try {
      if (currentUserId && frindID) {
        await deleteChatDocument(currentUserId, frindID);
        console.log('Chat cleared successfully');
        navigation.navigate('Tabs')
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error('Failed to clear chat:', error);
    }
  };

  return (
    <View style={styles.navbar}>
      {!isSearchMode ? (
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          {user ? (
            <TouchableOpacity
              style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
              onPress={() => navigation.navigate('account', { friendId: user.uid })}
            >
              <Image style={styles.Image} source={{ uri: user.profileImage }} />
              <View>
                <Text style={styles.navbarTitle}>{user.username}</Text>
                <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <Text style={styles.navbarTitle}>Loading...</Text> // Handle case when user is not available
          )}
        </View>
      ) : (
        <Animated.View style={[styles.searchBar, { transform: [{ translateX: searchAnim }] }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setIsSearchMode(false)}>
              <Ionicons name="arrow-back" size={25} color="#FFFFFF" />
            </TouchableOpacity>
            <TextInput
              ref={searchInputRef}
              placeholder="Search messages..."
              style={styles.searchInput}
              placeholderTextColor="#AAAAAA"
              value={searchQuery}
              returnKeyType='search'
              onSubmitEditing={handleSearchSubmit}
              onChangeText={setSearchQuery}
            />
          </View>
          <View style={styles.navigationButtons}>
            <TouchableOpacity onPress={handleNextResult}>
              <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={{ width: 60, alignItems: 'center' }}>
              <Text style={styles.navigationText}>
                {currentSearchIndex + 1} / {searchResults.length}
              </Text>
            </View>
            <TouchableOpacity onPress={handlePreviousResult}>
              <Ionicons name="arrow-down" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
      <View style={styles.navbarIcons}>
        {!isSearchMode && (
          <>
            <TouchableOpacity style={styles.icon} onPress={() => setIsSearchMode(true)}>
              <Ionicons name="search" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <RotatingButton
              size={40}
              backgroundColor={'#121212'}
              onPress={handleMenuToggle}
              icon={expanded ? 'arrow-up' : 'more-horizontal'}
              expanded={expanded}
            />
          </>
        )}
      </View>

      {isMenuVisible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isMenuVisible}
          onRequestClose={handleMenuToggle}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={handleMenuToggle}>
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  handleMenuToggle();
                  navigation.navigate('account', { friendId: user?.uid });
                }}
              >
                <Text style={styles.menuItemText}>View Account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={handleSearchMenuClick}>
                <Text style={styles.menuItemText}>Search</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} disabled={loading} onPress={handleSetWallpaper}>
                <Text style={styles.menuItemText}>{loading ? (<View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ActivityIndicator color={'white'} />
                  <Text style={{ color: 'white' }}> changing</Text>
                </View>) : 'change wallpapaer'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  handleMenuToggle();
                  setIsModalVisible(true);  // Show the confirmation modal
                }}
              >
                <Text style={styles.menuItemText}>Clear Chat</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={isModalVisible}
        onConfirm={handleClearChat}
        onCancel={() => setIsModalVisible(false)}
        message="Are you sure you want to clear this chat?"
        confirm="Clear"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 13,
    paddingHorizontal: 20,
    backgroundColor: '#121212',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  navbarTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  navbarIcons: {
    flexDirection: 'row',
  },
  Image: {
    width: 32,
    height: 32,
    borderRadius: 40,
  },
  icon: {
    marginRight: 10,
    alignSelf: 'center',
  },
  searchBar: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 30,
    height: 40,
    paddingHorizontal: 10,
    zIndex: 1,
  },
  searchInput: {
    width: 180,
    paddingHorizontal: 10,
    color: 'white',
  },
  navigationButtons: {
    right: 10,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationText: {
    alignSelf: 'center',
    color: '#FFFFFF',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    marginTop: 60,
    width: 150,
    backgroundColor: '#121212',
    borderRadius: 5,
    padding: 10,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuItemText: {
    color: '#FFFFFF',
  },
});

export default Navbar;
