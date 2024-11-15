import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions} from 'react-native';
import {getUserArticles} from '../../api/mypage';
import type {UserArticle} from '../../api/mypage';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';

const {width} = Dimensions.get('window');

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

type TravelLogNavigationProp = StackNavigationProp<RootStackParamList, 'PostDetail'>;

const TravelLog = () => {
  const navigation = useNavigation<TravelLogNavigationProp>();
  const [articles, setArticles] = useState<UserArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPages, setCurrentPages] = useState<{[key: string]: number}>({});

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const fetchedArticles = await getUserArticles();
      if (fetchedArticles) {
        setArticles(fetchedArticles);
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  const handleNextImage = (articleId: string, imagesLength: number) => {
    setCurrentPages(prevPages => {
      const nextPage = (prevPages[articleId] || 0) + 1;
      return {...prevPages, [articleId]: nextPage < imagesLength ? nextPage : 0};
    });
  };

  const handlePreviousImage = (articleId: string, imagesLength: number) => {
    setCurrentPages(prevPages => {
      const prevPage = (prevPages[articleId] || 0) - 1;
      return {...prevPages, [articleId]: prevPage >= 0 ? prevPage : imagesLength - 1};
    });
  };

  const handlePostPress = (articleId: string) => {
    navigation.navigate('PostDetail', {articleId});
  };

  const renderArticle = ({item}: {item: UserArticle}) => (
    <View style={styles.articleCard}>
      <TouchableOpacity onPress={() => handlePostPress(item.id)}>
        <Text style={styles.articleTitle}>{item.title}</Text>
        <Text style={styles.articleContent} numberOfLines={2}>
          {item.content}
        </Text>
      </TouchableOpacity>

      {item.images && item.images.length > 0 && (
        <View style={styles.carouselContainer}>
          <TouchableOpacity
            onPress={() => handlePreviousImage(item.id, item.images.length)}
            style={styles.arrowButton}>
            <Image
              source={require('../../assets/imgs/chevron-left.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>

          <Image
            source={{uri: item.images[currentPages[item.id] || 0]?.url}}
            style={styles.carouselImage}
          />

          <TouchableOpacity
            onPress={() => handleNextImage(item.id, item.images.length)}
            style={styles.arrowButton}>
            <Image
              source={require('../../assets/imgs/chevron-right.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.articleInfo}>
        <Text style={styles.articleDate}>{formatDate(item.createdAt)}</Text>
        <Text style={styles.articleTag}>{item.tags.length > 0 ? `#${item.tags[0].tag}` : ''}</Text>
      </View>
      {/* <Text style={styles.articleLikes}>좋아요 {item.liked}개</Text> */}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {articles.length > 0 ? (
        <FlatList
          data={articles}
          renderItem={renderArticle}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noArticlesText}>작성한 여행기가 없습니다.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingTop: 20,
    marginHorizontal: -width * 0.06,
  },
  listContainer: {
    paddingBottom: 20,
  },
  articleCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: width * 0.06,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  articleTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Pretendard-Bold',
  },
  articleContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  carouselImage: {
    width: width * 0.7,
    height: 200,
    borderRadius: 10,
  },
  arrowButton: {
    padding: 10,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: '#333',
  },
  articleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  articleDate: {
    fontSize: 12,
    color: '#999',
  },
  articleTag: {
    fontSize: 12,
    color: '#418663',
  },
  articleLikes: {
    fontSize: 14,
    color: '#333',
  },
  noArticlesText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default TravelLog;
