import React from 'react';
import {View, Text, FlatList} from 'react-native';

const categories = [
  {id: '1', name: '전체'},
  {id: '2', name: '맛집'},
  {id: '3', name: '숙소'},
  {id: '4', name: '비오는 날'},
];

const CategoryList = () => {
  return (
    <>
      <FlatList
        data={categories}
        horizontal
        renderItem={({item}) => (
          <View>
            <Text>{item.name} </Text>
          </View>
        )}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
      />
    </>
  );
};

export default CategoryList;
