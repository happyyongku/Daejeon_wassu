import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
const Dogam = () => {
  return (
    <View style={styles.container}>
      <Text>Dogam</Text>
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
export default Dogam;
