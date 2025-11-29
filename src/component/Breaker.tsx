import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomText from './CustomText';

const Breaker = ({ text }: { text: string }) => {
  return (
    <View style={styles.breakerContainer}>
      <View style={styles.horizontalLine} />
      <CustomText style={styles.breakerText} fontFamily="Okra-Medium">
        {text}
      </CustomText>
      <View style={styles.horizontalLine} />
    </View>
  );
};

export default Breaker;

const styles = StyleSheet.create({
  breakerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '80%',
  },
  horizontalLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  breakerText: {
    marginHorizontal: 10,
    opacity: 0.8,
    textAlign: 'center',
  },
});
