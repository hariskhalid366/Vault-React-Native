import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import * as Progress from 'react-native-progress';
import { screenWidth, useColors } from '../utils/Constants';

const ProgressBar = ({ progress }: any) => {
  const Colors = useColors();
  return (
    <Progress.Bar
      width={screenWidth}
      height={2}
      color={Colors.primary}
      unfilledColor={Colors.lockButton}
      progress={progress}
      borderColor="transparent"
    />
  );
};

export default ProgressBar;

const styles = StyleSheet.create({});
