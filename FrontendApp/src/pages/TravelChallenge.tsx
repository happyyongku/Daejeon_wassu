import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';
import GolfIcon from '../assets/imgs/golf.svg';
import FlagIcon from '../assets/imgs/flag.svg';
import CheckIcon from '../assets/imgs/Check.svg';
import MedalIcon from '../assets/imgs/monster.svg';
import ChatbotIcon from '../assets/imgs/chatbot.svg';
import {getCoursePresets} from '../api/recommended'; // API 함수 가져오기
import ChatbotModal from '../components/TravelChallenge/ChatbotModal'; // ChatbotModal 추가

const {width} = Dimensions.get('window');

type TravelChallengeNavigationProp = StackNavigationProp<RootStackParamList>;
interface Course {
  id: number;
  course_name: string;
  description: string;
  image_url: string;
  completed_all: boolean; // completed_all 추가
}

const TravelChallenge = () => {
  const navigation = useNavigation<TravelChallengeNavigationProp>();
  const [courses, setCourses] = useState<Course[]>([]); // Course 타입 지정
  const [isChatbotModalVisible, setChatbotModalVisible] = useState(false); // 모달 상태
  // API 요청 함수
  const fetchCourses = useCallback(async () => {
    try {
      const data = await getCoursePresets();
      if (data) {
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }, []);

  // 페이지 포커스 시 데이터 다시 가져오기
  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, [fetchCourses]),
  );

  const goToOngoingChallenge = () => {
    navigation.navigate('OngoingChallenge');
  };

  const goToCourse = () => {
    navigation.navigate('Course');
  };

  const goToCourseDescription = () => {
    navigation.navigate('CourseDescription');
  };

  const goToChallengeDetail = (courseId: number) => {
    navigation.navigate('ChallengeDetail', {id: courseId});
  };
  const openChatbotModal = () => {
    setChatbotModalVisible(true);
  };

  const closeChatbotModal = () => {
    setChatbotModalVisible(false);
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>챌린지 </Text>
        <GolfIcon width={25} height={25} />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.topRow}>
          <View style={styles.statItem}>
            <FlagIcon width={16} height={16} />
            <Text style={styles.statLabel}>참가중</Text>
            <Text style={styles.statValue}>1</Text>
          </View>
          <TouchableOpacity onPress={goToOngoingChallenge}>
            <Text style={styles.challengeText}>나의 챌린지 &gt;</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.statItem}>
            <CheckIcon width={16} height={16} />
            <Text style={styles.statLabel}>완료</Text>
            <Text style={styles.statValue}>-</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.statItem}>
            <MedalIcon width={16} height={16} />
            <Text style={styles.statLabel}>잡은 왓슈몬</Text>
            <Text style={styles.statValue}>10</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>대전왔슈 제공</Text>
      <View style={styles.subtitleContainer}>
        <Text style={styles.sectionSubtitle}>대전 여행 챌린지 코스 🔥</Text>
        <TouchableOpacity onPress={goToCourse}>
          <Text style={styles.allText}>전체 보기 &gt;</Text>
        </TouchableOpacity>
      </View>

      {courses.slice(0, 2).map(course => (
        <TouchableOpacity
          key={course.id}
          style={styles.card}
          onPress={() => goToChallengeDetail(course.id)}>
          <Image source={{uri: course.image_url}} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{course.course_name}</Text>
            <Text style={styles.cardDescription}>{course.description}</Text>
          </View>
          {/* completed_all이 true일 때 complete 도장을 표시 */}
          {course.completed_all && (
            <Image source={require('../assets/imgs/complete.png')} style={styles.completeIcon} />
          )}
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.faqButton} onPress={goToCourseDescription}>
        <Text style={styles.faqText}>챌린지 코스가 무엇인가요?</Text>
        <Text style={styles.faqText}>&gt;</Text>
      </TouchableOpacity>

      <View style={styles.chatbot}>
        <Text style={styles.sectionTitle}>챗봇에게 코스 추천받기</Text>
        <ChatbotIcon width={25} height={25} />
      </View>
      <Text style={styles.chatText}>원하는 코스가 없으시면 챗봇과 한 번 대화해보세요.</Text>
      <Text style={styles.chatText}>아쉽게도 챌린지는 제공되지 않습니다.</Text>

      <TouchableOpacity style={styles.chatbotButton} onPress={openChatbotModal}>
        <Text style={styles.chatbotButtonText}>챗봇에게 코스 물어보기!</Text>
      </TouchableOpacity>

      <ChatbotModal visible={isChatbotModalVisible} onClose={closeChatbotModal} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: width * 0.06,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Pretendard-Bold',
    marginRight: 8,
  },
  statsContainer: {
    width: width * 0.8,
    alignSelf: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(200, 222, 203, 0.5)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#C8DECB',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#418663',
    marginLeft: 10,
  },
  statValue: {
    fontSize: 18,
    color: '#418663',
    marginLeft: 10,
    fontFamily: 'Pretendard-SemiBold',
  },
  challengeText: {
    fontSize: 10,
    color: '#999999',
    fontFamily: 'Pretendard-SemiBold',
    marginRight: 20,
  },
  separator: {
    width: 1.5,
    height: '110%',
    backgroundColor: '#418663',
    alignSelf: 'center',
    marginRight: 5,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#333',
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
    marginRight: 10,
  },
  sectionSubtitle: {
    fontSize: 20,
    color: '#333',
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
  },
  allText: {
    fontSize: 10,
    color: '#999999',
    fontFamily: 'Pretendard-SemiBold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardImage: {
    width: 100, // 너비를 명시적으로 설정
    height: 100, // 높이를 명시적으로 설정
    marginRight: 10,
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 12,
    color: 'rgba(51, 51, 51, 0.5)',
    marginTop: 10,
  },
  faqButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'rgba(200, 222, 203, 0.5)',
    marginTop: 20,
    marginBottom: 40,
  },
  faqText: {
    color: '#418663',
    fontSize: 14,
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
  },
  chatbot: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  chatText: {
    color: 'rgba(51, 51, 51, 0.5)',
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
  },
  chatbotButton: {
    width: width * 0.8,
    backgroundColor: '#418663',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  chatbotButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
  },
  completeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    zIndex: 1,
  },
});

export default TravelChallenge;
