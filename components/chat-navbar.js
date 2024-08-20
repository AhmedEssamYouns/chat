import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, Animated, Easing, Modal, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Navbar = ({ isSearchMode, setIsSearchMode, searchQuery, setSearchQuery, currentSearchIndex, searchResults, handleSearchSubmit, handleNextResult, handlePreviousResult, navigation }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const searchAnim = useRef(new Animated.Value(-300)).current; // Start from off-screen left
  const searchInputRef = useRef(null); // Reference for the search input

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
  };

  const handleSearchMenuClick = () => {
    setIsSearchMode(true);
    setIsMenuVisible(false); // Close the dropdown menu
  };

  return (
    <View style={styles.navbar}>
      {!isSearchMode ? (
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', height: 40 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Image
            style={styles.Image}
            source={{ uri: 'https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Cat-512.png' }}
          />
          <Text style={styles.navbarTitle}>Chat</Text>
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
            <TouchableOpacity style={styles.icon} onPress={handleMenuToggle}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#FFFFFF" />
            </TouchableOpacity>
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
              <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Option 1')}>
                <Text style={styles.menuItemText}>View Account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={handleSearchMenuClick}>
                <Text style={styles.menuItemText}>Search</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Option 3')}>
                <Text style={styles.menuItemText}>Media</Text>
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
    paddingTop: '14%',
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
    marginLeft: 20,
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
