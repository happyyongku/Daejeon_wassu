import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';

type MyTripsNavigationProp = StackNavigationProp<RootStackParamList, 'TravelItinerary'>;

const MyTrips = () => {
  const navigation = useNavigation<MyTripsNavigationProp>();

  const handleNavigateToItinerary = () => {
    navigation.navigate('TravelItinerary');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleNavigateToItinerary}>
        <Text style={styles.buttonText}>일정짜기</Text>
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

export default MyTrips;
