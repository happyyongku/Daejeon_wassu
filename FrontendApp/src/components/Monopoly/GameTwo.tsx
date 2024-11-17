/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Modal,
  Image,
  useWindowDimensions,
  Alert,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Confetti from 'react-native-confetti';
import {useRoute, RouteProp} from '@react-navigation/native';
import type {RootStackParamList} from '../../router/Navigator';
import {
  getRoomDetails,
  playMarble,
  verifyLocation,
  endGame,
  regenerateInviteCode,
} from '../../api/mono';
import {getTokens} from '../../utills/tokenStorage';
import SSE from 'react-native-sse';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';

type GameTwoRouteProp = RouteProp<RootStackParamList, 'GameTwo'>;
type GameTwoNavigationProp = StackNavigationProp<RootStackParamList>;

type Place = {
  id: number;
  place: string;
  image: any;
};

const PLACE_LIST = [
  {id: 1, place: '출발지', image: require('../../assets/imgs/hanbat.png')},
  {id: 2, place: '대전역', image: require('../../assets/imgs/hanbat.png')},
  {id: 3, place: '유성온천', image: require('../../assets/imgs/hanbat.png')},
  {id: 4, place: '엑스포', image: require('../../assets/imgs/hanbat.png')},
  {id: 5, place: '오월드', image: require('../../assets/imgs/hanbat.png')},
  {id: 6, place: '대청댐', image: require('../../assets/imgs/hanbat.png')},
  {id: 7, place: '계룡산', image: require('../../assets/imgs/hanbat.png')},
  {id: 8, place: '한밭수목원', image: require('../../assets/imgs/hanbat.png')},
  {id: 9, place: '동학사', image: require('../../assets/imgs/hanbat.png')},
  {id: 10, place: '충남대', image: require('../../assets/imgs/hanbat.png')},
  {id: 11, place: '전민동', image: require('../../assets/imgs/hanbat.png')},
  {id: 12, place: '대덕구청', image: require('../../assets/imgs/hanbat.png')},
  {id: 13, place: '서구청', image: require('../../assets/imgs/hanbat.png')},
  {id: 14, place: '갑천', image: require('../../assets/imgs/hanbat.png')},
  {id: 15, place: '유림공원', image: require('../../assets/imgs/hanbat.png')},
  {id: 16, place: '정부청사', image: require('../../assets/imgs/hanbat.png')},
  {id: 17, place: '국립중앙과학관수장', image: require('../../assets/imgs/hanbat.png')},
  {id: 18, place: '한밭도서관', image: require('../../assets/imgs/hanbat.png')},
  {id: 19, place: '대전시립미술관', image: require('../../assets/imgs/hanbat.png')},
  {id: 20, place: '천문대', image: require('../../assets/imgs/hanbat.png')},
  {id: 21, place: '갑천초등학교', image: require('../../assets/imgs/hanbat.png')},
  {id: 22, place: '동구청', image: require('../../assets/imgs/hanbat.png')},
  {id: 23, place: '대전컨벤션센터', image: require('../../assets/imgs/hanbat.png')},
  {id: 24, place: '엑스포대교', image: require('../../assets/imgs/hanbat.png')},
  {id: 25, place: '동부선', image: require('../../assets/imgs/hanbat.png')},
  {id: 26, place: '남부선', image: require('../../assets/imgs/hanbat.png')},
  {id: 27, place: '서부선', image: require('../../assets/imgs/hanbat.png')},
  {id: 28, place: '도착지', image: require('../../assets/imgs/hanbat.png')},
];

// 그룹 색상 배열
const GROUP_COLORS = ['#E0F2E0', '#D0E8FF', '#FFE0E0', '#FFF7CC'];

const GameTwo = () => {
  const route = useRoute<GameTwoRouteProp>();
  const {roomId, inviteCode: initialInviteCode} = route.params as {
    roomId: number;
    inviteCode?: string;
  };
  const [inviteCode, setInviteCode] = useState(initialInviteCode);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [diceRolling, setDiceRolling] = useState(false);
  const [showDiceResult, setShowDiceResult] = useState(false);
  const confettiRef = useRef<Confetti | null>(null);
  const {width, height} = useWindowDimensions();
  const [showInviteCode, setShowInviteCode] = useState(false);

  const TOP_CELLS = 9;
  const SIDE_CELLS = 5;
  const CELL_WIDTH = width / TOP_CELLS;
  const CELL_HEIGHT = height / (SIDE_CELLS + 2);

  useEffect(() => {
    Orientation.lockToLandscape();

    const connectSSE = async () => {
      try {
        const {accessToken} = await getTokens();
        if (!accessToken) return;

        const sse = new SSE(`https://k11b105.p.ssafy.io/wassu/marble/room/${roomId}/sync`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        sse.addEventListener('open', () => {
          console.log('SSE 연결 성공');
        });

        sse.addEventListener('open', () => {
          console.log('연결 성공');
        });

        sse.addEventListener('message', (event: any) => {
          console.log('SSE message event data received:', event.data);
          if (event.data !== 'keep-alive') {
            const parsedData = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            console.log(parsedData.user1Data);
          }
        });

        sse.addEventListener('error', (error: any) => {
          console.error('SSE 연결 에러:', error);
        });
        return () => {
          sse.close();
          console.log('SSE 연결 종료');
        };
      } catch (error) {
        console.error('SSE 연결 중 오류 발생:', error);
      }
    };

    connectSSE();

    return () => {
      Orientation.unlockAllOrientations();
    };
  }, [roomId]);

  useEffect(() => {
    const fetchInviteCode = async () => {
      try {
        const {inviteCode: newInviteCode} = await regenerateInviteCode(roomId);
        console.log('재생성된 초대코드:', newInviteCode);
        setInviteCode(newInviteCode);
      } catch (error) {
        console.error('초대코드 재생성 실패:', error);
      }
    };
    fetchInviteCode();
    const interval = setInterval(fetchInviteCode, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, [roomId]);

  const handleCellPress = (place: Place) => {
    setSelectedPlace(place);
    setModalVisible(true);
  };

  const handleRollDice = () => {
    setDiceRolling(true); // 주사위 GIF 시작
    setTimeout(() => {
      setDiceRolling(false); // 주사위 GIF 종료
      const dice = Math.floor(Math.random() * 6) + 1; // 주사위 값 생성
      setDiceResult(dice);
      setShowDiceResult(true); // 주사위 결과 표시
      confettiRef.current?.startConfetti(); // 빵빠레 시작

      // 2초 후에 빵빠레 중지 및 주사위 결과 숨김
      setTimeout(() => {
        confettiRef.current?.stopConfetti();
        setShowDiceResult(false);

        // 주사위 값에 따라 이동 시작
        let steps = 0;
        const interval = setInterval(() => {
          setCurrentPosition(prevPosition => {
            const newPosition = (prevPosition + 1) % PLACE_LIST.length;
            steps++;
            if (steps === dice) {
              clearInterval(interval); // 이동 완료
              setSelectedPlace(PLACE_LIST[newPosition]); // 도착지 선택
              setModalVisible(true); // 도착지 모달 표시
            }
            return newPosition;
          });
        }, 500); // 500ms 간격 이동
      }, 2000); // 2초 동안 결과 표시 후 이동 시작
    }, 2900); // 2.9초 동안 GIF 실행
  };

  const toggleInviteCodeVisibility = () => {
    setShowInviteCode(prev => !prev);
  };

  const renderCells = () => {
    return PLACE_LIST.map((place, index) => {
      let left = 0;
      let top = 0;

      if (index < TOP_CELLS) {
        left = (TOP_CELLS - 1 - index) * CELL_WIDTH;
        top = height - CELL_HEIGHT;
      } else if (index < TOP_CELLS + SIDE_CELLS) {
        left = 0;
        top = (SIDE_CELLS - (index - TOP_CELLS)) * CELL_HEIGHT;
      } else if (index < TOP_CELLS * 2 + SIDE_CELLS) {
        left = (index - TOP_CELLS - SIDE_CELLS) * CELL_WIDTH;
        top = 0;
      } else {
        left = width - CELL_WIDTH;
        top = (index - TOP_CELLS * 2 - SIDE_CELLS + 1) * CELL_HEIGHT;
      }

      let cellColor = '';
      if (index < 9) {
        cellColor = GROUP_COLORS[0];
      } else if (index < 14) {
        cellColor = GROUP_COLORS[1];
      } else if (index < 23) {
        cellColor = GROUP_COLORS[2];
      } else {
        cellColor = GROUP_COLORS[3];
      }

      return (
        <TouchableOpacity
          key={place.id}
          style={[styles.cell, {left, top}]}
          onPress={() => handleCellPress(place)}>
          <LinearGradient
            colors={['#f1f1f1', cellColor, '#b0b0b0']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={StyleSheet.absoluteFillObject}
          />
          {currentPosition === index && (
            <Image source={require('../../assets/imgs/mono/pn.png')} style={styles.playerIcon} />
          )}
          <Text style={styles.cellText}>{place.place}</Text>
        </TouchableOpacity>
      );
    });
  };

  const handlePass = () => {
    console.log('Pass Button Clicked');
  };

  const handleReRoll = () => {
    console.log('Re-roll Button Clicked');
    handleRollDice();
  };

  const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: width,
      height: height,
      justifyContent: 'center',
      alignItems: 'center',
    },
    boardContainer: {
      position: 'absolute',
      width: width,
      height: height,
    },
    cellText: {
      fontSize: 12,
      color: '#333',
      textAlign: 'center',
      fontFamily: 'Pretendard-Bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: width * 0.4,
      backgroundColor: '#fff',
      borderRadius: 15,
      padding: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333333',
    },
    modalImage: {
      width: width * 0.3,
      height: 130,
      resizeMode: 'cover',
      marginBottom: 20,
      borderRadius: 8,
    },
    modalButton: {
      backgroundColor: '#418663',
      paddingVertical: 7,
      paddingHorizontal: 15,
      borderRadius: 15,
    },
    modalButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 12,
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: '#FF6B6B',
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    rollButton: {
      position: 'absolute',
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#418663',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: 70,
      shadowColor: '#000',
      shadowOffset: {width: 4, height: 4},
      shadowOpacity: 0.8,
      shadowRadius: 6,
      elevation: 10,
    },
    rollButtonText: {
      fontSize: 16,
      color: '#fff',
      fontWeight: 'bold',
    },
    playerIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      resizeMode: 'cover',
      position: 'absolute',
      zIndex: 100,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: '#fff',
      elevation: 11, // Android 전용 그림자 높이
    },
    cell: {
      position: 'absolute',
      width: CELL_WIDTH,
      height: CELL_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor: '#c0c0c0',
      shadowColor: '#000',
      shadowOffset: {width: 4, height: 4},
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 8,
      overflow: 'hidden',
    },
    gradientBackground: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: 8,
    },
    diceImage: {
      width: 150,
      height: 150,
      position: 'absolute',
      alignSelf: 'center',
      justifyContent: 'center',
    },
    diceResultContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{translateX: 0}, {translateY: -50}],
      justifyContent: 'center',
      alignItems: 'center',
    },
    diceResultText: {
      fontSize: 50,
      color: '#333',
      fontFamily: 'Pretendard-ExtraBold',
    },
    actionButton: {
      position: 'absolute',
      bottom: 80,
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#333',
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionButtons: {
      position: 'absolute',
      bottom: 80,
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionButtonText: {
      color: '#fff',
      fontSize: 14,
      fontFamily: 'Pretendard-ExtraBold',
    },
    actionButtonTexts: {
      color: '#333',
      fontSize: 14,
      fontFamily: 'Pretendard-ExtraBold',
    },
    passButton: {
      position: 'absolute',
      bottom: 150,
      padding: 10,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 4, height: 4},
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 8,
    },
    passButtonText: {
      color: '#fff',
      fontSize: 14,
      fontFamily: 'Pretendard-ExtraBold',
    },
    inviteCodeContainer: {
      position: 'absolute',
      left: CELL_WIDTH * 1.5,
      top: height * 0.2,
      backgroundColor: '#fff',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: {width: 2, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    inviteCodeText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
    },
    hiddenInviteCode: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#aaa',
      textAlign: 'center',
    },
  });

  return (
    <ImageBackground
      source={require('../../assets/imgs/mono/DBac1.png')}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.boardContainer}>{renderCells()}</View>

      <View style={styles.inviteCodeContainer}>
        <TouchableOpacity onPress={toggleInviteCodeVisibility}>
          <Text style={showInviteCode ? styles.inviteCodeText : styles.hiddenInviteCode}>
            {showInviteCode ? inviteCode : '초대코드 보기'}
          </Text>
        </TouchableOpacity>
      </View>

      {diceRolling && (
        <FastImage
          style={{width: 300, height: 300}}
          source={require('../../assets/imgs/mono/dice.gif')}
          resizeMode={FastImage.resizeMode.contain}
        />
      )}

      {showDiceResult && (
        <View style={styles.diceResultContainer}>
          <Text style={styles.diceResultText}>{diceResult}</Text>
        </View>
      )}

      <Confetti ref={confettiRef} duration={2000} />

      {selectedPlace && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{selectedPlace.place}</Text>
              <Image source={selectedPlace.image} style={styles.modalImage} />
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <TouchableOpacity style={[styles.actionButton, {left: width / 2 - 130}]} onPress={handlePass}>
        <Text style={styles.actionButtonText}>Pass</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.rollButton} onPress={handleRollDice}>
        <Text style={styles.rollButtonText}>Roll</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButtons, {right: width / 2 - 130}]}
        onPress={handleReRoll}>
        <Text style={styles.actionButtonTexts}>Re-roll</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default GameTwo;
