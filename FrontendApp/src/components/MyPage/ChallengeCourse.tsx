import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';

type ChallengeCourseNavigationProp = StackNavigationProp<RootStackParamList>;

const ChallengeCourse = () => {
  const navigation = useNavigation<ChallengeCourseNavigationProp>();

  const handleNavigateToChallenge = () => {
    navigation.navigate('TravelChallenge');
  };

  const handleNavigateToOngoingChallenge = () => {
    navigation.navigate('OngoingChallenge');
  };

  const handleNavigateToCompletedChallenge = () => {
    navigation.navigate('CompletedChallenge');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleNavigateToChallenge}>
        <Text style={styles.buttonText}>챌린지 코스</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleNavigateToOngoingChallenge}>
        <Text style={styles.buttonText}>진행중챌린지</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleNavigateToCompletedChallenge}>
        <Text style={styles.buttonText}>완료챌린지</Text>
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

export default ChallengeCourse;
