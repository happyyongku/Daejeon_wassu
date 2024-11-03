import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';

type PlaceDetailRouteProp = {
  name: string;
};

const PlaceDetail = () => {
  const route = useRoute();
  const {name} = route.params as PlaceDetailRouteProp;

  return (
    <View style={styles.container}>
      <Text style={styles.placeName}>{name}</Text>
      <Text style={styles.detailText}>상세정보</Text>
      <Text style={styles.detailText}>설명</Text>
      <Text style={styles.detailText}>방문후기</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  placeName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default PlaceDetail;
