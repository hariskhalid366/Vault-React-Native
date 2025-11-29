import React, { FC, memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import CustomText from './CustomText';
import { useColors } from '../utils/Constants';

interface HeaderProps {
  leftButton?: React.ReactNode;
  onLeftActionPress?: () => void;
  title?: string;
  rightButton?: React.ReactNode;
  onRightActionPress?: () => void;
  background?: string;
}

const Header: FC<HeaderProps> = ({
  leftButton,
  onLeftActionPress,
  title = '',
  rightButton,
  onRightActionPress,
  background,
}) => {
  const Colors = useColors();
  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: background || Colors.background,
            borderBottomColor: Colors.lockButton,
          },
        ]}
      >
        {/* Left Button */}
        {leftButton ? (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onLeftActionPress}
            activeOpacity={0.7}
          >
            {leftButton}
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}

        {/* Title */}
        <CustomText
          variant="h4"
          fontFamily="Okra-Bold"
          numberOfLines={1}
          style={styles.title}
        >
          {title}
        </CustomText>

        {/* Right Button */}
        {rightButton ? (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onRightActionPress}
            activeOpacity={0.7}
          >
            {rightButton}
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </>
  );
};

export default memo(Header);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
  },
});
