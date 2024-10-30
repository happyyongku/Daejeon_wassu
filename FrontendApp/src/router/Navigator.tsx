import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Main from '../pages/Main';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  SignUp: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function Navigator() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen name="Main" component={Main} options={{headerShown: false}} />
      <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
      <Stack.Screen name="SignUp" component={SignUp} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

export default Navigator;
