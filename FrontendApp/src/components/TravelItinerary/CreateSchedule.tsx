import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';

type CreateScheduleNavigationProp = StackNavigationProp<RootStackParamList, 'Details'>;

const CreateSchedule = () => {
  const navigation = useNavigation<CreateScheduleNavigationProp>();

  const goToDetails = () => {
    navigation.navigate('Details');
  };

  return (
    <View style={styles.container}>
      <Text>여행 언제가유?</Text>

      <TouchableOpacity style={styles.button} onPress={goToDetails}>
        <Text>날자확정</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#418663',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default CreateSchedule;
