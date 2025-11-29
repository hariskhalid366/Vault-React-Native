import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import CustomText from './CustomText';
import {
  randText,
  screenHeight,
  screenWidth,
  useColors,
} from '../utils/Constants';
import { navigate } from '../utils/NavigationUtil';

const Banner = () => {
  const [headingIndex, setHeadingIndex] = useState(0);
  const headingRef = useRef(0);
  useEffect(() => {
    const interval = setInterval(() => {
      headingRef.current =
        headingRef.current + 1 >= randText.headings.length
          ? 0
          : headingRef.current + 1;
      setHeadingIndex(headingRef.current);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const Colors = useColors();
  return (
    <TouchableOpacity
      onPress={() => navigate('roll')}
      style={[
        styles.vaultInfoContainer,
        {
          backgroundColor: Colors.lockButton,
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <CustomText fontFamily="Okra-Bold" fontSize={14}>
          {randText.headings[headingIndex].title}
        </CustomText>
        <CustomText
          fontFamily="Okra-Regular"
          fontSize={12}
          style={{ marginTop: 5 }}
        >
          {randText.headings[headingIndex].description}
        </CustomText>
      </View>

      <Image
        source={require('../assets/images/logo.png')}
        style={styles.vaultImageContainer}
      />
    </TouchableOpacity>
  );
};

export default Banner;

const styles = StyleSheet.create({
  vaultInfoContainer: {
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: screenHeight * 0.14,
  },
  vaultImageContainer: {
    width: screenWidth * 0.2,
    height: screenWidth * 0.2,
    resizeMode: 'contain',
  },
});
