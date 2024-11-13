import React from 'react';
import {Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import GroupIcon from '../../assets/imgs/Group.svg';
import FoodIcon from '../../assets/imgs/food.svg';
import HomeIcon from '../../assets/imgs/home.svg';
import SportIcon from '../../assets/imgs/sport.svg';
import ArtIcon from '../../assets/imgs/art.svg';
import HistoryIcon from '../../assets/imgs/categoryicon/history-1436604.svg';
import CultureIcon from '../../assets/imgs/categoryicon/culture1.svg';
import ScienceIcon from '../../assets/imgs/sei.svg';
import FamilyIcon from '../../assets/imgs/categoryicon/family8.svg';
import BreadIcon from '../../assets/imgs/mainbread.svg';
import LandIcon from '../../assets/imgs/categoryicon/land.svg';

const categories = [
  {id: '1', name: '전체', icon: <GroupIcon width={30} height={30} />},
  {id: '2', name: '음식', icon: <FoodIcon width={30} height={30} />},
  {id: '3', name: '자연', icon: <HomeIcon width={30} height={30} />},
  {id: '4', name: '역사', icon: <HistoryIcon width={30} height={30} />},
  {id: '5', name: '문화', icon: <CultureIcon width={30} height={30} />},
  {id: '6', name: '과학', icon: <ScienceIcon width={30} height={30} />},
  {id: '7', name: '교육', icon: <ArtIcon width={30} height={30} />},
  {id: '8', name: '가족 ', icon: <FamilyIcon width={30} height={30} />},
  {id: '9', name: '빵집', icon: <BreadIcon width={30} height={30} />},
  {id: '10', name: '스포츠', icon: <SportIcon width={30} height={30} />},
  {id: '11', name: '랜드마크', icon: <LandIcon width={30} height={30} />},
];

interface CategoryListProps {
  onSelectCategory: (category: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({onSelectCategory}) => {
  const handlePress = (categoryName: string) => {
    onSelectCategory(categoryName);
  };

  return (
    <FlatList
      data={categories}
      horizontal
      renderItem={({item}) => (
        <TouchableOpacity onPress={() => handlePress(item.name)} style={styles.categoryItem}>
          {item.icon}
          <Text style={styles.categoryText}>{item.name}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 10,
    fontFamily: 'Pretendard-Medium',
    color: '#333',
  },
});

export default CategoryList;
