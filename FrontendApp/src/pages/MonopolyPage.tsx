import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 16,
    elevation: 3,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
});

const MonopolyPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>부루마블로 즐기는 대전 여행 🎲</Text>
      <Text style={styles.description}>2팀의 대결 모드도 가능!</Text>
      <Button title="마블와슈 하러가기!" color="#4CAF50" />
    </View>
  );
};

export default MonopolyPage;
