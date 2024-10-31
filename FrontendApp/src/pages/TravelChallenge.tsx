import React from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';

type TravelChallengeNavigationProp = StackNavigationProp<RootStackParamList>;

const TravelChallenge = () => {
  const navigation = useNavigation<TravelChallengeNavigationProp>();

  const goToOngoingChallenge = () => {
    navigation.navigate('OngoingChallenge');
  };

  const goToCourse = () => {
    navigation.navigate('Course');
  };

  const goToCourseDescription = () => {
    navigation.navigate('CourseDescription');
  };

  return (
    <View>
      <Text>챌린지</Text>

      <TouchableOpacity onPress={goToOngoingChallenge}>
        <Text>나의 챌린지</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToCourse}>
        <Text>챌린지 코스</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToCourseDescription}>
        <Text>챌린지 코스가 무엇인가요?</Text>
      </TouchableOpacity>

      <Button title="챗봇에게 코스 물어보기" />
    </View>
  );
};

export default TravelChallenge;
