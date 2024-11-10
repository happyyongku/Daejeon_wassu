import React, {useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useRoute, useNavigation, useFocusEffect} from '@react-navigation/native';
import {getPostDetail, deletePost, toggleLike} from '../../api/community';
import HeartIcon from '../../assets/imgs/heart.svg';
import HearthIcon from '../../assets/imgs/hearth.svg';
import EditIcon from '../../assets/imgs/edit.svg';
import TrashIcon from '../../assets/imgs/trash.svg';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../router/Navigator';
import userPlaceholder from '../../assets/imgs/user.png';

type PostDetailNavigationProp = StackNavigationProp<RootStackParamList>;

const PostDetail = () => {
  const navigation = useNavigation<PostDetailNavigationProp>();
  const route = useRoute();
  const {articleId} = route.params as {articleId: string};
  const [postDetail, setPostDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchPostDetail = async () => {
        setLoading(true);
        const result = await getPostDetail(articleId);

        if (result) {
          setPostDetail(result.status);
          setLiked(result.status.userLiked); // userLiked 상태 저장
        }
        setLoading(false);
      };

      fetchPostDetail();
    }, [articleId]),
  );

  const handleToggleLike = async () => {
    try {
      const updatedData = await toggleLike(articleId, liked); // 좋아요/취소 API 호출
      if (updatedData) {
        // API에서 최신 데이터를 다시 가져옵니다
        const updatedPostDetail = await getPostDetail(articleId);
        if (updatedPostDetail) {
          setPostDetail(updatedPostDetail.status); // 최신의 liked와 userLiked를 포함한 데이터를 설정
          setLiked(!liked); // 좋아요 상태 반전
        }
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      Alert.alert('오류', '좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleEditPress = () => {
    navigation.navigate('EditPost', {
      articleId,
      initialTitle: postDetail.title,
      initialContent: postDetail.content,
      initialImages: postDetail.images,
      initialtags: postDetail.tags,
    });
  };

  const handleDeletePress = async () => {
    try {
      await deletePost(articleId);
      Alert.alert('삭제 성공', '게시글이 삭제되었습니다.');
      navigation.navigate('Community');
    } catch (error) {
      Alert.alert('삭제 실패', '게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#418663" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {postDetail ? (
        <>
          <View style={styles.profileContainer}>
            <View style={styles.profileInfo}>
              <Image
                source={
                  postDetail.profileImage === 'default'
                    ? userPlaceholder
                    : {uri: postDetail.profileImage}
                }
                style={styles.profileImage}
              />
              <Text style={styles.nickname}>{postDetail.nickName || '작성자 이름'}</Text>
            </View>
            {postDetail.matched === true && (
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={handleEditPress}>
                  <EditIcon width={20} height={20} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeletePress}>
                  <TrashIcon width={20} height={20} style={styles.icon} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Text style={styles.title}>{postDetail.title}</Text>
          <Text style={styles.content}>{postDetail.content}</Text>

          <View style={styles.tagsContainer}>
            {postDetail.tags?.map((tag: any, index: number) => (
              <Text key={index} style={styles.tag}>
                #{tag.tag}
              </Text>
            ))}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imageCarousel}>
            {postDetail.images?.map((image: any, index: number) => (
              <Image key={index} source={{uri: image.url}} style={styles.image} />
            ))}
          </ScrollView>

          <View style={styles.detailsContainer}>
            <Text style={styles.location}>{postDetail.location || '위치 정보 없음'}</Text>
            <Text style={styles.time}>{postDetail.createdAt}</Text>
          </View>

          <View style={styles.likeContainer}>
            <TouchableOpacity onPress={handleToggleLike}>
              {liked ? (
                <HearthIcon width={20} height={20} /> // 좋아요 누른 후 아이콘
              ) : (
                <HeartIcon width={20} height={20} /> // 좋아요 누르기 전 아이콘
              )}
            </TouchableOpacity>
            <Text style={styles.likes}>좋아요 {postDetail.liked}</Text>
          </View>
        </>
      ) : (
        <Text style={styles.errorMessage}>게시글 정보를 불러오지 못했습니다.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F5FB',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nickname: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    fontFamily: 'Pretendard-Bold',
  },
  content: {
    fontSize: 15,
    color: '#666',
    fontFamily: 'Pretendard-Regular',
    lineHeight: 22,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  tag: {
    backgroundColor: '#E8E8E8',
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginRight: 5,
    marginBottom: 5,
    color: '#333',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 13,
  },
  imageCarousel: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 8,
    marginRight: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingBottom: 10,
  },
  location: {
    fontSize: 13,
    color: '#999',
  },
  time: {
    fontSize: 13,
    color: '#999',
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  likes: {
    fontSize: 14,
    marginLeft: 8,
    color: '#666',
  },
  errorMessage: {
    fontSize: 16,
    color: '#FF3333',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Pretendard-SemiBold',
  },
});

export default PostDetail;
