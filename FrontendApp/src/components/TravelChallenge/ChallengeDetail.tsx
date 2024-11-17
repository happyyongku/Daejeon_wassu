import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';
import Header from '../common/Header';
import PlayIcon from '../../assets/imgs/play.svg';
import ProgressIcon from '../../assets/imgs/progress.png';
import CompleteIcon from '../../assets/imgs/complete.png';
import FlameIcon from '../../assets/imgs/flame.svg';
import {getCourseDetail, startCourse} from '../../api/recommended'; // startCourse API 추가

const {width} = Dimensions.get('window');

type ChallengeDetailNavigationProp = StackNavigationProp<RootStackParamList, 'PlaceDetail'>;
type ChallengeDetailRouteProp = RouteProp<RootStackParamList, 'ChallengeDetail'>;

interface Bakery {
  bakery_name: string;
  address: string;
  elastic_id: string;
  completed: boolean;
  spot_id: number;
  rating: number | null;
  phone: string;
  business_hours: string;
  description: string;
  spot_image_url: string | null;
  wassumon_image_url: string | null;
  wassumon_name: string;
  hashtags: string[];
}

const ChallengeDetail = () => {
  const navigation = useNavigation<ChallengeDetailNavigationProp>();
  const route = useRoute<ChallengeDetailRouteProp>();
  const {id} = route.params;
  const {id: courseId} = route.params; // courseId 가져오기
  const [courseName, setCourseName] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]); // 새로운 상태 추가
  const [course_datail, setcourse_datail] = useState<Bakery[]>([]);
  const [completedAll, setCompletedAll] = useState('yet');
  const Progress1Icon = require('../../assets/imgs/progress1.png');

  useEffect(() => {
    const fetchCourseDetail = async () => {
      const data = await getCourseDetail(id);
      if (data) {
        setCourseName(data.course.course_name);
        setImages([data.course.image_url]);
        setcourse_datail(data.course_details);
        setCompletedAll(data.completed_all); // 상태 설정
        setHashtags(data.course.hashtags); // course의 hashtags 설정
      }
    };
    fetchCourseDetail();
  }, [id]);
  const handleStartChallenge = async () => {
    try {
      const response = await startCourse(courseId); // startCourse API 호출
      if (response) {
        console.log('Challenge started successfully:', response);
        setCompletedAll('start'); // 챌린지 상태를 'start'로 변경
      } else {
        console.error('Failed to start challenge.');
      }
    } catch (error) {
      console.error('Error starting challenge:', error);
    }
  };
  const goToPlaceDetail = (placeId: string) => {
    console.log('Navigating to PlaceDetail with ID:', placeId);
    navigation.navigate('PlaceDetail', {id: placeId});
  };

  const goToARPage = (spotId: number) => {
    navigation.navigate('Ar', {courseId, spotId}); // courseId와 spotId를 함께 전달
  };

  return (
    <>
      <Header />
      <ScrollView style={styles.container}>
        <View>
          {images.map((image, index) => (
            <ImageBackground
              key={index}
              source={{uri: image}}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </View>

        <View style={styles.containerT}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {courseName}
            </Text>
            <Text style={styles.subtitle}>왓슈볼을 눌러 도전하세요! 왓슈몬을 잡으세요.</Text>
          </View>
          {/* Hashtag Container 수정 */}
          <View style={styles.hashtagContainer}>
            {hashtags.map((hashtag, index) => (
              <TouchableOpacity key={index}>
                <View style={styles.hashtagButton}>
                  <FlameIcon width={25} height={25} />
                  <Text style={styles.hashtagText}>{hashtag}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {course_datail.map((bakery, index) => (
            <TouchableOpacity
              key={bakery.elastic_id}
              onPress={() => goToPlaceDetail(bakery.elastic_id)}>
              <View style={styles.courseItem}>
                <View style={styles.numberContainer}>
                  <Text style={styles.numberText}>{index + 1}</Text>
                </View>

                <View style={styles.courseDetails}>
                  <Text style={styles.courseTitle}>{bakery.bakery_name}</Text>
                  <Text style={styles.courseAddress}>{bakery.address}</Text>
                </View>

                {bakery.completed ? (
                  <Image
                    source={{uri: bakery.wassumon_image_url || ''}}
                    style={styles.courseIcon}
                  />
                ) : (
                  <TouchableOpacity
                    key={bakery.elastic_id}
                    onPress={() => goToARPage(bakery.spot_id)} // bakery.spot_id 전달
                  >
                    <Image source={require('../../assets/imgs/watsuball.png')} />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}

          <Text style={styles.title2}>등장 왔슈몬</Text>
          <View style={styles.monContainer}>
            {course_datail.map((bakery, index) => (
              <View key={index} style={styles.monItem}>
                <Image source={{uri: bakery.wassumon_image_url || ''}} style={styles.monIcon} />
                <Text style={styles.monText}>{bakery.wassumon_name}</Text>
              </View>
            ))}
          </View>

          {/* 챌린지 버튼 */}
          {completedAll === 'yet' ? (
            <TouchableOpacity style={styles.challengeButton} onPress={handleStartChallenge}>
              <PlayIcon width={20} height={20} style={styles.buttonIcon} />
              <Text style={styles.challengeButtonText}>챌린지 시작</Text>
            </TouchableOpacity>
          ) : completedAll === 'start' ? (
            <View style={styles.challengeButton}>
              <Image source={ProgressIcon} style={styles.buttonIcon} />
              <Text style={styles.challengeButtonText}>챌린지 진행중</Text>
              <Image source={Progress1Icon} style={styles.progress1Icon} />
            </View>
          ) : (
            <View style={styles.challengeButton}>
              <Image source={CompleteIcon} style={styles.buttonIcon} />
              <Text style={styles.challengeButtonText}>챌린지 완료</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: width,
    aspectRatio: 2.5,
  },
  containerT: {
    paddingHorizontal: width * 0.06,
  },
  titleContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
    color: '#333333',
    marginVertical: 10, // 기존 20에서 10으로 줄임
    flexWrap: 'wrap', // 줄바꿈 가능하게
  },
  subtitle: {
    fontSize: 12, // 작은 크기 (10에서 12로 증가)
    color: '#333333',
    fontFamily: 'Pretendard-Bold',
    marginTop: 5, // 제목과의 간격을 줄임
  },
  courseItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#333333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  hashtagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(153, 153, 153, 0.5)',
  },
  hashtagText: {
    fontSize: 16,
    color: '#999999',
    marginLeft: 5,
    fontFamily: 'Pretendard-Regular',
  },

  numberContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#418663',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
  },
  courseDetails: {
    flex: 1,
    marginLeft: 30,
  },
  courseTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  courseAddress: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: 'rgba(51, 51, 51, 0.6)',
    marginBottom: 10,
  },
  courseIcon: {
    width: 75, // 이미지 너비
    height: 75, // 이미지 높이
    alignSelf: 'center',
  },
  title2: {
    color: '#418663',
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
    marginVertical: 20,
  },
  monContainer: {
    backgroundColor: '#418663',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Distribute items evenly
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10, // Add some horizontal padding
  },
  monItem: {
    width: '30%', // Each item takes up 30% of the container width
    alignItems: 'center',
    marginBottom: 20, // Space between rows
  },
  monIcon: {
    width: 65,
    height: 65,
  },
  monText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Bold',
  },
  challengeButton: {
    width: width * 0.8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#418663',
    marginBottom: 20,
    alignSelf: 'center',
  },
  buttonIcon: {
    marginRight: 10,
    width: 24,
    height: 24,
  },
  progress1Icon: {
    marginLeft: 10,
    width: 20,
    height: 20,
  },
  challengeButtonText: {
    color: '#418663',
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
  },
  arButton: {
    backgroundColor: '#418663',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  arButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
  },
});

export default ChallengeDetail;
