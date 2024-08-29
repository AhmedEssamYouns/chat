import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const ImageScreen = ({ route }) => {
  const { imageUri } = route.params; // Retrieve the image URI passed via navigation

  // Create an array of image objects for the ImageViewer
  const images = [
    {
      url: imageUri,
    },
  ];

  return (
    <View style={styles.container}>
      <ImageViewer
        imageUrls={images}
        renderIndicator={() => null} // Hide the indicator
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Match your app theme
  },
});

export default ImageScreen;
