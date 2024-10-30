import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CategoryList from '../components/CategoryList';

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

const RecommendedPlace = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>비 오는 날에도 즐길 수 있는 실내 대전 여행지</Text>
      <CategoryList />
    </View>
  );
};

export default RecommendedPlace;
