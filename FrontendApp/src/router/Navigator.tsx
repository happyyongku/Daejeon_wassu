import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Main from '../pages/Main';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import RecommendedPlace from '../pages/RecommendedPlace';
import TravelChallenge from '../pages/TravelChallenge';
import MonopolyPage from '../pages/MonopolyPage';
import Community from '../pages/Community';
import Ar from '../pages/Ar';
import FindPassword from '../pages/FindPassword';

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  SignUp: undefined;
  RecommendedPlace: undefined;
  TravelChallenge: undefined;
  MonopolyPage: undefined;
  Community: undefined;
  Ar: undefined;
  FindPassword: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function Navigator() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen name="Main" component={Main} options={{headerShown: false}} />
      <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
      <Stack.Screen name="SignUp" component={SignUp} options={{headerShown: false}} />
      <Stack.Screen
        name="RecommendedPlace"
        component={RecommendedPlace}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TravelChallenge"
        component={TravelChallenge}
        options={{headerShown: false}}
      />
      <Stack.Screen name="MonopolyPage" component={MonopolyPage} options={{headerShown: false}} />
      <Stack.Screen name="Community" component={Community} options={{headerShown: false}} />
      <Stack.Screen name="Ar" component={Ar} options={{headerShown: false}} />
      <Stack.Screen name="FindPassword" component={FindPassword} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

export default Navigator;
