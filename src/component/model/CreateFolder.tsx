import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { screenHeight, screenWidth, useColors } from '../../utils/Constants';
import CustomText from '../CustomText';
import showToast from '../Toast';
import RNFS from 'react-native-fs';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from '@react-native-community/blur';

interface CreateFolderProps {
  visible?: boolean;
  setVisible?: (visible: boolean) => void;
  vaultPath: string;
}

const CreateFolder: FC<CreateFolderProps> = ({
  setVisible,
  visible,
  vaultPath,
}) => {
  const Colors = useColors();
  const [folderName, setFolderName] = useState<string>('');

  const createFolder = async (file: string) => {
    if (folderName.length === 0) {
      showToast('Please enter folder name');
      return;
    }
    const isExist = await RNFS.exists(`${vaultPath}/${file}`);
    if (!isExist) {
      RNFS.mkdir(`${vaultPath}/${file}`)
        .then(() => {
          showToast('Folder created');
          setFolderName('');
          closeModal();
        })
        .catch(err => {
          console.log('Error creating directory:', err);
          showToast('Error creating folder');
          closeModal();
          setFolderName('');
        });
    } else {
      showToast('Folder already exists');
      setFolderName('');
    }
  };

  const scaleValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  useEffect(() => {
    if (visible) {
      scaleValue.value = withTiming(1, { duration: 300 });
    } else {
      scaleValue.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  const closeModal = () => {
    setFolderName('');
    scaleValue.value = withTiming(0, { duration: 300 });
    setTimeout(() => {
      setVisible && setVisible(false);
    }, 300);
  };

  return (
    <Modal
      onRequestClose={closeModal}
      visible={visible}
      statusBarTranslucent
      transparent
      animationType="fade"
    >
      <View style={styles.modelContainer}>
        <Animated.View
          style={[
            animatedStyle,
            styles.createContainer,
            { backgroundColor: Colors.lockButton },
          ]}
        >
          <CustomText variant="h2">Folder Name</CustomText>
          <TextInput
            style={[
              styles.input,
              { borderColor: Colors.icons, color: Colors.text },
            ]}
            numberOfLines={1}
            autoFocus
            cursorColor={Colors.primary}
            onChangeText={text => setFolderName(text)}
            value={folderName}
            placeholder="Enter Folder Name"
            placeholderTextColor={Colors.icons}
          />
          <View style={styles.buttonContainer}>
            <Pressable onPress={closeModal}>
              <CustomText>Cancel</CustomText>
            </Pressable>
            <Pressable onPress={() => createFolder(folderName)}>
              <CustomText>Create</CustomText>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CreateFolder;

const styles = StyleSheet.create({
  modelContainer: {
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  createContainer: {
    width: screenWidth * 0.75,
    height: screenWidth * 0.45,
    borderRadius: 15,
    borderColor: '#fff',
    borderWidth: 0.6,
    borderCurve: 'circular',
    padding: 20,
  },
  input: {
    marginTop: 15,
    borderColor: 'red',
    paddingLeft: 10,
    borderWidth: 1,
    borderRadius: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: 20,
    gap: 30,
  },
});
