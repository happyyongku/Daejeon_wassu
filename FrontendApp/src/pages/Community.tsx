import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 16,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postItem: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postContent: {
    flex: 1,
  },
  user: {
    fontWeight: 'bold',
  },
  postTitle: {
    fontSize: 14,
    color: '#333',
  },
  content: {
    color: '#555',
    marginTop: 4,
  },
});

const communityPosts = [
  {
    id: '1',
    user: '대전와슈 장현수',
    title: '대전 노잼 아닙니다! 놀러오세요',
    content: '안녕하세요, 대전의 이틀 여행코스를 소개합니다...',
  },
];

const Community = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>커뮤니티 인기 여행기 🔥</Text>
      <FlatList
        data={communityPosts}
        renderItem={({item}) => (
          <View style={styles.postItem}>
            <View style={styles.postContent}>
              <Text style={styles.user}>{item.user}</Text>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.content}>{item.content}</Text>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default Community;
