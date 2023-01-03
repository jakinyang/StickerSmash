import { StyleSheet, View, Image } from 'react-native';



export default function ImageViewer({ placeHolderSource, selectedImage }) {
  const image = selectedImage === null ? placeHolderSource : { uri: selectedImage };

  return (
      <Image
        source={image}
        style={styles.image}
      />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
