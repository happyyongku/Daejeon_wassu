// PlaceList.tsx
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
import RecommendedSearchBar from './RecommendedSearchBar';
import CategoryList from './CategoryList';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';
import Header from '../common/Header';
import MarkerIcon from '../../assets/imgs/marker.svg';
import {getTouristSpotsByCategory} from '../../api/tourist'; // Import API function

const {width} = Dimensions.get('window');

// Define the TouristSpot type
interface TouristSpot {
  id: string;
  image: {uri: string} | number;
  area: string;
  address: string;
  name: string;
}

type PlaceListNavigationProp = StackNavigationProp<RootStackParamList, 'PlaceDetail'>;

const PlaceList: React.FC = () => {
  const navigation = useNavigation<PlaceListNavigationProp>();
  const [places, setPlaces] = useState<TouristSpot[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  // 데이터 요청 함수
  const fetchPlacesByCategory = async (category: string) => {
    try {
      console.log('Fetching places for category:', category);
      const response = await getTouristSpotsByCategory(category === '전체' ? '' : category);
      console.log('API Response:', response);

      if (response) {
        const formattedPlaces: TouristSpot[] = response.map((item: any) => ({
          id: item.spotName,
          image:
            item.images && item.images.length > 0
              ? {uri: item.images[0].image} // 첫 번째 이미지 URL을 사용
              : require('../../assets/imgs/hanbat.png'),
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

  // Fetch data on category change
  useEffect(() => {
    fetchPlacesByCategory(selectedCategory);
  }, [selectedCategory]);

  const goToPlaceDetail = (name: string) => {
    navigation.navigate('PlaceDetail', {name});
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
            </View>

            <ScrollView nestedScrollEnabled={true}>
              {places.map((item, index) => (
                <TouchableOpacity
                  key={`${item.id}-${index}`}
                  onPress={() => goToPlaceDetail(item.name)}>
                  <View style={styles.card}>
                    <View style={styles.imageWrapper}>
                      <ImageBackground source={item.image} style={styles.image}>
                        <View style={styles.overlay}>
                          <View style={styles.leftOverlay}>
                            <MarkerIcon width={20} height={20} />
                            <Text style={styles.areaText}>{item.area}</Text>
                          </View>
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
  cardContainer: {
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

export default PlaceList;
