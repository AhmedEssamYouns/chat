import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ searchQuery, onChangeSearch, placeholder }) => {
  return (
    <View style={styles.searchBarContainer}>
      <TextInput
        style={styles.searchBar}
        placeholder={placeholder || "Search..."}
        placeholderTextColor="#AAAAAA"
        value={searchQuery}
        onChangeText={onChangeSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 25,
    margin: 15,
    paddingLeft: 15,
  },
  searchIcon: {
    marginRight: 20,
  },
  searchBar: {
    flex: 1,
    padding: 10,
    color: '#FFFFFF',
  },
});

export default SearchBar;
