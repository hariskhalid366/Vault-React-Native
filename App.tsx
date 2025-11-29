import React from 'react';
import Route from './src/navigation/Route';
import { UserInactivity } from './src/component/UserInactivity';
import { StatusBar, useColorScheme } from 'react-native';
import { useColors } from './src/utils/Constants';

const App = () => {
  const color = useColorScheme();
  const Colors = useColors();
  return (
    <UserInactivity>
      <StatusBar
        barStyle={color === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.background}
      />

      <Route />
    </UserInactivity>
  );
};
export default App;
