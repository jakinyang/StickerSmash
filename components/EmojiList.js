import { useState } from "react";
import { StyleSheet, FlatList, Image, Platform, Pressable } from 'react-native';

export default function EmojiList({ onSelect, onCloseModal }) {
  const [emoji] = useState([
    require('../assets/images/1-emoji.png'),
    require('../assets/images/2-emoji.png'),
    require('../assets/images/3-emoji.png'),
    require('../assets/images/4-emoji.png'),
    require('../assets/images/5-emoji.png'),
  ]);

  return (
    <FlatList 
      horizontal
      showsHorizontalScrollIndicator={Platform.OS === 'web' ? true : false}
      data={emoji}
      contentContainerStyle={styles.listContainer}
      renderItem={({item, index}) => {
        return (
          <Pressable 
            onPress={() => {
              onSelect(item);
              onCloseModal();
            }}
          >
            <Image 
              source={item} 
              key={index} 
              style={styles.image} 
            />
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
  },
})