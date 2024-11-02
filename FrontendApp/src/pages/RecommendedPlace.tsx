import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import RecommendedSearchBar from '../components/RecommendedPlace/RecommendedSearchBar';
import CategoryList from '../components/RecommendedPlace/CategoryList';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';

const {width} = Dimensions.get('window');

type RecommendedPlaceNavigationProp = StackNavigationProp<RootStackParamList, 'PlaceList'>;

const RecommendedPlace = () => {
  const navigation = useNavigation<RecommendedPlaceNavigationProp>();

  const goToPlaceList = () => {
    navigation.navigate('PlaceList');
  };

  return (
    <View style={styles.container}>
      <RecommendedSearchBar />
      <CategoryList />

      <TouchableOpacity onPress={goToPlaceList}>
        <Text>전체 관광지</Text>
      </TouchableOpacity>

      <Text>전체 관광지 추천</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.06,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});

export default RecommendedPlace;
