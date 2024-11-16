import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Modal, Image, TouchableOpacity} from 'react-native';
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroText,
  Viro3DObject,
  ViroARImageMarker,
  ViroARTrackingTargets,
  ViroAmbientLight,
  ViroSpotLight,
  ViroAnimations,
} from '@reactvision/react-viro';
interface HelloWorldSceneARProps {
  onAnimationEnd: () => void; // prop에 대한 타입을 명시
}
// 이미지 타겟 등록
ViroARTrackingTargets.createTargets({
  myImageTarget: {
    source: require('../../assets/ar/ssafy.jpg'),
    orientation: 'Up',
    physicalWidth: 0.1, // 이미지의 실제 크기(m 단위)
  },
});

// 애니메이션 등록
ViroAnimations.registerAnimations({
  throwBall: {
    properties: {
      positionX: 0,
      positionY: -1,
      positionZ: 0,
      rotateY: '+=360', // Y축 회전
    },
    duration: 1000,
    easing: 'easeInEaseOut',
  },
  monsterFlyAway: {
    properties: {
      positionY: '+=0.8', // 몬스터가 위로 이동
      scaleX: 0,
      scaleY: 0,
      scaleZ: 0,
      opacity: 0, // 투명해짐
    },
    duration: 800,
    easing: 'easeIn',
  },
});

const HelloWorldSceneAR: React.FC<HelloWorldSceneARProps> = ({onAnimationEnd}) => {
  const [text, setText] = useState('Initializing AR...');
  const [throwAnim, setThrowAnim] = useState(false);
  const [monsterAnim, setMonsterAnim] = useState(false);
  const [modelPosition, setModelPosition] = useState<[number, number, number]>([0, -0.2, 0.5]);
  const [isPositionSet, setIsPositionSet] = useState(false);

  useEffect(() => {
    setText('image plz...');
  }, []);

  const handleThrowBall = () => {
    setThrowAnim(true); // 공 던지기 애니메이션 실행
    setTimeout(() => {
      setMonsterAnim(true);
      setTimeout(() => {
        onAnimationEnd(); // 애니메이션 종료 시 콜백 호출
      }, 800); // 몬스터 애니메이션이 끝난 후
    }, 1000);
  };

  return (
    <ViroARScene>
      <ViroAmbientLight color="#FFFFFF" intensity={200} />
      <ViroSpotLight
        position={[0, 2, 0]}
        color="#ffcc00"
        direction={[0, -1, 0]}
        intensity={800}
        attenuationStartDistance={1}
        attenuationEndDistance={4}
        castsShadow={true}
      />
      <ViroARImageMarker
        target={'myImageTarget'}
        onAnchorFound={() => {
          if (!isPositionSet) {
            setModelPosition([0, -0.2, 0]);
            setIsPositionSet(true);
            setText('image ready!');
          }
        }}
        pauseUpdates={isPositionSet}>
        {isPositionSet && (
          <Viro3DObject
            source={require('../../assets/ar/3d-models/soccer.glb')}
            position={modelPosition}
            scale={[0.05, 0.05, 0.05]}
            type="GLB"
            onClick={handleThrowBall}
            animation={{
              name: 'throwBall',
              run: throwAnim,
              loop: false,
            }}
          />
        )}

        {isPositionSet && (
          <Viro3DObject
            source={require('../../assets/ar/3d-models/model.glb')}
            position={[0, -2, 0]}
            scale={[0.3, 0.3, 0.3]}
            type="GLB"
            animation={{
              name: 'monsterFlyAway',
              run: monsterAnim,
              loop: false,
            }}
          />
        )}
      </ViroARImageMarker>
      <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0.5, -1]}
        style={styles.helloWorldTextStyle}
      />
    </ViroARScene>
  );
};

const ARModalExample = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleAnimationEnd = () => {
    setModalVisible(true); // 모달 표시
  };

  return (
    <View style={{flex: 1}}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: () => <HelloWorldSceneAR onAnimationEnd={handleAnimationEnd} />,
        }}
        style={styles.f1}
      />

      {/* 모달 */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image source={require('../../assets/imgs/bbangmon.png')} style={styles.monsterImage} />
            <Text style={styles.monsterName}>단팥몬</Text>
            <Text style={styles.monsterRegion}>출몰지역: 성심당</Text>
            <View style={styles.monsterStats}>
              <Text>0.4m</Text>
              <Text>빵 타입</Text>
              <Text>3.2kg</Text>
            </View>
            <Text style={styles.monsterDescription}>
              단팥몬은 대전 성심당에서만 볼 수 있는 희귀 몬스터입니다. 단팥빵에서 태어나 성심당을
              돌아다니며 빵을 사랑하는 사람들을 지켜봅니다.
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
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
    fontSize: 30,
    color: '#ffffff',
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
