import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';

const {width} = Dimensions.get('window');

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const Login = (): React.JSX.Element => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const emailLabelStyle = isEmailFocused ? styles.focusedLabel : styles.defaultLabel;
  const passwordLabelStyle = isPasswordFocused ? styles.focusedLabel : styles.defaultLabel;
  const emailInputStyle = isEmailFocused ? styles.focusedInput : styles.defaultInput;
  const passwordInputStyle = isPasswordFocused ? styles.focusedInput : styles.defaultInput;

  const handleLogin = () => {};

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleForgotPassword = () => {
    navigation.navigate('FindPassword');
  };

  return (
    <View style={styles.container}>
      <Text style={emailLabelStyle}>이메일</Text>
      <TextInput
        style={emailInputStyle}
        placeholder="이메일"
        placeholderTextColor="#F1F1F1"
        value={email}
        onChangeText={setEmail}
        onFocus={() => setIsEmailFocused(true)}
        onBlur={() => setIsEmailFocused(false)}
      />

      <Text style={passwordLabelStyle}>비밀번호</Text>
      <TextInput
        style={passwordInputStyle}
        placeholder="비밀번호"
        placeholderTextColor="#F1F1F1"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        onFocus={() => setIsPasswordFocused(true)}
        onBlur={() => setIsPasswordFocused(false)}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>비밀번호를 잊어버렸어요</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.08,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  defaultLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  focusedLabel: {
    fontSize: 14,
    color: '#418663',
    marginBottom: 4,
  },
  defaultInput: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#F1F1F1',
    paddingVertical: 5,
    fontSize: 20,
    marginBottom: 20,
    color: '#F1F1F1',
  },
  focusedInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#418663',
    paddingVertical: 8,
    fontSize: 20,
    marginBottom: 20,
    color: '#333',
  },
  loginButton: {
    backgroundColor: 'rgba(65, 134, 99, 0.6)',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    width: '65%',
    alignSelf: 'center',
  },
  signUpButton: {
    backgroundColor: '#C8DECB',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    width: '65%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordText: {
    color: 'rgba(51, 51, 51, 0.5)',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default Login;
