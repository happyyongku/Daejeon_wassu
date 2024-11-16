import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {getChatbotResponse} from '../../api/recommended'; // Axios 요청 함수 불러오기
const {width} = Dimensions.get('window');

interface ChatbotModalProps {
  visible: boolean;
  onClose: () => void;
}
const ChatbotModal: React.FC<ChatbotModalProps> = ({visible, onClose}) => {
  const [userInput, setUserInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');

  const handleSend = async () => {
    if (userInput.trim() === '') return;
    const response = await getChatbotResponse(userInput);
    setChatResponse(response || '죄송합니다. 응답을 받을 수 없습니다.');
  };

  // 모달을 닫을 때 상태 초기화
  const handleModalClose = () => {
    setUserInput('');
    setChatResponse('');
    onClose(); // 부모 컴포넌트의 상태를 변경하는 함수 호출
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>챗봇과 대화하기</Text>
          <ScrollView style={styles.chatContainer}>
            <Text style={styles.chatText}>{chatResponse}</Text>
          </ScrollView>
          <TextInput
            style={styles.input}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="챗봇에게 질문을 입력하세요"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendButtonText}>보내기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={handleModalClose}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: '#C8DECB',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    color: '#418663',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chatContainer: {
    maxHeight: 200,
    marginBottom: 10,
  },
  chatText: {
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#418663',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sendButton: {
    backgroundColor: '#418663',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#418663',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  closeButtonText: {
    color: '#418663',
    fontWeight: 'bold',
  },
});

export default ChatbotModal;
