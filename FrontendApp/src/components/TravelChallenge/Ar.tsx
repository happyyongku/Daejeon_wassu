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
import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';

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
      positionX: 0, // 목표 위치의 x축
      positionY: -1, // 목표 위치의 y축
      positionZ: 0, // 목표 위치의 z축
      rotateY: '+=360', // Y축을 기준으로 회전
    },
    duration: 1000,
    easing: 'easeInEaseOut',
  },
  fadeOut: {
    properties: {
      opacity: 0,
    },
    duration: 500,
  },
});

const HelloWorldSceneAR = () => {
  const [text, setText] = useState('Initializing AR...');
  const [throwAnim, setThrowAnim] = useState(false); // 공 던지기 애니메이션 상태
  const [modelPosition, setModelPosition] = useState<[number, number, number]>([0, -0.2, 0.5]);
  const [isPositionSet, setIsPositionSet] = useState(false);

  useEffect(() => {
    setText('image plz...');
  }, []);

  const handleThrowBall = () => {
    setThrowAnim(true); // 터치 시 공 던지기 애니메이션 실행
  };

  return (
    <ViroARScene>
      <ViroAmbientLight color="#FFFFFF" intensity={200} />

      {/* 빛 효과 추가 */}
      <ViroSpotLight
        position={[0, 4, 1]} // 빛의 위치를 조정
        color="#ffffff"
        direction={[0, -1, -0.2]}
        intensity={500} // 빛의 강도 값 설정
        attenuationStartDistance={2}
        attenuationEndDistance={5}
        castsShadow={true}
      />

      <ViroARImageMarker
        target={'myImageTarget'}
        onAnchorFound={() => {
          if (!isPositionSet) {
            setModelPosition([0, -0.2, 0]); // 위치를 한 번만 설정
            setIsPositionSet(true);
            setText('image ready!');
          }
        }}
        pauseUpdates={isPositionSet} // 인식이 한 번 완료되면 업데이트 중지
      >
        {isPositionSet && ( // 위치가 설정된 경우에만 렌더링
          <Viro3DObject
            source={require('../../assets/ar/3d-models/soccer.glb')}
            position={modelPosition}
            scale={[0.05, 0.05, 0.05]} // 공 크기 조정
            type="GLB"
            onClick={handleThrowBall}
            animation={{
              name: 'throwBall',
              run: throwAnim,
              loop: false,
            }}
          />
        )}

        {/* 목표 3D 모델 */}
        {isPositionSet && (
          <Viro3DObject
            source={require('../../assets/ar/3d-models/model.glb')}
            position={[0, -2, 0]}
            scale={[0.3, 0.3, 0.3]}
            type="GLB"
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

export default () => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: HelloWorldSceneAR,
      }}
      style={styles.f1}
    />
  );
};

const styles = StyleSheet.create({
  f1: {flex: 1},
  helloWorldTextStyle: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
