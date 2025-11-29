import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { FC } from 'react';
import { Icons, screenWidth, useColors } from '../utils/Constants';
import { pickDocument, pickImage, pickVideos } from '../utils/libraryHelpers';
import CustomText from './CustomText';
import { navigate } from '../utils/NavigationUtil';

interface OptionProps {
  isHome?: boolean;
  onFilePickUp?: (file: any) => void;
  onMediaPickUp?: (media: any) => void;
  onAudioPickUp?: (audio: any) => void;
  onVideoPickUp?: (media: any) => void;
}

const Option: FC<OptionProps> = ({
  isHome,
  onFilePickUp,
  onMediaPickUp,
  onVideoPickUp,
  onAudioPickUp,
}) => {
  const Colors = useColors();

  const handleUniversalPicker = async (type: string) => {
    if (type === 'images' && onMediaPickUp) {
      pickImage(onMediaPickUp);
    }
    if (type === 'files' && onFilePickUp) {
      pickDocument(onFilePickUp);
    }
    if (type === 'videos' && onVideoPickUp) {
      pickVideos(onVideoPickUp);
    }
    if (type === 'audios' && onAudioPickUp) {
      navigate('audiopicker');
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 15,
      }}
    >
      {Icons.map((Item, index) => (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => handleUniversalPicker(Item?.type)}
          style={{ alignItems: 'center' }}
          key={index}
        >
          <Item.icon
            size={screenWidth * 0.08}
            strokeWidth={1.2}
            color={Colors.icons}
          />
          <CustomText style={{ marginTop: 5 }} fontFamily="Okra-Medium">
            {Item?.name}
          </CustomText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Option;
