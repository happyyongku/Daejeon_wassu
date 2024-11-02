import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const ChangePassword = () => {
  return (
    <View style={styles.container}>
      <Text>비밀번호 변경</Text>
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

export default ChangePassword;
