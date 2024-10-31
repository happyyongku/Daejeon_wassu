import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';

type ProfileNavigationProp = StackNavigationProp<RootStackParamList>;

const Profile = () => {
  const navigation = useNavigation<ProfileNavigationProp>();

  const goToChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const goToChangeInfo = () => {
    navigation.navigate('ChangeInfo');
  };

  return (
    <View style={styles.container}>
      <Text>프로필</Text>
      <TouchableOpacity style={styles.button} onPress={goToChangeInfo}>
        <Text style={styles.buttonText}>닉네임 변경</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={goToChangePassword}>
        <Text style={styles.buttonText}>비밀번호 변경</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#418663',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Profile;
