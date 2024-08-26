import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, Animated, Easing, Modal, Keyboard, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RotatingButton from './animated-rotate-button';
import { getUserById } from '../firebase/getUser';

const Navbar = ({ isSearchMode, setIsSearchMode, searchQuery, setSearchQuery, currentSearchIndex, searchResults, handleSearchSubmit, handleNextResult, handlePreviousResult, navigation, frindID }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [expanded, setExpanded] = useState(false); // Add this state
  const searchAnim = useRef(new Animated.Value(-300)).current; // Start from off-screen left
  const searchInputRef = useRef(null); // Reference for the search input
  const [user, setuser] = useState('')

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = getUserById(frindID, (userData) => {
      setuser(userData);
    });

    // Cleanup function to stop listening for updates
    return () => unsubscribe();
  }, [frindID]);
  useEffect(() => {
    Animated.timing(searchAnim, {
      toValue: isSearchMode ? 0 : -300,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    if (isSearchMode) {
      // Focus the search input and show the keyboard
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 300); // Delay slightly to ensure animation completes
    }
  }, [isSearchMode]);

  const handleMenuToggle = () => {
    setIsMenuVisible(!isMenuVisible);
    setExpanded(!expanded); // Toggle expanded state
  };

  const handleSearchMenuClick = () => {
    setIsSearchMode(true);
    setIsMenuVisible(false); // Close the dropdown menu
  };
  return (
    <View style={styles.navbar}>
      {!isSearchMode ? (
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }} onPress={() =>
            navigation.navigate('account', { friendId: user.uid })
          }>
            <Image
              style={styles.Image}
              source={{ uri: user.profileImage }}
            />
            <View>
              <Text style={styles.navbarTitle}>{user.username}</Text>
              <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                <Text style={{ color: '#bbb' }}>{user.online == true ? 'online' : 'offline'}</Text>
                <View style={{ backgroundColor: user.online ? 'green' : 'red', borderRadius: 10, width: 10, height: 10, top: 1 }}></View>
              </View>
            </View>
          </TouchableOpacity>
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
              expanded={expanded} // Pass expanded state to RotatingButton
            />
          </>
        )}
      </View>

      {/* Dropdown Menu */}
      {isMenuVisible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isMenuVisible}
          onRequestClose={handleMenuToggle}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={handleMenuToggle}>
            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={() => {
                handleMenuToggle();
                navigation.navigate('account', { friendId: user.uid })

              }}>
                <Text style={styles.menuItemText}>View Account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={handleSearchMenuClick}>
                <Text style={styles.menuItemText}>Search</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Option 4')}>
                <Text style={styles.menuItemText}>Clear Chat</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
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
    alignSelf: 'center'
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
  // Modal dropdown styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    marginTop: 60,
    marginRight: 20,
    backgroundColor: '#333',
    elevation: 10,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default Navbar;
