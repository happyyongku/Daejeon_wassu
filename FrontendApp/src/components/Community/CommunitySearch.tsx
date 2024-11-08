import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

const {width} = Dimensions.get('window');

const CommunitySearch = () => {
  const [searchText, setSearchText] = useState('');

  // 예제 데이터 (여행기에서 검색했던 리스트들)
  const searchResults = [
    {id: '1', title: '힐링 여행 좋아요', location: '한밭 수목원'},
    {id: '2', title: '맛집 탐방', location: '대전 중구'},
    {id: '3', title: '숙소 추천', location: '유성구 온천호텔'},
  ];

  return (
    <View style={styles.container}>
      {/* 검색창 */}
      <View style={styles.searchBar}>
        <Image source={require('../../assets/imgs/search.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="커뮤니티 내에서 검색"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* 검색 결과 리스트 */}
      <FlatList
        data={searchResults}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.resultItem}>
            <Text style={styles.resultTitle}>{item.title}</Text>
            <Text style={styles.resultLocation}>{item.location}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.06,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F7FB',
    borderRadius: 10,
    padding: 10,
    marginVertical: 15,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  resultItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resultLocation: {
    fontSize: 14,
    color: '#666',
  },
});

export default CommunitySearch;
