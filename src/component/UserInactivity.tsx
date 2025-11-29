import React, { useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import { resetAndNavigate } from '../utils/NavigationUtil';
import { mmkvStorage, storage } from '../db/mmkv';

export const UserInactivity = ({ children }: any) => {
  const appState = useRef(AppState.currentState);

  const getLockDuration = () => {
    const savedDuration = storage.getNumber('lockDuration');
    return savedDuration || 3000; // default to 3s if not found
  };

  const recordStartTime = () => {
    const now = Date.now();
    mmkvStorage.setItem('startTime', now);
  };

  const handleAppStateChange = (nextAppState: any) => {
    console.log('AppState changed:', appState.current, '→', nextAppState);

    // Handle inactive (iOS)
    if (Platform.OS === 'ios' && nextAppState === 'inactive') {
      console.log('iOS inactive transition detected');
    }

    // Handle background
    if (nextAppState === 'background') {
      recordStartTime();
    }

    // Handle re-activation
    if (
      nextAppState === 'active' &&
      appState.current.match(/background|inactive/)
    ) {
      const startTime = storage.getNumber('startTime') || 0;
      const elapsed = Date.now() - startTime;
      const lockDuration = getLockDuration();

      console.log(`Elapsed: ${elapsed}ms | Lock after: ${lockDuration}ms`);

      if (elapsed >= lockDuration) {
        // User was inactive beyond limit
        resetAndNavigate('lock');
      }
    }

    appState.current = nextAppState;
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, []);

  return children;
};
