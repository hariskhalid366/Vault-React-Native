import { screenWidth } from '../utils/Constants';
import { FasterImageView } from '@rraut/react-native-faster-image';
import React, { FC } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Icons from 'lucide-react-native';
import CustomText from './CustomText';

const ICON_SIZE = screenWidth * 0.08;
const SIZE = screenWidth * 0.24;
const ALBUM = screenWidth * 0.32;

interface AssetItemProps {
  item?: any;
  isSelected?: boolean;
  index?: number;
  onPress?: (item?: any, index?: number) => void;
  onLongPress?: (item: any) => void;
}

export const AssetItem: FC<AssetItemProps> = React.memo(
  ({ item, isSelected, onPress, onLongPress, index }) => {
    const showOverlay =
      item.type === 'video/mp4' || item?.name?.includes('mp4') || isSelected;

    return (
      <TouchableOpacity
        key={item?.uri || item?.path}
        onPress={() => {
          onPress && onPress(item, index);
        }}
        onLongPress={() => {
          onLongPress && onLongPress(item);
        }}
      >
        {showOverlay && (
          <View style={styles.overlay}>
            {isSelected ? (
              <Icons.CheckCheck
                size={ICON_SIZE}
                strokeWidth={1.2}
                color="#fff"
              />
            ) : (
              <Icons.PlayIcon size={ICON_SIZE} strokeWidth={1.2} color="#fff" />
            )}
          </View>
        )}
        <FasterImageView
          style={{
            margin: 2,
            width: item?.title ? ALBUM : SIZE,
            height: item?.title ? ALBUM : SIZE,
            backgroundColor: '#1c1c1e',
          }}
          radius={item?.title ? 12 : 0}
          onProgress={() => <ActivityIndicator color={'#fff'} size={'small'} />}
          source={{
            resizeMode: 'cover',
            uri: item?.path ? `file://${item?.path}` : item?.uri,
          }}
        />
        {item?.title && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 5,
            }}
          >
            <CustomText variant="h6" fontFamily="Okra-Regular">
              {item?.title?.length > 8
                ? item?.title?.slice(0, 8) + '...'
                : item?.title}
            </CustomText>
            <CustomText variant="h6" fontFamily="Okra-Regular">
              {item?.count}
            </CustomText>
          </View>
        )}
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: SIZE,
    height: SIZE,
    backgroundColor: '#00000066',
    margin: 2,
  },
});
