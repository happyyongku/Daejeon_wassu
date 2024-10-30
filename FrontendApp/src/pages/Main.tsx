import React from 'react';
import {View, Button} from 'react-native';
import SearchBar from '../components/SearchBar';
import CategoryList from '../components/CategoryList';
import RecommendedPlace from '../components/RecommendedPlace';
import TravelChallenge from '../components/TravelChallenge';
import Community from '../components/Community';
import MonopolyPage from '../components/MonopolyPage';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const MainPage = () => {
  const navigation = useNavigation<MainScreenNavigationProp>();

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View>
      <SearchBar />
      <RecommendedPlace />
      <CategoryList />
      <TravelChallenge />
      <MonopolyPage />
      <Community />
      <Button title="로그인 페이지로 이동" onPress={goToLogin} />
    </View>
  );
};

export default MainPage;
