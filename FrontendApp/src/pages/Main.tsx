import React from 'react';
import {View, Button} from 'react-native';
import SearchBar from '../components/SearchBar';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const MainPage = () => {
  const navigation = useNavigation<MainScreenNavigationProp>();

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  const goToRecommend = () => {
    navigation.navigate('RecommendedPlace');
  };

  const goToTravelChallenge = () => {
    navigation.navigate('TravelChallenge');
  };

  const goToMonopolyPage = () => {
    navigation.navigate('MonopolyPage');
  };

  const goToCommunity = () => {
    navigation.navigate('Community');
  };

  const goToAr = () => {
    navigation.navigate('Ar');
  };

  return (
    <View>
      <SearchBar />
      <Button title="추천 이동" onPress={goToRecommend} />
      <Button title="챌린지 이동" onPress={goToTravelChallenge} />
      <Button title="부루마블 이동" onPress={goToMonopolyPage} />
      <Button title="커뮤니티 이동" onPress={goToCommunity} />
      <Button title="로그인 페이지로 이동" onPress={goToLogin} />
      <Button title="ar 이동" onPress={goToAr} />
    </View>
  );
};

export default MainPage;
