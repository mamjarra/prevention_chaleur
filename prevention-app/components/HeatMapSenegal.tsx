// app/components/HeatMapSenegal.tsx
import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import MapView, { Circle, PROVIDER_GOOGLE } from 'react-native-maps';

const ZONES_CHAUDES = [
  { name: 'Matam', latitude: 15.655, longitude: -13.25, risque: 'Très dangereux' },
  { name: 'Podor', latitude: 16.656, longitude: -14.95, risque: 'Dangereux' },
  { name: 'Kaffrine', latitude: 14.1, longitude: -15.5, risque: 'Très inconfortable' },
];

const getColor = (niveau: string) => {
  switch (niveau) {
    case 'Très dangereux': return 'rgba(231, 76, 60, 0.45)';
    case 'Dangereux': return 'rgba(230, 126, 34, 0.4)';
    case 'Très inconfortable': return 'rgba(241, 196, 15, 0.35)';
    default: return 'rgba(149, 165, 166, 0.3)';
  }
};

export default function HeatMapSenegal() {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webPlaceholder}>
        <Text style={styles.webText}>Carte non disponible sur le web</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 15.2,
          longitude: -14.3,
          latitudeDelta: 3.5,
          longitudeDelta: 3.5,
        }}
      >
        {ZONES_CHAUDES.map((zone, index) => (
          <Circle
            key={index}
            center={{
              latitude: zone.latitude,
              longitude: zone.longitude,
            }}
            radius={30000}
            strokeColor="transparent"
            fillColor={getColor(zone.risque)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  map: { flex: 1 },
  webPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 20,
    borderRadius: 12,
  },
  webText: {
    color: '#555',
    fontSize: 16,
    textAlign: 'center',
  },
});
