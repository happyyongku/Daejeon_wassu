import React from 'react';
import {View, Button} from 'react-native';
import SearchBar from '../components/Main/SearchBar';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';
import Header from '../components/common/Header';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const MainPage = () => {
  const navigation = useNavigation<MainScreenNavigationProp>();

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
  const goToTravelItinerary = () => {
    navigation.navigate('TravelItinerary');
  };

  return (
    <View>
      <Header />
      <SearchBar />
      <Button title="추천 대전관광지" onPress={goToRecommend} />
      <Button title="챌린지 코스" onPress={goToTravelChallenge} />
      <Button title="일정" onPress={goToTravelItinerary} />
      <Button title="부루마블" onPress={goToMonopolyPage} />
      <Button title="커뮤니티" onPress={goToCommunity} />
      <Button title="ar" onPress={goToAr} />
    </View>
  );
};

export default MainPage;
