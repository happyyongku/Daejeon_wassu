import React from 'react';
import {View, Text, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

function Main(): React.JSX.Element {
  const navigation = useNavigation<MainScreenNavigationProp>();

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View>
      <Text>메인</Text>
      <Button title="로그인 페이지로 이동" onPress={goToLogin} />
    </View>
  );
}

export default Main;
