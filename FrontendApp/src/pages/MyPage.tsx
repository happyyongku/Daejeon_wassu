import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import MyTrips from '../components/MyPage/MyTrips';
import DaejeonStamp from '../components/MyPage/DaejeonStamp';
import ChallengeCourse from '../components/MyPage/ChallengeCourse';
import TravelLog from '../components/MyPage/TravelLog';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';

const {width} = Dimensions.get('window');

type MyPageNavigationProp = StackNavigationProp<RootStackParamList>;

const MyPage = () => {
  const navigation = useNavigation<MyPageNavigationProp>();
  const [activeTab, setActiveTab] = useState<
    'MyTrips' | 'DaejeonStamp' | 'ChallengeCourse' | 'TravelLog'
  >('MyTrips');

  const goToProfile = () => {
    navigation.navigate('Profile');
  };

  const goToDogam = () => {
    navigation.navigate('Dogam');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'MyTrips':
        return <MyTrips />;
      case 'DaejeonStamp':
        return <DaejeonStamp />;
      case 'ChallengeCourse':
        return <ChallengeCourse />;
      case 'TravelLog':
        return <TravelLog />;
      default:
        return <MyTrips />;
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={goToProfile}>
          <Text>프로필</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToDogam}>
          <Text>도감</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('MyTrips')} style={styles.tabButton}>
          <Text style={[styles.tabText, activeTab === 'MyTrips' && styles.activeTabText]}>
            나의 여행
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('DaejeonStamp')} style={styles.tabButton}>
          <Text style={[styles.tabText, activeTab === 'DaejeonStamp' && styles.activeTabText]}>
            대전 스탬프
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('ChallengeCourse')} style={styles.tabButton}>
          <Text style={[styles.tabText, activeTab === 'ChallengeCourse' && styles.activeTabText]}>
            챌린지 코스
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('TravelLog')} style={styles.tabButton}>
          <Text style={[styles.tabText, activeTab === 'TravelLog' && styles.activeTabText]}>
            여행기
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.06,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabButton: {
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTabText: {
    color: '#418663',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#418663',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
});

export default MyPage;
