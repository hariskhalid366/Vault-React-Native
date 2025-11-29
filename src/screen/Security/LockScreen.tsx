import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import * as Icons from 'lucide-react-native';
import CustomText from '../../component/CustomText';
import { screenHeight, screenWidth, useColors } from '../../utils/Constants';
import { storage } from '../../db/mmkv';
import {
  useMMKVBoolean,
  useMMKVObject,
  useMMKVString,
} from 'react-native-mmkv';
import { goBack, resetAndNavigate } from '../../utils/NavigationUtil';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import showToast from '../../component/Toast';
import { FasterImageView } from '@rraut/react-native-faster-image';
import { useNavigation } from '@react-navigation/native';
import { authenticateWithOptions } from '@sbaiahmed1/react-native-biometrics';

interface UserData {
  _user: {
    photoURL?: string;
    displayName?: string;
    [key: string]: any;
  };
}

const CODE_LENGTH = 6;
const OFFSET = 20;
const TIME = 80;

const LockScreen = () => {
  const navigateion = useNavigation();
  const Colors = useColors();
  const [code, setCode] = useState<number[]>([]);
  const [activeCode, setActiveCode] = useMMKVString('lockcode', storage);
  const [biometricEnabled] = useMMKVBoolean('biometric', storage);
  const [user] = useMMKVObject<UserData | undefined>('UserData', storage);

  const giggle = useSharedValue(0);

  // === ANIMATION STYLE ===
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: giggle.value }],
  }));

  // === KEYPAD NUMBERS ===
  const keypadNumbers = useMemo(
    () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 'finger', 0, 'back'],
    [],
  );

  // === HANDLE INPUT ===
  const handleNumberPress = useCallback(
    (num: number) => {
      if (code.length < CODE_LENGTH) {
        setCode(prev => [...prev, num]);
      }
    },
    [code.length],
  );

  const handleBackPress = useCallback(() => {
    setCode(prev => prev.slice(0, -1));
  }, []);

  const triggerGiggle = useCallback(() => {
    giggle.value = withSequence(
      withTiming(-OFFSET, { duration: TIME / 2 }),
      withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
      withTiming(0, { duration: TIME / 2 }),
    );
  }, [giggle]);

  // === VALIDATE CODE ===
  useEffect(() => {
    if (code.length !== CODE_LENGTH) return;

    const enteredCode = code.join('');

    if (!activeCode) {
      setActiveCode(enteredCode);
      setCode([]);
      showToast('Re-enter Password');
      return;
    }

    if (enteredCode === activeCode) {
      if (navigateion.canGoBack()) {
        goBack();
      } else {
        resetAndNavigate('home');
      }
    } else {
      triggerGiggle();
      setCode([]);
      showToast('Incorrect Password');
    }
  }, [code, activeCode, setActiveCode, triggerGiggle]);

  // === PROMPT USER TO SET PASSWORD ===
  useEffect(() => {
    if (!activeCode) showToast('Set Password To Continue');
  }, [activeCode]);

  const biometric = async () => {
    try {
      const result = await authenticateWithOptions({
        title: 'Secure Login',
        subtitle: 'Verify your identity',
        description: 'Use your biometric to access your account securely',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Password',
        allowDeviceCredentials: true, // Allow PIN/password fallback
        disableDeviceFallback: false, // Enable fallback options
      });

      if (result.success) {
        resetAndNavigate('home');
        console.log('Authentication successful!');
        // User authenticated successfully
        // navigateToSecureArea();
      } else {
        console.log('Authentication failed:', result.error);
        console.log('Error code:', result.errorCode);
        // Handle authentication failure
        // handleAuthFailure(result.errorCode);
      }
    } catch (error) {
      showToast('Biometric failed');
    }
  };

  return (
    <View style={styles.container}>
      {user?._user?.photoURL && (
        <FasterImageView
          source={{ uri: user._user.photoURL }}
          style={styles.profileImage}
        />
      )}

      <CustomText variant="h2">
        Welcome {user?._user?.displayName || ''}
      </CustomText>

      {/* CODE DOTS */}
      <Animated.View style={[styles.codeContainer, animatedStyle]}>
        {Array.from({ length: CODE_LENGTH }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i < code.length ? Colors.text : Colors.lockButton,
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* KEYPAD */}
      <View style={styles.keypad}>
        {keypadNumbers.map((key, index) => {
          if (key === 'finger') {
            return biometricEnabled ? (
              <TouchableOpacity
                onPress={biometric}
                key={index}
                style={[styles.key, { backgroundColor: Colors.lockButton }]}
              >
                <Icons.FingerprintIcon size={26} color={Colors.text} />
              </TouchableOpacity>
            ) : (
              <View key={index} style={styles.key} />
            );
          }

          if (key === 'back') {
            return code.length > 0 ? (
              <TouchableOpacity
                key={index}
                onPress={handleBackPress}
                style={[styles.key, { backgroundColor: Colors.lockButton }]}
              >
                <Icons.XIcon size={24} color={Colors.text} />
              </TouchableOpacity>
            ) : (
              <View key={index} style={styles.key} />
            );
          }

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleNumberPress(Number(key))}
              style={[styles.key, { backgroundColor: Colors.lockButton }]}
            >
              <CustomText fontFamily="Okra-Bold" variant="h1">
                {key}
              </CustomText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default React.memo(LockScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: screenHeight * 0.035,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: '#fff',
  },
  codeContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  keypad: {
    width: screenWidth * 0.8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 25,
  },
  key: {
    borderRadius: 15,
    width: screenWidth * 0.22,
    height: screenWidth * 0.22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
