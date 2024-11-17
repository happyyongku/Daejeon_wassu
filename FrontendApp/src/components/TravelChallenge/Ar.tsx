import React, {useState, useEffect} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import {StyleSheet, View, Text, Modal, Image, TouchableOpacity} from 'react-native';
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroText,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
  ViroAnimations,
} from '@reactvision/react-viro';
import {markSpotAsVisited, getWassumonDetails, getCourseDetail} from '../../api/recommended';

interface HelloWorldSceneARProps {
  onAnimationEnd: () => void;
}

// 애니메이션 등록
ViroAnimations.registerAnimations({
  // 공 던지기 애니메이션
  throwBall: {
    properties: {
      positionX: 0.1, // X축: 그대로
      positionY: 0.1, // Y축: 아래로 이동
      positionZ: -0.75, // Z축: 더 멀리 날아가도록 조정
      rotateY: '+=360', // Y축 회전
    },
    duration: 1000,
    easing: 'easeInEaseOut',
  },
  // 몬스터 날아가는 애니메이션
  monsterFlyAway: {
    properties: {
      positionX: '0.1', // X축: 공 쪽으로 이동 (왼쪽에서 약간만 이동)
      positionZ: '+=0.75', // Z축: 공 쪽으로 이동 (더 가까워지도록 조정)
      scaleX: 0, // 점점 작아짐
      scaleY: 0, // 점점 작아짐
      scaleZ: 0, // 점점 작아짐
      opacity: 0, // 투명해짐
    },
    duration: 800,
    easing: 'easeIn',
  },
});

const HelloWorldSceneAR: React.FC<HelloWorldSceneARProps & {wassumonName: string | null}> = ({
  onAnimationEnd,
  wassumonName,
}) => {
  const [text, setText] = useState('Initializing AR...');
  const [throwAnim, setThrowAnim] = useState(false);
  const [monsterAnim, setMonsterAnim] = useState(false);
  useEffect(() => {
    setText('Click Ball!');
  }, []);

  const handleThrowBall = () => {
    setThrowAnim(true);
    setTimeout(() => {
      setMonsterAnim(true);
      setTimeout(() => {
        onAnimationEnd();
      }, 800);
    }, 1000);
  };
  const getModelSource = () => {
    console.log('Getting model source for:', wassumonName); // 현재 wassumonName 값 확인
    switch (wassumonName) {
      case '밀면몬':
        return require('../../assets/ar/3d-models/밀면몬.glb');
      case '쌀국수몬':
        return require('../../assets/ar/3d-models/쌀국수몬.glb');
      case '칼국수몬':
        return require('../../assets/ar/3d-models/칼국수몬.glb');
      default:
        console.log('Default model used'); // 기본 모델이 선택된 경우
        return require('../../assets/ar/3d-models/model.glb');
    }
  };
  return (
    <ViroARScene>
      <ViroAmbientLight color="#FFFFFF" intensity={200} />
      <ViroSpotLight
        position={[0, 2, 0]}
        direction={[0, -1, 0]}
        attenuationStartDistance={1}
        attenuationEndDistance={4}
        castsShadow={true}
      />
      {/* soccer.glb 모델 - 고정된 위치 */}
      <Viro3DObject
        source={require('../../assets/ar/3d-models/bread_ball.glb')}
        position={[0, -0.1, -0.2]} // X: 0 (가운데), Y: -0.5 (적절한 높이), Z: -1 (정면에 위치)
        scale={[0.03, 0.03, 0.03]}
        type="GLB"
        onClick={handleThrowBall}
        animation={{
          name: 'throwBall',
          run: throwAnim,
          loop: false,
        }}
      />
      <Viro3DObject
        source={getModelSource()}
        position={[0, 0, -1.5]}
        scale={[0.6, 0.6, 0.6]}
        rotation={[0, 0, 0]}
        type="GLB"
        animation={{
          name: 'monsterFlyAway',
          run: monsterAnim,
          loop: false,
        }}
      />
      <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 1, -2]}
        style={styles.helloWorldTextStyle}
      />
    </ViroARScene>
  );
};

import type {RootStackParamList} from '../../router/Navigator';

type ARRouteProp = RouteProp<RootStackParamList, 'Ar'>;

const ARModalExample = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [wassumonDetails, setWassumonDetails] = useState<any>(null); // 상태 추가
  const [wassumonName, setWassumonName] = useState<string | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const route = useRoute<ARRouteProp>();
  const {courseId, spotId} = route.params;
  const navigation = useNavigation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Wassumon 세부 정보 가져오기
        const wassumonDetails = await getWassumonDetails(spotId);
        if (wassumonDetails) {
          setWassumonDetails(wassumonDetails);
          setWassumonName(wassumonDetails.wassumon_name);
          console.log('Wassumon details:', wassumonDetails); // Wassumon 세부 정보 로그
          console.log('Wassumon name set to:', wassumonDetails.wassumon_name); // Wassumon name 로그
        } else {
          console.log('Wassumon details not found for spotId:', spotId); // 추가 로그
        }

        // 코스 세부 정보 가져오기 및 해당 spotId에 맞는 모델 URL 찾기
        const courseDetails = await getCourseDetail(courseId);
        if (courseDetails && courseDetails.course_details) {
          const spotDetail = courseDetails.course_details.find(
            (detail: any) => detail.spot_id === spotId,
          );
          if (spotDetail && spotDetail.wassumon_model) {
            setModelUrl(spotDetail.wassumon_model);
          }
          console.log('Course details:', courseDetails); // 코스 세부 정보 로그
        }
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
      }
    };

    fetchData();
  }, [courseId, spotId]);
  // 모달 열릴 때 post 요청 수행
  useEffect(() => {
    if (modalVisible && wassumonDetails) {
      const markVisited = async () => {
        try {
          // courseId와 spotId를 함께 전달
          const response = await markSpotAsVisited(courseId, spotId);
          console.log('Spot marked as visited:', response);
        } catch (error) {
          console.error('Error marking spot as visited:', error);
        }
      };

      markVisited();
    }
  }, [modalVisible, wassumonDetails, courseId, spotId]);

  const handleAnimationEnd = async () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <View style={{flex: 1}}>
      {wassumonName ? ( // wassumonName이 null이 아닐 때만 ViroARSceneNavigator 렌더링
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{
            scene: () => (
              <HelloWorldSceneAR onAnimationEnd={handleAnimationEnd} wassumonName={wassumonName} />
            ),
          }}
          style={styles.f1}
        />
      ) : (
        <Text>Loading AR scene...</Text> // 로딩 중 메시지 추가
      )}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {wassumonDetails && (
              <>
                <Image source={{uri: wassumonDetails.wassumon_image}} style={styles.monsterImage} />
                <Text style={styles.monsterName}>{wassumonDetails.wassumon_name}</Text>
                <Text style={styles.monsterRegion}>출몰지역: {wassumonDetails.spot_name}</Text>
                <View style={styles.monsterStats}>
                  <Text>{wassumonDetails.wassumon_height}m</Text>
                  <Text>{wassumonDetails.wassumon_type} 타입</Text>
                  <Text>{wassumonDetails.wassumon_weight}kg</Text>
                </View>
                <Text style={styles.monsterDescription}>
                  {wassumonDetails.wassumon_description}
                </Text>
              </>
            )}
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ARModalExample;

const styles = StyleSheet.create({
  f1: {flex: 1},
  helloWorldTextStyle: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
    color: '#040404',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  monsterImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  monsterName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  monsterRegion: {
    fontSize: 16,
    color: '#418663',
    marginBottom: 10,
  },
  monsterStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  monsterDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#418663',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
