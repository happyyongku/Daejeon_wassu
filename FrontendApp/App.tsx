import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Navigator from './src/router/Navigator';

export default function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
}
