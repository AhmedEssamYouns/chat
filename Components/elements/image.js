import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const ImageScreen = ({ route }) => {
  const { imageUri } = route.params; 

  const images = [
    {
      url: imageUri,
    },
  ];

  return (
    <View style={styles.container}>
      <ImageViewer
        imageUrls={images}
        renderIndicator={() => null} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', 
  },
});

export default ImageScreen;
