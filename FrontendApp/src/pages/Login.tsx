import React from 'react';
import {View, Text, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login = (): React.JSX.Element => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const goToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View>
      <Text>로그인 페이지</Text>
      <Button title="회원가입 페이지로 이동" onPress={goToSignUp} />
    </View>
  );
};

export default Login;
