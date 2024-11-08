import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import DraggableFlatList, {RenderItemParams} from 'react-native-draggable-flatlist';
import {WithSpringConfig, runOnJS} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator'; // 네비게이션 타입 가져오기

const {width} = Dimensions.get('window');
type DetailsNavigationProp = StackNavigationProp<RootStackParamList, 'TravelItinerary'>;

type Place = {
  id: string;
  name: string;
  address: string;
};

type Day = {
  id: string;
  day: string;
  date: string;
  places: Place[];
};

const RenderPlaceItem = ({item, drag, isActive}: RenderItemParams<Place>) => {
  return (
    <View style={[styles.placeContainer, isActive && {backgroundColor: '#f0f0f0'}]}>
      <View>
        {/* 기본값 추가 */}
        <Text style={styles.placeText}>{item.name ? item.name : ''}</Text>
        <Text style={styles.addressText}>{item.address ? item.address : ''}</Text>
      </View>
      <TouchableOpacity onPressIn={drag} style={styles.dragHandle}>
        <Image source={require('../../assets/imgs/menu.png')} style={styles.menuIcon} />
      </TouchableOpacity>
    </View>
  );
};
const RenderDayItem = ({
  item,
  handleDragEnd,
}: {
  item: Day;
  handleDragEnd: (data: Place[], dayId: string) => void;
}) => {
  const springConfig: Partial<WithSpringConfig> = {
    damping: 20,
    stiffness: 100,
    mass: 1,
    overshootClamping: false,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
  };

  return (
    <View style={styles.dayContainer}>
      <View style={styles.dayHeader}>
        <Image source={require('../../assets/imgs/calendar.png')} style={styles.calendarIcon} />
        <Text style={styles.dayText}>{item.day}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      <DraggableFlatList
        data={item.places || []}
        renderItem={(params: RenderItemParams<Place>) => <RenderPlaceItem {...params} />}
        keyExtractor={(place: Place) => place.id}
        onDragEnd={({data}) => {
          runOnJS(handleDragEnd)(data, item.id);
        }}
        ListEmptyComponent={<View />}
        activationDistance={10}
        animationConfig={springConfig}
      />
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>장소 추가</Text>
      </TouchableOpacity>
    </View>
  );
};

const Details = () => {
  const [tripName, setTripName] = useState('여행 이름을 입력하세요');
  const [isEditing, setIsEditing] = useState(false);
  const [hasCustomName, setHasCustomName] = useState(false);
  const [itinerary, setItinerary] = useState<Day[]>([
    {
      id: '1',
      day: 'Day 1',
      date: '10/15',
      places: [
        {id: 'place1', name: '대전 애니메이트', address: '대전광역시 덕명동 xxx-xx'},
        {id: 'place2', name: '대전 근현대사 전시관', address: '대전광역시 덕명동 xxx-xx'},
      ],
    },
    {
      id: '2',
      day: 'Day 2',
      date: '10/16',
      places: [
        {id: 'place3', name: '대전 성심당', address: '대전광역시 덕명동 xxx-xx'},
        {id: 'place4', name: '한밭 수목원', address: '대전광역시 덕명동 xxx-xx'},
      ],
    },
  ]);
  const navigation = useNavigation<DetailsNavigationProp>(); // 네비게이션 훅 사용

  const goToTravelItinerary = () => {
    navigation.navigate('TravelChallenge'); // 네비게이션 처리
  };
  const handleEdit = () => {
    setTripName(''); // 수정 버튼을 누를 때 tripName을 빈 문자열로 설정
    setIsEditing(true);
  };

  const handleConfirm = () => {
    if (!tripName.trim()) {
      Alert.alert('경고', '여행 이름을 입력해야 합니다.');
    } else {
      setIsEditing(false);
      setHasCustomName(true);
    }
  };

  const handleTextChange = (text: string) => {
    if (!hasCustomName) {
      setTripName(text);
    } else {
      setTripName(text);
    }
  };

  const handleDragEnd = (data: Place[], dayId: string) => {
    setItinerary(prevItinerary =>
      prevItinerary.map(day => (day.id === dayId ? {...day, places: data} : day)),
    );
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.topDivider} />
        <View style={styles.content}>
          <View style={styles.header}>
            {isEditing ? (
              <>
                <TextInput
                  value={tripName}
                  onChangeText={handleTextChange}
                  style={styles.tripNameInput}
                  placeholder={!hasCustomName ? '여행 이름을 입력하세요' : ''}
                  autoFocus
                />
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={styles.confirmText}>확인</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.tripName}>{tripName}</Text>
                <TouchableOpacity onPress={handleEdit}>
                  <Image
                    source={require('../../assets/imgs/pencil.png')}
                    style={styles.pencilIcon}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
          <Text style={styles.dateRange}>2024.10.15 - 2024.10.17</Text>
          <TouchableOpacity style={styles.recommendButton} onPress={goToTravelItinerary}>
            <Text style={styles.recommendButtonText}>+ 추천 코스 보기</Text>
          </TouchableOpacity>

          {itinerary.map(day => (
            <View key={day.id} style={styles.daySection}>
              <View style={styles.Divider} />
              <RenderDayItem item={day} handleDragEnd={handleDragEnd} />
            </View>
          ))}
        </View>
      </View>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  // 스타일 설정 그대로 유지
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  topDivider: {
    width: width,
    height: 2,
    backgroundColor: 'rgba(51, 51, 51, 0.2)',
    marginBottom: 30,
    marginTop: 60,
  },
  tripNameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
    paddingHorizontal: width * 0.06,
  },
  tripName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
    paddingHorizontal: width * 0.06,
  },
  confirmText: {
    fontSize: 16,
    color: '#418663',
    marginLeft: 8,
    marginRight: width * 0.08,
    fontFamily: 'Pretendard-SemiBold',
  },
  pencilIcon: {
    width: 20,
    height: 20,
    marginRight: width * 0.08,
  },
  dateRange: {
    fontSize: 16,
    color: '#999999',
    marginBottom: 16,
    paddingHorizontal: width * 0.07,
  },
  recommendButton: {
    backgroundColor: '#418663',
    padding: 5,
    borderRadius: 20,
    alignItems: 'center',
    width: (width * 7) / 18,
    marginLeft: width * 0.08,
    marginBottom: 15,
  },
  recommendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  Divider: {
    width: width,
    height: 1,
    backgroundColor: 'rgba(51, 51, 51, 0.2)',
    marginBottom: 20,
    marginTop: 10,
  },
  daySection: {
    marginBottom: 16,
  },

  dayContainer: {
    padding: 12,
    borderRadius: 8,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  calendarIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  dateText: {
    fontSize: 14,
    color: '#999999',
    marginLeft: 8,
  },
  placeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  placeText: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Pretendard-Bold',
  },
  addressText: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'Pretendard-Regular', // 주소에 적절한 폰트 설정
  },
  menuIcon: {
    width: 20,
    height: 20,
  },
  dragHandle: {
    padding: 5,
  },
  addButton: {
    backgroundColor: '#fff',
    borderColor: '#418663',
    borderWidth: 1,
    width: (width * 6) / 18,
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    alignSelf: 'flex-end', // 오른쪽 정렬
  },
  addButtonText: {
    color: '#418663',
    fontWeight: 'bold',
  },
});

export default Details;
