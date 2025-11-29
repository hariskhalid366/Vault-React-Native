import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import CustomText from './CustomText';
import { screenHeight, screenWidth, useColors } from '../utils/Constants';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { XIcon } from 'lucide-react-native';
import { ImageFileProps, VideoFileProps } from '../utils/type';

const _spacing = 4;
const _borderRadius = 8;
const _itemSize = 55;

interface AvaliilityProps {
  data?: ImageFileProps[] | VideoFileProps[] | null;
  onPress?: () => void;
  cancel?: boolean;
}

const generateRandomRotation = () =>
  (Math.random() > 0.4 ? -1 : 1) * Math.random() * 20;

export const Item = ({ item, index }: any) => {
  return (
    <View
      key={index}
      style={{
        width: _itemSize,
        borderRadius: _borderRadius,
        padding: _spacing,
        backgroundColor: '#fff',
        aspectRatio: 1,
        elevation: 10,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.4,
        shadowRadius: 7,
        marginLeft: index !== 0 ? -_itemSize / 2 : 0,
        transform: [{ rotate: `${generateRandomRotation()}deg` }],
      }}
    >
      <Image
        resizeMode="cover"
        source={{ uri: item?.uri }}
        style={{ borderRadius: _borderRadius, flex: 1 }}
      />
    </View>
  );
};

const AvalibilityAnimation = ({ data, onPress, cancel }: any) => {
  const arrayItems = Array.isArray(data) ? data : [];
  const Colors = useColors();
  return (
    <Animated.View
      entering={ZoomIn.springify().stiffness(200).damping(20)}
      exiting={ZoomOut.springify().stiffness(200).damping(20)}
      style={[
        { backgroundColor: Colors.lockButton, borderColor: Colors.icons },
        styles.container,
      ]}
    >
      <CustomText variant="h5" fontFamily="Okra-Medium">
        {data?.length} available
      </CustomText>
      <View style={{ flexDirection: 'row' }}>
        {arrayItems.slice(0, 6)?.map((item: any, index: number) => (
          <Animated.View
            entering={ZoomIn.delay(150 * index)
              .springify()
              .stiffness(200)
              .damping(20)}
            exiting={ZoomOut.delay(150 * index)
              .springify()
              .stiffness(200)
              .damping(20)}
            key={index}
          >
            <Item item={item} index={index} />
          </Animated.View>
        ))}
      </View>
      {cancel && (
        <TouchableOpacity
          onPress={onPress}
          style={[styles.touchable, { backgroundColor: Colors.lockButton }]}
        >
          <XIcon color={Colors.icons} size={screenHeight * 0.025} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export default AvalibilityAnimation;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20,
    marginBottom: 30,
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
  },
  touchable: {
    position: 'absolute',
    right: 0,
    zIndex: 2,
    top: -40,
    borderRadius: 100,
    padding: 4,
  },
});
