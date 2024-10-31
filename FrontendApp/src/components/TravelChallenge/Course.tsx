import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';

type CourseNavigationProp = StackNavigationProp<RootStackParamList, 'ChallengeDetail'>;

const Course = () => {
  const navigation = useNavigation<CourseNavigationProp>();

  const goToChallengeDetail = () => {
    navigation.navigate('ChallengeDetail');
  };

  return (
    <View>
      <Text>대전왔슈 제공 대전 여행 챌린지 코스</Text>

      <TouchableOpacity onPress={goToChallengeDetail}>
        <Text>대전 빵지순례 코스 챌린지</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Course;
