import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Main from '../pages/Main';
import Login from '../pages/Login';

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function Navigator() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen name="Main" component={Main} options={{headerShown: false}} />
      <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

export default Navigator;
