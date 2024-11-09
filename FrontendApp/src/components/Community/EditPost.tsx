import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  FlatList,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {updatePost} from '../../api/community';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RootStackParamList} from '../../router/Navigator';
import type {StackNavigationProp} from '@react-navigation/stack';

const {width} = Dimensions.get('window');

type EditPostScreenProp = StackNavigationProp<RootStackParamList, 'EditPost'>;

const EditPost = () => {
  const navigation = useNavigation<EditPostScreenProp>();
  const route = useRoute();
  const {articleId} = route.params as {articleId: string};

  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isLocationModalVisible, setLocationModalVisible] = useState(false);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('카테고리 선택');
  const [selectedLocation, setSelectedLocation] = useState<string>('여행지 선택');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [images, setImages] = useState<any[]>([]);

  const categories: string[] = [
    '전체',
    '맛집',
    '숙소',
    '우천',
    '스포츠',
    '예술',
    '빵',
    '역사',
    '과학',
  ];
  const locations: string[] = ['임시1', '임시2', '임시3'];

  const toggleCategoryModal = () => setCategoryModalVisible(!isCategoryModalVisible);
  const toggleLocationModal = () => setLocationModalVisible(!isLocationModalVisible);
  const toggleImageModal = () => setImageModalVisible(!isImageModalVisible);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCategoryModalVisible(false);
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setLocationModalVisible(false);
  };

  const handleImagePick = async () => {
    if (images.length >= 3) {
      Alert.alert('이미지 추가 불가', '최대 3장까지 이미지를 추가할 수 있습니다.');
      return;
    }

    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.5,
    });

    if (result && result.assets && result.assets.length > 0) {
      setImages(prevImages => [
        ...prevImages,
        ...result.assets!.slice(0, 3 - prevImages.length).map(asset => ({
          uri: asset.uri!,
          type: asset.type ?? 'image/jpeg',
          fileName: asset.fileName ?? `image_${prevImages.length}.jpg`,
        })),
      ]);
    }
  };

  // 수정 버튼 핸들러
  const handleUpdate = async () => {
    if (!title || !content || selectedCategory === '카테고리 선택') {
      Alert.alert('모든 필드를 입력해 주세요.');
      return;
    }

    const articleDTO = {
      title,
      content,
      tags: [selectedCategory],
    };

    try {
      await updatePost(articleId, articleDTO, images);
      Alert.alert('게시글이 수정되었습니다.');
      navigation.navigate('Community');
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      Alert.alert('수정 실패', '게시글 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>게시글 수정</Text>
        <TouchableOpacity onPress={handleUpdate} style={styles.registerButton}>
          <Text style={styles.registerButtonText}>수정</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />

      {/* Category Selection */}
      <TouchableOpacity style={styles.selectionContainer} onPress={toggleCategoryModal}>
        <Text style={styles.selectionText}>{selectedCategory}</Text>
        <Image source={require('../../assets/imgs/chevron-right.png')} style={styles.chevronIcon} />
      </TouchableOpacity>
      <View style={styles.divider} />

      {/* Location Selection */}
      <TouchableOpacity style={styles.selectionContainer} onPress={toggleLocationModal}>
        <Text style={styles.selectionText}>{selectedLocation}</Text>
        <Image source={require('../../assets/imgs/chevron-right.png')} style={styles.chevronIcon} />
      </TouchableOpacity>
      <View style={styles.divider} />

      {/* Image Upload */}
      <View style={styles.imageUploadContainer}>
        <ScrollView horizontal>
          {images.map((image, index) => (
            <Image key={index} source={{uri: image.uri}} style={styles.uploadedImage} />
          ))}
          {images.length < 3 && (
            <TouchableOpacity onPress={handleImagePick} style={styles.addImageContainer}>
              <Image source={require('../../assets/imgs/image.png')} style={styles.imageIcon} />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Title Input */}
      <TextInput
        style={styles.titleInput}
        placeholder="제목을 작성해주세요"
        value={title}
        onChangeText={setTitle}
      />

      {/* Content Input */}
      <TextInput
        style={styles.contentInput}
        placeholder="내용을 작성해주세요"
        value={content}
        onChangeText={setContent}
        multiline
      />

      {/* Category Modal */}
      <Modal visible={isCategoryModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={categories}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleCategorySelect(item)}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={toggleCategoryModal}>
              <Text style={styles.closeButton}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Location Modal */}
      <Modal visible={isLocationModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={locations}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleLocationSelect(item)}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={toggleLocationModal}>
              <Text style={styles.closeButton}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Image Modal */}
      <Modal visible={isImageModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalOption}>앨범에서 선택</Text>
            <View style={styles.divider} />
            <TouchableOpacity onPress={toggleImageModal}>
              <Text style={styles.closeButton}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
  },
  registerButton: {
    position: 'absolute',
    right: 10,
  },
  registerButtonText: {
    fontSize: 16,
    color: '#418663',
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: width * 0.06,
  },
  selectionText: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#333333',
  },
  chevronIcon: {
    width: 24,
    height: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  imageUploadContainer: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: width * 0.06,
  },
  imageIcon: {
    width: 80,
    height: 80,
  },
  titleInput: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    color: '#999999',
    paddingVertical: 20,
    paddingHorizontal: width * 0.06,
  },
  contentInput: {
    fontSize: 16,
    color: '999999',
    paddingVertical: 10,
    height: 100,
    textAlignVertical: 'top',
    paddingHorizontal: width * 0.06,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    paddingVertical: 15,
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    textAlign: 'center',
    color: '#418663',
    marginTop: 10,
    fontSize: 16,
  },
  modalOption: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  addImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
});

export default EditPost;
