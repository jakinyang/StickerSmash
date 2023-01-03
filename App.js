// React
import { useState, useRef } from 'react';
import { StyleSheet, View, Platform } from 'react-native';

// Libraries
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { StatusBar } from 'expo-status-bar';
import { captureRef } from 'react-native-view-shot';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from "expo-media-library";
import * as SplashScreen from "expo-splash-screen";
import domtoimage from "dom-to-image";

// Components
import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import IconButton from './components/IconButton';
import CircleButton from './components/CircleButton';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';

// Resources
const PlaceHolderImage = require('./assets/images/background-image.png')


SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 5000);

// App Component
export default function App() {

  // States
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();

  // Helper Functions

  // Variable to store screenshot info
  const imageRef = useRef();

  // Expo-media-libary MediaLibrary hook for permission to access device photos
  if (status === null) {
    requestPermission();
  };

  // Async operation for retrieving photos
  // Passing selected photo data
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('You did not select any image.');
    };
  };

  // Modal Toggle helpers
  const onReset = () => {
    setShowAppOptions(false);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {
    if (Platform.OS !== 'web') {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });

        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert("Image saved!");
        };
      } catch (e) {
        console.log(e);
      }
      setShowAppOptions(false);
    } else {
      domtoimage
        .toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        })
        .then(dataUrl => {
          let link = document.createElement('a');
          link.download = 'sticker-smash.jpeg';
          link.href = dataUrl;
          link.click();
        })
        .catch(e => {
          console.log(e);
        });
    };
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View
          ref={imageRef}
          collapsable={false}
        >
          <ImageViewer
            placeHolderSource={PlaceHolderImage}
            selectedImage={selectedImage}
          />
          {pickedEmoji !== null
            ?
            <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
            :
            null
          }
        </View>
      </View>
      <StatusBar style='auto' />
      {
        showAppOptions ?
          (
            <View style={styles.optionsRowContainer}>
              <View style={styles.optionsRow}>
                <IconButton
                  icon="refresh"
                  label="Reset"
                  onPress={onReset}
                />
                <CircleButton
                  onPress={onAddSticker}
                />
                <IconButton
                  icon="save-alt"
                  label="Save"
                  onPress={onSaveImageAsync}
                />
              </View>
            </View>
          )
          :
          (
            <View style={styles.footerContainer}>
              <Button
                label="Choose a photo"
                theme="primary"
                onPress={pickImageAsync}
              />
              <Button
                label="Use this photo"
                onPress={() => setShowAppOptions(true)}
              />
            </View>
          )
      }
      <EmojiPicker
        isVisible={isModalVisible}
        onClose={onModalClose}
      >
        <EmojiList
          onSelect={setPickedEmoji}
          onCloseModal={onModalClose}
        />
      </EmojiPicker>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 50,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsRowContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
