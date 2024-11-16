import React, {useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';
import SearchIcon from '../../assets/imgs/search.svg';

type ChoiceNavigationProp = StackNavigationProp<RootStackParamList>;

const Choice = () => {
  const navigation = useNavigation<ChoiceNavigationProp>();
  const {width, height} = useWindowDimensions();

  useEffect(() => {
    Orientation.lockToLandscape();
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  const goToGameOne = () => {
    navigation.navigate('GameOne');
  };

  const goToGameTwo = () => {
    navigation.navigate('GameTwo');
  };

  const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: width,
      height: height,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 36,
      fontWeight: 'bold',
      fontFamily: 'Pretendard-Bold',
      color: '#333',
      position: 'absolute',
      top: 10,
      textAlign: 'center',
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '70%',
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      width: width * 0.25,
      height: height * 0.55,
      padding: 10,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      fontFamily: 'Pretendard-Bold',
      marginBottom: 20,
      color: '#333',
    },
    button: {
      backgroundColor: '#E0F2E0',
      borderColor: '#418663',
      borderWidth: 1.5,
      width: '80%',
      paddingVertical: 8,
      borderRadius: 25,
      marginBottom: 15,
      alignItems: 'center',
    },
    buttonText: {
      color: '#333333',
      fontSize: 14,
      fontFamily: 'Pretendard-Medium',
    },
    inputGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '80%',
      marginBottom: 15,
    },
    label: {
      fontSize: 16,
      color: '#333',
      marginRight: 10,
      fontFamily: 'Pretendard-Medium',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      backgroundColor: '#E0F2E0',
      borderColor: '#418663',
      borderWidth: 1,
      borderRadius: 25,
      paddingHorizontal: 10,
      height: 35,
    },
    input: {
      flex: 1,
      fontSize: 11,
      color: '#333',
      fontFamily: 'Pretendard-Regular',
    },
    icon: {
      marginLeft: 5,
    },
    createButton: {
      backgroundColor: '#418663',
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderRadius: 25,
      marginTop: 10,
    },
    createButtonText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
      fontFamily: 'Pretendard-Bold',
    },
  });

  return (
    <ImageBackground
      source={require('../../assets/imgs/mono/DBack.jpg')}
      style={styles.background}
      resizeMode="cover">
      <Text style={styles.title}>게임 만들기</Text>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>테마 보드</Text>
          <TouchableOpacity style={styles.button} onPress={goToGameOne}>
            <Text style={styles.buttonText}>지하철</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToGameOne}>
            <Text style={styles.buttonText}>맛집</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToGameOne}>
            <Text style={styles.buttonText}>과학</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>맞춤 보드</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>출발지</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} />
              <SearchIcon width={20} height={20} style={styles.icon} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>도착지</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} />
              <SearchIcon width={20} height={20} style={styles.icon} />
            </View>
          </View>

          <TouchableOpacity style={styles.createButton} onPress={goToGameTwo}>
            <Text style={styles.createButtonText}>생성하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Choice;
