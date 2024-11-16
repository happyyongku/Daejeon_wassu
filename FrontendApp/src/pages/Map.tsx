// import React, {useEffect, useState} from 'react';
// import {View, Text, StyleSheet, Button} from 'react-native';
// import {getTokens} from '../utills/tokenStorage';
// import SSE from 'react-native-sse'; // react-native-sse 사용
// import axios from 'axios';

// interface EventData {
//   user1Email: string;
//   user1Data: number;
//   user2Email: string;
//   user2Data: number;
// }

// const RoomScreen = () => {
//   const [event, setEvent] = useState<EventData | null>(null);
//   const [error, setError] = useState<string | null>(null); // 오류 상태 추가

//   useEffect(() => {
//     // 마운트 시작
//     console.log('마운트 시작');

//     const fetchTokenAndConnect = async () => {
//       try {
//         const {accessToken} = await getTokens();
//         // console.log('AccessToken:', accessToken);
//         // AccessToken 출력

//         // 확인: accessToken이 없으면 오류 처리
//         if (!accessToken) {
//           setError('No access token found');
//           return;
//         }

//         // SSE 연결 설정
//         const sse = new SSE('https://k11b105.p.ssafy.io/wassu/tourist/test/1', {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         // 연결 성공 시
//         sse.addEventListener('open', () => {
//           console.log('연결 성공');
//         });

//         // `ping` 이벤트 수신
//         sse.addEventListener('ping', (event: any) => {
//           console.log('Received ping event:', event.data); // `ping` 이벤트 처리
//           setEvent(event.data); // 데이터를 상태로 설정
//         });

//         sse.addEventListener('message', (event: any) => {
//           console.log('SSE 데이터 수신:', event.data);
//           // const data: EventData = JSON.parse(event.data);
//           setEvent(event.data);
//         });

//         sse.addEventListener('error', (error: any) => {
//           console.error('SSE 연결 에러:', error);
//           setError('SSE 연결 실패');
//         });

//         // SSE 연결 종료 시
//         return () => {
//           sse.close();
//           console.log('연결 종료');
//         };
//       } catch (error) {
//         console.error('SSE 연결 중 오류 발생:', error);
//         setError('SSE 연결 중 오류 발생');
//       }
//     };

//     fetchTokenAndConnect();
//   }, []);

//   // 데이터 전송 핸들러
//   const sendMessage = async () => {
//     const {accessToken} = await getTokens(); // 토큰 가져오기
//     try {
//       const response = await axios.get(`https://k11b105.p.ssafy.io/wassu/tourist/send/1`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`, // 헤더에 accessToken 추가
//         },
//       });
//       console.log('Message sent:', response.data);
//     } catch (error) {
//       console.error('Failed to send message:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Room ID: 1</Text>
//       <Text style={styles.title}>user 1: {event?.user1Email || 'No Data'}</Text>
//       <Text style={styles.title}>user 2: {event?.user2Email || 'No Data'}</Text>
//       <Text style={styles.subtitle}>Events: {event?.user1Data ?? 'No Data'}</Text>
//       <Text style={styles.subtitle}>Events: {event?.user2Data ?? 'No Data'}</Text>

//       {/* 연결 오류 메시지 출력 */}
//       {error && <Text style={styles.error}>{error}</Text>}

//       <Button title="데이터 보내자." onPress={sendMessage} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f9f9f9',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   error: {
//     color: 'red',
//     marginTop: 20,
//     fontSize: 16,
//   },
// });

// export default RoomScreen;
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {getTokens} from '../utills/tokenStorage';
import SSE from 'react-native-sse'; // react-native-sse 사용
import axios from 'axios';

interface EventData {
  user1Email: string;
  user1Data: number;
  user2Email: string;
  user2Data: number;
}

const RoomScreen = () => {
  const [event1, setEvent] = useState<EventData | null>(null);
  const [error, setError] = useState<string | null>(null); // 오류 상태 추가
  // const [pingStatus, setPingStatus] = useState<string>(''); // ping 상태 추가

  useEffect(() => {
    // 마운트 시작
    console.log('마운트 시작');

    const fetchTokenAndConnect = async () => {
      try {
        const {accessToken} = await getTokens();

        // 확인: accessToken이 없으면 오류 처리
        if (!accessToken) {
          setError('No access token found');
          return;
        }

        // SSE 연결 설정
        const sse = new SSE('https://k11b105.p.ssafy.io/wassu/tourist/test/1', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // 연결 성공 시
        sse.addEventListener('open', () => {
          console.log('연결 성공');
        });

        // `message` 이벤트 처리 (기존 메시지 이벤트)
        sse.addEventListener('message', (event: any) => {
          console.log('SSE message event data received:', event.data);
          if (event.data !== 'keep-alive') {
            const parsedData = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            setEvent(parsedData);
            console.log(parsedData.user1Data);
          }
        });

        sse.addEventListener('error', (error: any) => {
          console.error('SSE 연결 에러:', error);
          setError('SSE 연결 실패');
        });

        // SSE 연결 종료
        return () => {
          sse.close();
          console.log('연결 종료');
        };
      } catch (error) {
        console.error('SSE 연결 중 오류 발생:', error);
        setError('SSE 연결 중 오류 발생');
      }
    };

    fetchTokenAndConnect();
  }, []);

  // 데이터 전송 핸들러
  const sendMessage = async () => {
    const {accessToken} = await getTokens(); // 토큰 가져오기
    try {
      const response = await axios.get(`https://k11b105.p.ssafy.io/wassu/tourist/send/1`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // 헤더에 accessToken 추가
        },
      });
      console.log('Message sent:', response.data);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Room ID: 1</Text>
      {/* <Text style={styles.title}>{event1}</Text> */}
      <Text style={styles.title}>user 1: {event1?.user1Email || 'No Data'}</Text>
      <Text style={styles.title}>user 2: {event1?.user2Email || 'No Data'}</Text>
      <Text style={styles.subtitle}>Events: {event1?.user1Data ?? 'No Data'}</Text>
      <Text style={styles.subtitle}>Events: {event1?.user2Data ?? 'No Data'}</Text>

      {/* 연결 오류 메시지 출력 */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* ping 이벤트 상태 표시 */}
      {/* {pingStatus && <Text style={styles.pingStatus}>Ping Status: {pingStatus}</Text>} */}

      <Button title="데이터 보내자." onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginTop: 20,
    fontSize: 16,
  },
  pingStatus: {
    color: 'green',
    marginTop: 20,
    fontSize: 16,
  },
});

export default RoomScreen;
