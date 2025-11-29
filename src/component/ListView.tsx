import React, { memo, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import * as Icon from 'lucide-react-native';
import { screenWidth, useColors } from '../utils/Constants';
import CustomText from './CustomText';
import { convertMillisecondsToTime } from '../utils/libraryHelpers';

const ICON_SIZE = screenWidth * 0.06;

const ListView = ({ item, index, onPress, onLongPress, isSelected }: any) => {
  const Colors = useColors();

  // ✅ useCallback prevents re-creating handlers every render
  const handlePress = useCallback(
    () => onPress?.(item, index),
    [item, index, onPress],
  );
  const handleLongPress = useCallback(
    () => onLongPress?.(item, index),
    [item, index, onLongPress],
  );

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
      delayPressIn={50}
      style={[
        styles.container,
        { backgroundColor: isSelected ? Colors.primary : Colors.lockButton },
      ]}
    >
      <View style={styles.row}>
        {/* Audio Icon */}
        <View style={styles.iconContainer}>
          <Icon.AudioLines color={Colors.icons} size={ICON_SIZE} />
        </View>

        {/* Song Info */}
        <View style={styles.infoContainer}>
          <CustomText fontFamily="Okra-Bold" numberOfLines={1}>
            {item.title || 'Unknown Title'}
          </CustomText>
          <CustomText fontFamily="Okra-Medium" numberOfLines={1}>
            {(item.artist ? item.artist.slice(0, 30) : 'Unknown Artist') +
              ' • ' +
              convertMillisecondsToTime(item.duration)}
          </CustomText>
        </View>

        {/* More Options */}
        {/* <TouchableOpacity
          onPress={() => console.log('More pressed')}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }} // ✅ Better touch target
          style={styles.moreButton}
        >
          <Icon.Ellipsis color={Colors.icons} size={ICON_SIZE} />
        </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );
};

export default memo(ListView); // ✅ memo prevents re-render unless props change

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginHorizontal: 10,
    borderRadius: 15,
    paddingHorizontal: 10,
    height: 60,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  moreButton: {
    padding: 4,
    marginLeft: 2,
    borderRadius: 18,
  },
});
