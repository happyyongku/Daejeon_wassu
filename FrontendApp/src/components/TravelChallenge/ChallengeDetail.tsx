import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';
import Header from '../common/Header';
import MonIcon from '../../assets/imgs/mon1.svg';
import MononeIcon from '../../assets/imgs/mon2.svg';
import MontwoIcon from '../../assets/imgs/mon3.svg';
import PlayIcon from '../../assets/imgs/play.svg';
import CalendarIcon from '../../assets/imgs/calendar.svg';
import {getCourseDetail} from '../../api/recommended';

const {width} = Dimensions.get('window');
type ChallengeDetailNavigationProp = StackNavigationProp<RootStackParamList, 'PlaceDetail'>;
type ChallengeDetailRouteProp = RouteProp<RootStackParamList, 'ChallengeDetail'>;

interface Bakery {
  bakery_name: string;
  address: string;
  elastic_id: string;
}

const ChallengeDetail = () => {
  const navigation = useNavigation<ChallengeDetailNavigationProp>();
  const route = useRoute<ChallengeDetailRouteProp>();
  const {id} = route.params;
  const [courseName, setCourseName] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [bakeries, setBakeries] = useState<Bakery[]>([]);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      const data = await getCourseDetail(id);
      if (data) {
        setCourseName(data.course.course_name);
        setImages([data.course.image_url]);
        setBakeries(data.bakeries);
      }
    };
    fetchCourseDetail();
  }, [id]);

  const goToPlaceDetail = (placeId: string) => {
    console.log('Navigating to PlaceDetail with ID:', placeId);
    navigation.navigate('PlaceDetail', {id: placeId});
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
          <Text style={styles.title}>{courseName}</Text>

          {bakeries.map((bakery, index) => (
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
                <MonIcon width={75} height={75} style={styles.courseIcon} />
              </View>
            </TouchableOpacity>
          ))}

          <Text style={styles.title2}>등장 왔슈몬</Text>
          <View style={styles.monContainer}>
            <View style={styles.monItem}>
              <MonIcon width={75} height={75} />
              <Text style={styles.monText}>단팥몬</Text>
            </View>
            <View style={styles.monItem}>
              <MononeIcon width={75} height={75} />
              <Text style={styles.monText}>소보루몬</Text>
            </View>
            <View style={styles.monItem}>
              <MontwoIcon width={75} height={75} />
              <Text style={styles.monText}>바게트몬</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.challengeButton}>
            <PlayIcon width={20} height={20} style={styles.buttonIcon} />
            <Text style={styles.challengeButtonText}>챌린지 시작</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.challengeButton}>
            <CalendarIcon width={20} height={20} style={styles.buttonIcon} />
            <Text style={styles.challengeButtonText}>일정에 코스 담기</Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
    color: '#333333',
    marginVertical: 20,
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
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  monItem: {
    alignItems: 'center',
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
  },
  challengeButtonText: {
    color: '#418663',
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
  },
});

export default ChallengeDetail;
