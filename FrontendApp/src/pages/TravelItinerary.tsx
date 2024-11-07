import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  ImageBackground,
} from 'react-native';
import DeleteConfirmationModal from '../components/MyPage/DeleteConfirmationModal';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';

type TravelItineraryNavigationProp = StackNavigationProp<RootStackParamList>;
const {width} = Dimensions.get('window');
interface TripItem {
  id: string;
  title: string;
  date: string;
  places: string;
}
const TravelItinerary = () => {
  const navigation = useNavigation<TravelItineraryNavigationProp>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const goToRecommend = () => {
    navigation.navigate('RecommendedPlace');
  };

  const goToCreateSchedule = () => {
    navigation.navigate('CreateSchedule');
  };

  const goToTravelChallenge = () => {
    navigation.navigate('TravelChallenge');
  };
  const handleTrashPress = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };
  const renderTripItem = ({item}: {item: TripItem}) => (
    <View style={styles.tripContainer}>
      <View>
        <Text style={styles.tripTitle}>{item.title}</Text>
        <Text style={styles.tripDate}>{item.date}</Text>
        <Text style={styles.tripPlaces}>{item.places}</Text>
      </View>
      <Image source={require('../assets/imgs/travel1.png')} style={styles.tripImage} />
      <TouchableOpacity style={styles.trashButton} onPress={handleTrashPress}>
        <Image source={require('../assets/imgs/trash.png')} style={styles.trashIcon} />
      </TouchableOpacity>
    </View>
  );
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

      <TouchableOpacity style={styles.addButton} onPress={goToCreateSchedule}>
        <Image source={require('../assets/imgs/plus.png')} style={styles.plusIcon} />
        <View style={styles.textContainer}>
          <Text style={styles.addButtonText}>대전 여행 일정 추가하기</Text>
          <Text style={styles.addButtonSubtitle}>대전와슈와 대전 여행을 함께하세요</Text>
        </View>
      </TouchableOpacity>
      {/* 대전와슈 추천 코스 보기 */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>대전와슈 추천 코스 보기</Text>
        <Image source={require('../assets/imgs/recommend.png')} style={styles.icon} />
        <TouchableOpacity onPress={goToTravelChallenge}>
          <Text style={styles.viewAllText}>전체 코스 보기</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <ImageBackground source={require('../assets/imgs/hotLong.png')} style={styles.image}>
            <View style={styles.overlay}>
              <Text style={styles.overlayTitle}>대전 핫스팟 투어</Text>
              <Text style={styles.overlayDescription}>사람들이 많이 찾는 대전 핫플레이스</Text>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.imageWrapper}>
          <ImageBackground source={require('../assets/imgs/breadLong.png')} style={styles.image}>
            <View style={styles.overlay}>
              <Text style={styles.overlayTitle}>대전 빵지순례</Text>
              <Text style={styles.overlayDescription}>대전의 다양한 빵집을 소개합니다</Text>
            </View>
          </ImageBackground>
        </View>
      </ScrollView>

      {/* 다가오는 여행 */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>다가오는 여행</Text>
        <Image source={require('../assets/imgs/commingsoon.png')} style={styles.icon} />
      </View>
      <FlatList
        data={[
          {
            id: '1',
            title: '현수의 대전 나들이',
            date: '2024.10.24 ~ 2024.10.26',
            places: '4개 관광지',
          },
        ]}
        renderItem={renderTripItem}
        keyExtractor={item => item.id}
        style={styles.tripList}
        scrollEnabled={false} // FlatList 내부 스크롤을 비활성화
      />
      {/* 지난 여행 */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>지난 여행</Text>
        <Image source={require('../assets/imgs/past.png')} style={styles.icon} />
      </View>
      <FlatList
        data={[
          {
            id: '2',
            title: '현수의 지난 여행',
            date: '2024.10.20 ~ 2024.10.21',
            places: '3개 관광지',
          },
        ]}
        renderItem={renderTripItem}
        keyExtractor={item => item.id}
        style={styles.tripList}
        scrollEnabled={false} // FlatList 내부 스크롤을 비활성화
      />
      {/* 삭제 확인 모달 */}
      <DeleteConfirmationModal
        visible={isModalVisible}
        onCancel={closeModal}
        onConfirm={closeModal}
      />
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
    // marginBottom: 10,
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
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 20, // 이미지와 텍스트 사이 간격
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
  },
  addButton: {
    width: width * 0.9,
    height: 80,
    backgroundColor: 'rgba(153, 153, 153, 0.05)',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    alignSelf: 'center',
  },
  plusIcon: {
    width: 33,
    height: 33,
    marginBottom: 5,
  },
  textContainer: {
    flexDirection: 'column',
    marginLeft: 20,
  },
  addButtonText: {
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold',
    color: '#333333',
  },
  addButtonSubtitle: {
    fontSize: 10,
    fontFamily: 'Pretendard-Regular',
    color: 'rgba(51, 51, 51, 0.8)', // 80% 투명도 적용
    marginTop: 5,
  },
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold',
    color: '#999999',
    marginTop: 20,
    marginLeft: 20,
  },
  icon: {
    width: 25,
    height: 25,
    marginLeft: 10,
    marginTop: 15,
  },
  imageContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  imageWrapper: {
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: 260,
    height: 120,
    justifyContent: 'flex-start',
  },
  overlay: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  overlayTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 5,
  },
  overlayDescription: {
    fontSize: 10,
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Regular',
  },
  tripList: {
    marginBottom: 20,
  },
  tripContainer: {
    width: '90%',
    height: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginLeft: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'space-between',
  },
  tripTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  tripDate: {
    fontSize: 12,
    color: '#999999',
    marginTop: 15,
  },
  tripPlaces: {
    fontSize: 12,
    color: '#999999',
  },
  tripImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginLeft: 50,
  },
  trashButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 5,
    marginBottom: 50,
  },
  trashIcon: {
    width: 24,
    height: 24,
  },
});

export default TravelItinerary;
