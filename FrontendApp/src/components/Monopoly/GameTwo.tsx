import React, {useEffect} from 'react';
import {View, Text, ImageBackground, StyleSheet, Dimensions} from 'react-native';
import Orientation from 'react-native-orientation-locker';

const {width, height} = Dimensions.get('window');
const GameTwo = () => {
  useEffect(() => {
    Orientation.lockToLandscape();
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/imgs/mono/DBack.jpg')}
      style={styles.background}
      resizeMode="cover">
      <View>
        <Text>GameTwo 화면 테스트</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GameTwo;
