import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';

type DaejeonStampNavigationProp = StackNavigationProp<RootStackParamList, 'RecommendedPlace'>;

const DaejeonStamp = () => {
  const navigation = useNavigation<DaejeonStampNavigationProp>();

  const handleNavigateToRecommended = () => {
    navigation.navigate('RecommendedPlace');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleNavigateToRecommended}>
        <Text style={styles.buttonText}>추천 장소 보기</Text>
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DaejeonStamp;
