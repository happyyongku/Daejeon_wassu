import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {getUserWassumon} from '../../api/recommended';

const {width} = Dimensions.get('window');

interface Wassumon {
  spot_id: number;
  wassumon_name: string;
  wassumon_image: string;
}

const Dogam = () => {
  const [wassumons, setWassumons] = useState<Wassumon[]>([]);

  useEffect(() => {
    const fetchWassumons = async () => {
      const data = await getUserWassumon();
      if (data) {
        setWassumons(data.collected_wassumons);
      }
    };
    fetchWassumons();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 도감</Text>
      <View style={styles.divider} />
      <LinearGradient
        colors={['#C8DECB', '#418663']}
        style={styles.gradientContainer}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}>
        {wassumons.map((wassumon, index) => (
          <View key={wassumon.spot_id} style={styles.monItem}>
            <Image
              source={{uri: wassumon.wassumon_image}}
              style={styles.monIcon}
              resizeMode="contain"
            />
            <Text style={styles.monText}>{wassumon.wassumon_name}</Text>
          </View>
        ))}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#333',
    marginTop: 20,
    marginBottom: 20,
  },
  divider: {
    height: 2,
    backgroundColor: '#418663',
  },
  gradientContainer: {
    flex: 1, // 부모 뷰 전체 높이를 차지하도록 설정
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // 아이템 간의 간격을 균등하게 설정
    alignItems: 'flex-start',
    paddingVertical: width * 0.1,
  },
  monItem: {
    alignItems: 'center',
    width: '30%', // 한 줄에 3개씩 표시되도록 설정
    marginBottom: 20,
  },
  monIcon: {
    width: 75,
    height: 75,
  },
  monText: {
    fontSize: 16,
    color: '#418663',
    fontFamily: 'Pretendard-Bold',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default Dogam;
