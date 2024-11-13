import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import Header from '../common/Header';
import MarkerIcon from '../../assets/imgs/markerB.svg';
import HearthIcon from '../../assets/imgs/hearth.svg';

import CalendarIcon from '../../assets/imgs/calendarplus.svg';
import StarIcon from '../../assets/imgs/star.svg';
import StempIcon from '../../assets/imgs/stemp.svg';
import ClockIcon from '../../assets/imgs/clock.svg';
import PhoneIcon from '../../assets/imgs/phone.svg';
import CompassIcon from '../../assets/imgs/compass.svg';
import EditIcon from '../../assets/imgs/edit.svg';
import CustomModal from '../common/CustomModal';
import StepModal from '../common/StepModal';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {getTouristSpotDetails} from '../../api/tourist';
import {favoriteTouristSpot, unfavoriteTouristSpot} from '../../api/tourist';

type PlaceDetailScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const {width} = Dimensions.get('window');

type PlaceDetailRouteProp = {
  id: string;
};

const scheduleData = [
  {
    id: '1',
    title: '현수의 대전 나들이',
    date: '2024.10.24 ~ 2024.10.26',
    image: require('../../assets/imgs/department.png'),
  },
  {
    id: '2',
    title: '현수 코스프레 대회',
    date: '2024.10.20 ~ 2024.10.21',
    image: require('../../assets/imgs/Gapcheon.png'),
  },
  {
    id: '3',
    title: '현수 코스프레 여행',
    date: '2024.10.20 ~ 2024.10.21',
    image: require('../../assets/imgs/department.png'),
  },
];

const PlaceDetail = () => {
  const navigation = useNavigation<PlaceDetailScreenNavigationProp>();
  const route = useRoute();
  const {id} = route.params as PlaceDetailRouteProp;

  const [spotDetails, setSpotDetails] = useState<any>(null);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [stampModalVisible, setStampModalVisible] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);

  const fetchSpotDetails = useCallback(async () => {
    try {
      const details = await getTouristSpotDetails(id);
      if (details) {
        setSpotDetails(details);
        // Synchronize `userLiked` with `favorite` from the API
        setIsFavorite(details.favorite ?? false);
        setFavoritesCount(details.favoritesCount ?? 0);
      }
    } catch (error) {
      console.error('Failed to fetch tourist spot details:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchSpotDetails();
  }, [fetchSpotDetails]);

  useFocusEffect(
    useCallback(() => {
      fetchSpotDetails();
    }, [fetchSpotDetails]),
  );
  const gotoWrite = () => {
    navigation.navigate('WriteReview', {spotId: id}); // id를 spotId로 전달
  };
  const handleScheduleSelect = (schedule: any) => {
    setSelectedSchedule(schedule);
    setScheduleModalVisible(false);
    setDetailModalVisible(true);
  };

  useEffect(() => {
    fetchSpotDetails();
  }, [fetchSpotDetails]);

  const handleFavoriteToggle = async () => {
    try {
      let result = null;

      if (isFavorite) {
        // 찜 취소하기
        result = await unfavoriteTouristSpot(id);
      } else {
        // 찜하기
        result = await favoriteTouristSpot(id);
      }

      if (result && typeof result === 'object') {
        // 응답에서 `userLiked` 값과 좋아요 수 업데이트
        setIsFavorite(result.userLiked);
        setFavoritesCount(result.totalFavorites);
      }
    } catch (error) {
      console.error('Failed to toggle favorite status:', error);
      // 여기서 서버 상태를 다시 가져와서 동기화
      await fetchSpotDetails();
    }
  };

  if (!spotDetails) {
    return <Text>Loading...</Text>; // 데이터가 로드될 때까지 로딩 메시지를 표시
  }
  const review = spotDetails.reviews.map(
    (item: {
      reviewId: number;
      content: string;
      profile: {nickname: string; profileImage: string};
      createdAt: number[];
      reviewImages: {imageUrl: string}[];
    }) => ({
      id: item.reviewId.toString(),
      nickName: item.profile.nickname,
      userImg: {uri: item.profile.profileImage},
      time: `${item.createdAt[0]}.${item.createdAt[1]}.${item.createdAt[2]}`,
      reviewText: item.content,
      placeImgs: item.reviewImages.map((img: {imageUrl: string}) => ({
        uri: img.imageUrl,
      })),
    }),
  );
  return (
    <>
      <Header />
      <ScrollView style={styles.container}>
        <View style={styles.headerSection}>
          <Text style={styles.placeName}>{spotDetails.spotName}</Text>
          <View style={styles.iconsRow}>
            <Text style={styles.heart}>♥️</Text>
            <Text style={styles.likeCount}>{favoritesCount > 999 ? '999+' : favoritesCount}</Text>
          </View>
          <View style={styles.iconsRow}>
            <MarkerIcon width={18} height={18} />
            <Text style={styles.areaText}>{spotDetails.spotAddress.split(' ')[1]}</Text>
          </View>
          <Image
            source={{uri: spotDetails.touristSpotImages[0].imageUrl}}
            style={styles.placeImage}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.iconButton} onPress={handleFavoriteToggle}>
            {isFavorite ? (
              <Image source={require('../../assets/imgs/heart1.png')} style={styles.icon} />
            ) : (
              <HearthIcon width={24} height={24} style={styles.icon} />
            )}
            <Text style={styles.iconButtonText}>{isFavorite ? '찜취소' : '찜하기'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => setScheduleModalVisible(true)}>
            <CalendarIcon width={24} height={24} style={styles.icon} />
            <Text style={styles.iconButtonText}>일정추가</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={gotoWrite}>
            <StarIcon width={24} height={24} style={styles.icon} />
            <Text style={styles.iconButtonText}>리뷰쓰기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => setStampModalVisible(true)}>
            <StempIcon width={24} height={24} style={styles.icon} />
            <Text style={styles.iconButtonText}>스탬프</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>상세 정보</Text>
          <View style={styles.detailSectionView}>
            <View style={styles.detailItem}>
              <ClockIcon width={20} height={20} />
              <Text style={styles.detailText}>영업시간</Text>
            </View>
            <View style={styles.detailRow}>
              {spotDetails.businessHours.split('|').map((hour: string, index: number) => (
                <Text key={index} style={styles.detailSubText}>
                  {hour.trim()}
                </Text>
              ))}
            </View>

            <View style={styles.detailItem}>
              <PhoneIcon width={20} height={20} />
              <Text style={styles.detailText}>전화번호</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailSubText}>{spotDetails.phone}</Text>
            </View>

            <View style={styles.detailItem}>
              <CompassIcon width={20} height={20} />
              <Text style={styles.detailText}>위치</Text>
            </View>

            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: spotDetails.latitude,
                  longitude: spotDetails.longitude,
                  latitudeDelta: 0.008,
                  longitudeDelta: 0.0001,
                }}
                provider={PROVIDER_GOOGLE}
              />
            </View>

            <View style={styles.addressRow}>
              <Text style={styles.addressText}>{spotDetails.spotAddress}</Text>
            </View>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionTitle}>설명</Text>
          <View style={styles.descriptionTextView}>
            <Text style={styles.descriptionText}>{spotDetails.spotDescription}</Text>
          </View>
        </View>

        <View style={styles.reviewSection}>
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewTitle}>방문 후기 {spotDetails.reviewCount}</Text>
            <TouchableOpacity onPress={gotoWrite}>
              <EditIcon width={20} height={20} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.reviewSectionT} nestedScrollEnabled={true}>
            {review.map(
              (item: {
                id: string;
                nickName: string;
                userImg: {uri: string};
                time: string;
                reviewText: string;
                placeImgs: {uri: string}[];
              }) => (
                <View key={item.id} style={styles.reviewItemContainer}>
                  <View style={styles.reviewHeaderRow}>
                    <Image source={item.userImg} style={styles.userImage} />
                    <View style={styles.userInfo}>
                      <Text style={styles.reviewerName}>{item.nickName}</Text>
                      <Text style={styles.reviewDate}>{item.time}</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewContent}>{item.reviewText}</Text>

                  <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.reviewImgContent}>
                    {item.placeImgs.map((img, index) => (
                      <Image key={index} source={img} style={styles.reviewImage} />
                    ))}
                  </ScrollView>
                </View>
              ),
            )}
          </ScrollView>
        </View>

        <StepModal
          visible={scheduleModalVisible}
          onClose={() => setScheduleModalVisible(false)}
          title="일정 추가"
          footerButtonText="닫기"
          content={
            <View>
              {scheduleData.map(schedule => (
                <TouchableOpacity key={schedule.id} onPress={() => handleScheduleSelect(schedule)}>
                  <View style={styles.scheduleItem}>
                    <Image source={schedule.image} style={styles.scheduleImage} />
                    <View>
                      <Text style={styles.scheduleTitle}>{schedule.title}</Text>
                      <Text style={styles.scheduleDate}>{schedule.date}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          }
        />

        <StepModal
          visible={detailModalVisible}
          onClose={() => setDetailModalVisible(false)}
          title={selectedSchedule ? selectedSchedule.title : ''}
          footerButtonText="완료"
          content={
            selectedSchedule && (
              <View>
                <Text style={styles.scheduleDetailDate}>{selectedSchedule.date}</Text>
              </View>
            )
          }
        />

        <CustomModal
          visible={stampModalVisible}
          onClose={() => setStampModalVisible(false)}
          title="한밭 수목원"
          content="한밭 수목원에 스탬프 찍기를 \n성공하였습니다!!"
          imageSource={require('../../assets/imgs/preview.png')}
          footerButtonText="확인"
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.06,
    backgroundColor: '#fff',
  },
  headerSection: {
    marginBottom: 20,
  },
  placeName: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    color: '#333',
    marginBottom: 5,
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  heart: {
    fontSize: 13,
  },
  likeCount: {
    fontSize: 10,
    color: '#333',
    marginLeft: 5,
  },
  areaText: {
    marginLeft: 5,
    fontSize: 10,
    color: '#333',
    fontFamily: 'Pretendard-Medium',
  },
  placeImage: {
    width: '100%',
    height: 170,
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1.5,
    borderColor: '#ddd',
    paddingBottom: 10,
    marginBottom: 20,
  },
  iconButton: {
    alignItems: 'center',
  },
  icon: {
    marginBottom: 5,
    height: 24,
    width: 24,
    color: 'rgba(51, 51, 51, 0.5)',
  },
  iconButtonText: {
    fontSize: 10,
    color: 'rgba(51, 51, 51, 0.5)',
    fontFamily: 'Pretendard-Medium',
  },
  detailSection: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 10,
    elevation: 4,
    shadowColor: '#333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  detailSectionView: {
    width: '90%',
    alignSelf: 'center',
  },
  detailTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#418663',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 5,
    fontSize: 14,
    color: 'rgba(51, 51, 51, 0.5)',
    fontFamily: 'Pretendard-Medium',
  },
  detailRow: {
    paddingLeft: 25,
    marginBottom: 10,
  },
  detailSubText: {
    fontSize: 12,
    color: 'rgba(51, 51, 51, 0.5)',
    fontFamily: 'Pretendard-Medium',
  },
  mapImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginVertical: 10,
  },
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 12,
    color: 'rgba(51, 51, 51, 0.5)',
    fontFamily: 'Pretendard-Medium',
  },
  directionButton: {
    backgroundColor: '#rgba(94, 203, 138, 0.6)',
    borderRadius: 5,
    paddingVertical: 1,
    paddingHorizontal: 5,
    marginRight: 5,
  },
  directionButtonText: {
    fontSize: 12,
    color: '#ffffff',
    fontFamily: 'Pretendard-Regular',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#418663',
    marginBottom: 10,
  },
  descriptionTextView: {
    width: '90%',
    alignSelf: 'center',
  },
  descriptionText: {
    fontSize: 13,
    color: 'rgba(51, 51, 51, 0.5)',
    fontFamily: 'Pretendard-Medium',
  },
  reviewSection: {
    maxHeight: 400,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 10,
    elevation: 4,
    shadowColor: '#333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  reviewTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#418663',
  },
  reviewSectionT: {
    padding: 15,
  },
  reviewItemContainer: {
    marginBottom: 20,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'column',
  },
  reviewerName: {
    fontSize: 14,
    fontFamily: 'Pretendard-Bold',
    color: '#333',
  },
  reviewDate: {
    fontSize: 12,
    color: 'rgba(51, 51, 51, 0.5)',
    fontFamily: 'Pretendard-Regular',
  },
  reviewContent: {
    fontSize: 14,
    color: 'rgba(51, 51, 51, 0.5)',
    marginBottom: 5,
  },
  reviewImgContent: {
    flexDirection: 'row',
  },
  reviewImage: {
    width: width * 0.75,
    height: 150,
    resizeMode: 'cover',
    marginRight: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  scheduleImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scheduleDate: {
    fontSize: 14,
    color: '#666',
  },
  scheduleDetailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  scheduleDetailDate: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  mapContainer: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontFamily: 'Pretendard-Bold',
  },
  maps: {
    width: '100%',
    height: 200,
  },
  travelInfoContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  travelInfoText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#333',
    marginVertical: 2,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#418663',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  closeButtonText: {
    color: 'white',
    fontFamily: 'Pretendard-Bold',
  },
});

export default PlaceDetail;
