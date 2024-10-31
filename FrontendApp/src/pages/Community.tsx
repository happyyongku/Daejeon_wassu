import React from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';

type CommunityNavigationProp = StackNavigationProp<RootStackParamList>;

const Community = () => {
  const navigation = useNavigation<CommunityNavigationProp>();

  const goToWriting = () => {
    navigation.navigate('Writing');
  };

  const goToCommunitySearch = () => {
    navigation.navigate('CommunitySearch');
  };

  return (
    <View>
      <Text>여행기</Text>
      <TouchableOpacity onPress={goToCommunitySearch}>
        <Text>검색</Text>
      </TouchableOpacity>
      <Button title="글작성" onPress={goToWriting} />
    </View>
  );
};

export default Community;
