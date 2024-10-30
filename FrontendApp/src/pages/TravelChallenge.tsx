import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 16,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

const TravelChallenge = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>대전 여행 코스 챌린지</Text>
    </View>
  );
};

export default TravelChallenge;
