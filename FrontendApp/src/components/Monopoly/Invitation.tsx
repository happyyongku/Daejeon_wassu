import React, {useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';

type InvitationNavigationProp = StackNavigationProp<RootStackParamList>;
type InvitationRouteProp = RouteProp<RootStackParamList, 'Invitation'>;

const Invitation = () => {
  const route = useRoute<InvitationRouteProp>();
  const {single} = route.params || {};
  console.log('Invitation에서 받은 single 값:', single);
  const navigation = useNavigation<InvitationNavigationProp>();
  const {width, height} = useWindowDimensions();

  useEffect(() => {
    Orientation.lockToLandscape();
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  const goToGameTwo = () => {
    navigation.navigate('GameTwo');
  };

  const goToChoice = () => {
    navigation.navigate('Choice', {single}); // 동일한 single 값을 전달
  };

  const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: width,
      height: height,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
      height: '70%',
    },
    iconRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '60%',
      alignItems: 'center',
    },
    icon: {
      width: 150,
      height: 150,
    },
    inputRow: {
      flexDirection: 'column',
      width: '50%',
    },
    inputRows: {
      width: '40%',
      backgroundColor: '#E0F2E0',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 5,
      borderRadius: 15,
    },
    label: {
      fontSize: 16,
      color: '#333',
      fontFamily: 'Pretendard-Medium',
    },
    underlineInput: {
      width: '80%',
      height: 36,
      borderBottomWidth: 3,
      borderBottomColor: '#418663',
      fontFamily: 'Pretendard-Regular',
      textAlign: 'center',
      color: '#333',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '60%',
      alignItems: 'center',
    },
    button: {
      paddingVertical: 10,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      width: '25%', // 버튼 너비를 설정하여 두 버튼이 균등하게 보이도록
    },
    greenButton: {
      backgroundColor: '#418663',
    },
    orangeButton: {
      backgroundColor: '#F49C30',
    },
    buttonText: {
      color: '#333333',
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'Pretendard-SemilBold',
    },
  });

  return (
    <ImageBackground
      source={require('../../assets/imgs/mono/DBack.jpg')}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.container}>
        <View style={styles.iconRow}>
          <Image source={require('../../assets/imgs/mono/ghome.png')} style={styles.icon} />
          <Image source={require('../../assets/imgs/mono/yhome.png')} style={styles.icon} />
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputRows}>
            <Text style={styles.label}>코드 입력</Text>
            <TextInput style={styles.underlineInput} placeholderTextColor="#333" />
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.greenButton]} onPress={goToGameTwo}>
            <Text style={styles.buttonText}>방 들어가기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.orangeButton]} onPress={goToChoice}>
            <Text style={styles.buttonText}>방 만들기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Invitation;
