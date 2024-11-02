import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const ChangeInfo = () => {
  return (
    <View style={styles.container}>
      <Text>회원정보변경</Text>
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

export default ChangeInfo;
