import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Navbar = ({ isSearchMode, setIsSearchMode, searchQuery, setSearchQuery, currentSearchIndex, searchResults, handleSearchSubmit, handleNextResult, handlePreviousResult, navigation }) => (
  <View style={styles.navbar}>
    {!isSearchMode ? (
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
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
      <View style={styles.searchBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setIsSearchMode(false)}>
            <Ionicons name="arrow-back" size={25} color="#FFFFFF" />
          </TouchableOpacity>
          <TextInput
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
      </View>
    )}
    <View style={styles.navbarIcons}>
      {!isSearchMode && (
        <>
          <TouchableOpacity style={styles.icon} onPress={() => setIsSearchMode(true)}>
            <Ionicons name="search" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  navbar: {
    paddingTop: '12%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
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
    paddingHorizontal: 10,
  },
  searchInput: {
    width: 180,
    padding: 15,
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
});

export default Navbar;