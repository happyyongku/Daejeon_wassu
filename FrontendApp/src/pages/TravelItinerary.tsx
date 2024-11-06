import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';

type TravelItineraryNavigationProp = StackNavigationProp<RootStackParamList>;

const TravelItinerary = () => {
  const navigation = useNavigation<TravelItineraryNavigationProp>();

  const goToRecommend = () => {
    navigation.navigate('RecommendedPlace');
  };

  const goToCreateSchedule = () => {
    navigation.navigate('CreateSchedule');
  };

  const goToTravelChallenge = () => {
    navigation.navigate('TravelChallenge');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>대전,{'\n'}여행왔슈?</Text>
          <Image source={require('../assets/imgs/dajeonlogo.png')} style={styles.logo} />
        </View>
        <TouchableOpacity style={styles.headerButton} onPress={goToRecommend}>
          <Image source={require('../assets/imgs/list.png')} style={styles.buttonIcon} />
          <Text style={styles.headerButtonText}>대전 관광지 보기</Text>
        </TouchableOpacity>
      </View>

      {/* 대전 여행 일정 추가하기 */}
      <TouchableOpacity style={styles.scheduleButton} onPress={goToCreateSchedule}>
        <Text style={styles.scheduleButtonText}>대전 여행 일정 추가하기</Text>
        <Text style={styles.scheduleButtonSubtitle}>대전와슈와 대전 여행을 함께하세요</Text>
      </TouchableOpacity>

      {/* 대전와슈 추천 코스 보기 */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>대전와슈 추천 코스 보기</Text>
        <TouchableOpacity onPress={goToTravelChallenge}>
          <Text style={styles.viewAllText}>전체 코스 보기</Text>
        </TouchableOpacity>
      </View>

      {/* 다가오는 여행 */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>다가오는 여행</Text>
      </View>

      {/* 지난 여행 */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>지난 여행</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#418663',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
    padding: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: 30,
  },
  headerButton: {
    flexDirection: 'row', // 이미지와 텍스트를 가로로 배치
    alignItems: 'center', // 이미지와 텍스트의 수직 가운데 정렬
    width: '48%',
    backgroundColor: '#2F5A50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 5, // 이미지와 텍스트 사이 간격
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
  },
  scheduleButton: {
    backgroundColor: '#F3F7FB',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  scheduleButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scheduleButtonSubtitle: {
    color: '#999999',
    fontSize: 12,
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#418663',
    textDecorationLine: 'underline',
  },
});

export default TravelItinerary;
