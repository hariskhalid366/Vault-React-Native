import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import CustomText from './CustomText';
import { screenWidth, useColors } from '../utils/Constants';

const ActionButtom = ({ text, onPress, ICON }: any) => {
  const ICON_SIZE = screenWidth * 0.06;
  const Colors = useColors();

  return (
    <TouchableOpacity
      style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}
      onPress={onPress}
    >
      <ICON color={Colors.icons} size={ICON_SIZE} />
      <CustomText fontFamily="Okra-Medium" fontSize={12}>
        {text}
      </CustomText>
    </TouchableOpacity>
  );
};

export default ActionButtom;

const styles = StyleSheet.create({});
