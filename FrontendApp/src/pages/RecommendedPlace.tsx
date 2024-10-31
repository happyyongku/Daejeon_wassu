import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import RecommendedSearchBar from '../components/RecommendedPlace/RecommendedSearchBar';
import CategoryList from '../components/RecommendedPlace/CategoryList';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';

type RecommendedPlaceNavigationProp = StackNavigationProp<RootStackParamList, 'PlaceList'>;

const RecommendedPlace = () => {
  const navigation = useNavigation<RecommendedPlaceNavigationProp>();

  const goToPlaceList = () => {
    navigation.navigate('PlaceList');
  };

  return (
    <View>
      <RecommendedSearchBar />
      <CategoryList />

      <TouchableOpacity onPress={goToPlaceList}>
        <Text>전체 관광지</Text>
      </TouchableOpacity>

      <Text>전체 관광지 추천</Text>
    </View>
  );
};

export default RecommendedPlace;
