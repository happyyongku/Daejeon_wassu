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
} from 'react-native';

const {width} = Dimensions.get('window');

const Writing = () => {
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isLocationModalVisible, setLocationModalVisible] = useState(false);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('카테고리 선택');
  const [selectedLocation, setSelectedLocation] = useState<string>('여행지 선택');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

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

  const handleRegister = () => {
    // 글 등록 로직 구현
    console.log('제목:', title);
    console.log('내용:', content);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>새 여행기</Text>
        <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
          <Text style={styles.registerButtonText}>등록</Text>
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
      <TouchableOpacity style={styles.imageUploadContainer} onPress={toggleImageModal}>
        <Image source={require('../../assets/imgs/image.png')} style={styles.imageIcon} />
      </TouchableOpacity>

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
    right: 10, // 오른쪽 끝으로 위치
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
});

export default Writing;
