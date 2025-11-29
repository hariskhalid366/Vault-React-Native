import React, { use } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { navigationRef } from '../utils/NavigationUtil';
import { useColors } from '../utils/Constants';
import { useMMKVObject } from 'react-native-mmkv';
import { storage } from '../db/mmkv';

import WhiteScreen from '../screen/Security/WhiteScreen';
import GoogleSigninScreen from '../screen/Security/GoogleSignin';
import LockScreen from '../screen/Security/LockScreen';
import HomeScreen from '../screen/MainScreen/HomeScreen';
import SettingScreen from '../screen/MainScreen/SettingScreen';
import AssetsScreen from '../screen/MainScreen/AssetsScreen';
import BrowserScreen from '../screen/MainScreen/BrowserScreen';
import PasswordScreen from '../screen/MainScreen/PasswordScreen';
import MoveFiles from '../screen/MainScreen/MoveFiles';
import AssetViewer from '../screen/MainScreen/AssetViewer';
import AudioPicker from '../screen/MainScreen/AudioPicker';
import CameraRoll from '../screen/MainScreen/CameraRoll';

const Stack = createNativeStackNavigator();

const Route = () => {
  const theme = useColors();

  const [user] = useMMKVObject('UserData', storage);

  const appTheme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.primary,
      text: theme.text,
      background: theme.background,
      card: theme.background,
      notification: theme.background,
      border: theme.icons,
    },
  };

  return (
    <NavigationContainer theme={appTheme} ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={user !== undefined || user?.skip ? 'lock' : 'signin'}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: theme.background },
          orientation: 'portrait_up',
        }}
      >
        <Stack.Screen
          name="lock"
          component={LockScreen}
          options={{ animation: 'fade_from_bottom' }}
        />
        <Stack.Screen name="signin" component={GoogleSigninScreen} />
        <Stack.Screen name="white" component={WhiteScreen} />
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="setting" component={SettingScreen} />
        <Stack.Screen name="asset" component={AssetsScreen} />
        <Stack.Screen name="browser" component={BrowserScreen} />
        <Stack.Screen name="password" component={PasswordScreen} />
        <Stack.Screen name="move" component={MoveFiles} />
        <Stack.Screen
          name="roll"
          component={CameraRoll}
          options={{ animation: 'fade_from_bottom' }}
        />
        <Stack.Screen
          name="assetviewer"
          component={AssetViewer}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="audiopicker"
          component={AudioPicker}
          options={{ animation: 'fade_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Route;
