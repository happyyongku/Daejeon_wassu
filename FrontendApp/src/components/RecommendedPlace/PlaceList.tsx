import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';

type PlaceListNavigationProp = StackNavigationProp<RootStackParamList, 'PlaceDetail'>;

const PlaceList = () => {
  const navigation = useNavigation<PlaceListNavigationProp>();

  const goToPlaceDetail = () => {
    navigation.navigate('PlaceDetail');
  };

  return (
    <View>
      <Text>관광지 조회 리스트페이지</Text>

      <TouchableOpacity onPress={goToPlaceDetail}>
        <Text>한밭 수목원</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PlaceList;
