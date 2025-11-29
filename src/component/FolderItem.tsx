import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import * as Icons from 'lucide-react-native';
import CustomText from './CustomText';
import { screenWidth } from '../utils/Constants';

interface FolderItemProps {
  item?: any;
  index?: number;
  isSelected?: boolean;
  Colors?: any;
  onPress?: (item: any, isSelected: boolean) => void;
  onLongPress?: (item: any) => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const ICON_SIZE = screenWidth * 0.08;

export const FolderItem = React.memo(
  ({
    item,
    index = 0,
    isSelected,
    Colors,
    onPress,
    onLongPress,
  }: FolderItemProps) => (
    <AnimatedTouchable
      layout={LinearTransition}
      entering={FadeIn.delay(index * 30)}
      exiting={FadeOut.delay(index * 30)}
      style={[
        styles.touchable,
        {
          backgroundColor: Colors.lockButton,
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? Colors.primary : 'transparent',
        },
      ]}
      activeOpacity={0.8}
      onPress={() => {
        onPress && onPress(item, isSelected ?? false);
      }}
      onLongPress={() => {
        onLongPress && onLongPress(item);
      }}
    >
      <Icons.FolderIcon
        strokeWidth={1.2}
        size={ICON_SIZE}
        color={isSelected ? Colors.primary : Colors.icons}
      />
      <CustomText
        numberOfLines={1}
        style={{ marginTop: 5 }}
        fontFamily="Okra-Medium"
      >
        {item?.name?.length > 6 ? item?.name?.slice(0, 6) + '...' : item?.name}
      </CustomText>
    </AnimatedTouchable>
  ),
);

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    width: (screenWidth * 0.9) / 4 - 15,
    height: (screenWidth * 0.9) / 4 - 15,
    margin: 4,
    borderRadius: 15,
  },
});
