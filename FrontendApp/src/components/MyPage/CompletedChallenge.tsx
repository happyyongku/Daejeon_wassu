import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
const CompletedChallenge = () => {
  return (
    <View style={styles.container}>
      <Text>완료한챌린지수정</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.06,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
export default CompletedChallenge;
