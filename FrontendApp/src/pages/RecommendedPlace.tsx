import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
} from 'react-native';
import RecommendedSearchBar from '../components/RecommendedPlace/RecommendedSearchBar';
import CategoryList from '../components/RecommendedPlace/CategoryList';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../router/Navigator';
import Header from '../components/common/Header';
import MarkerIcon from '../assets/imgs/marker.svg';
import {getTouristSpotsByCategory} from '../api/tourist';

const {width} = Dimensions.get('window');

type RecommendedPlaceNavigationProp = StackNavigationProp<RootStackParamList, 'PlaceList'>;

type RouteParams = {
  RecommendedPlace: {
    category: string;
  };
};

interface TouristSpot {
  id: string;
  image: {uri: string} | number;
  area: string;
  address: string;
  name: string;
}

const RecommendedPlace = () => {
  const navigation = useNavigation<RecommendedPlaceNavigationProp>();
  const route = useRoute<RouteProp<RouteParams, 'RecommendedPlace'>>();
  const initialCategory = route.params?.category || '전체';
  const [places, setPlaces] = useState<TouristSpot[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  // 데이터 요청 함수
  const fetchPlacesByCategory = async (category: string) => {
    try {
      const response = await getTouristSpotsByCategory(category === '전체' ? '' : category);

      if (response) {
        const formattedPlaces: TouristSpot[] = response.map((item: any) => ({
          id: item.id,
          image:
            item.image && item.image !== null
              ? {uri: item.image}
              : require('../assets/imgs/hanbat.png'),
          area: item.spotAddress.split(' ')[1],
          address: item.spotAddress,
          name: item.spotName,
        }));
        setPlaces(formattedPlaces);
        console.log('Formatted Places:', formattedPlaces);
      } else {
        console.error('Failed to fetch places - Response is null or undefined');
      }
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  useEffect(() => {
    fetchPlacesByCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    fetchPlacesByCategory(selectedCategory);
  }, [selectedCategory]);

  const goToPlaceList = () => {
    navigation.navigate('PlaceList');
  };

  const goToPlaceDetail = (id: string) => {
    console.log('Navigating to PlaceDetail with ID:', id); // 디버그용 로그
    navigation.navigate('PlaceDetail', {id});
  };

  return (
    <>
      <Header />
      <ScrollView style={styles.container}>
        <View style={styles.search}>
          <RecommendedSearchBar />
        </View>

        <View style={styles.categoryIcon}>
          <CategoryList onSelectCategory={setSelectedCategory} />
        </View>

        <View style={styles.cardSection}>
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>전체 관광지</Text>
              <TouchableOpacity onPress={goToPlaceList}>
                <Text style={styles.cardHeaderButton}>전체 보기 &gt;</Text>
              </TouchableOpacity>
            </View>

            <ScrollView nestedScrollEnabled={true}>
              {places.map(item => (
                <TouchableOpacity key={item.id} onPress={() => goToPlaceDetail(item.id)}>
                  <View key={item.id} style={styles.card}>
                    <View style={styles.imageWrapper}>
                      <ImageBackground source={item.image} style={styles.image}>
                        <View style={styles.overlay}>
                          <View style={styles.leftOverlay}>
                            <MarkerIcon width={20} height={20} />
                            <Text style={styles.areaText}>{item.area}</Text>
                          </View>
                          <Text style={styles.tagsText}>#태그 없음</Text>
                        </View>
                      </ImageBackground>
                    </View>
                    <Text style={styles.addressText}>{item.address}</Text>
                    <Text style={styles.nameText}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
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
  search: {
    marginVertical: 20,
  },
  categoryIcon: {
    marginBottom: 20,
    alignItems: 'center',
  },
  cardSection: {
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardHeaderText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    color: '#333',
    paddingLeft: 10,
  },
  cardHeaderButton: {
    fontSize: 10,
    color: 'rgba(153, 153, 153, 0.5)',
    fontFamily: 'Pretendard-Regular',
    paddingRight: 10,
  },
  cardContainer: {
    maxHeight: 600,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 10,
    elevation: 4,
    shadowColor: '#333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
  },
  imageWrapper: {
    width: '100%',
    height: 150,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  leftOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  areaText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    marginLeft: 5,
  },
  tagsText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Pretendard-Medium',
  },
  addressText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Pretendard-Medium',
  },
  nameText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Bold',
  },
});

export default RecommendedPlace;
