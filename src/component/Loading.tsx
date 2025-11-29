import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React from 'react';

const Loading = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={'#fff'} size={'small'} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00000088',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
});
