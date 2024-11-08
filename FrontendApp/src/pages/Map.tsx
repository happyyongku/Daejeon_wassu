import React, {useState} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {GOOGLE_MAPS_API_KEY} from '@env';

const origin = {
  latitude: 36.33229969,
  longitude: 127.4341122,
};

const destination = {
  latitude: 36.367771,
  longitude: 127.3886019,
};

// 중간 지점 계산
const midPoint = {
  latitude: (origin.latitude + destination.latitude) / 2,
  longitude: (origin.longitude + destination.longitude) / 2,
};

// 지도 줌 수준 계산
const latitudeDelta = Math.abs(origin.latitude - destination.latitude) * 1.5; // 1.5배로 여유 공간을 확보
const longitudeDelta = Math.abs(origin.longitude - destination.longitude) * 1.5;

const Map: React.FC = () => {
  const [travelInfo, setTravelInfo] = useState<{duration: number; distance: number} | null>(null);
  const [showDirections, setShowDirections] = useState(false);

  const handleShowDirections = () => {
    setShowDirections(true);
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: midPoint.latitude,
          longitude: midPoint.longitude,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        }}>
        <Marker coordinate={origin} title="Origin" />
        <Marker coordinate={destination} title="Destination" />

        {showDirections && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_API_KEY}
            mode="TRANSIT"
            strokeWidth={4}
            strokeColor="blue"
            onReady={result => {
              setTravelInfo({
                duration: result.duration,
                distance: result.distance,
              });

              console.log(`예상 시간: ${result.duration}분`);
              console.log(`거리: ${result.distance} km`);
            }}
            onError={errorMessage => {
              console.log('Directions API Error:', errorMessage);
            }}
          />
        )}
      </MapView>

      <View style={styles.infoContainer}>
        <Button title="Show Directions" onPress={handleShowDirections} />
        {travelInfo && (
          <Text style={styles.infoText}>
            예상 시간: {Math.round(travelInfo.duration)}분, 거리: {travelInfo.distance.toFixed(2)}{' '}
            km
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default Map;
