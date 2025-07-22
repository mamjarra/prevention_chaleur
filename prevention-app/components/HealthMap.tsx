// app/components/HealthMap.tsx
import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

const STRUCTURES = [
  { name: 'Centre de Santé Matam', latitude: 15.656, longitude: -13.248 },
  { name: 'Hôpital Podor', latitude: 16.658, longitude: -14.952 },
  { name: 'Poste de santé Kaffrine', latitude: 14.102, longitude: -15.502 },
];

export default function HealthMap() {
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
        {STRUCTURES.map((item, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
            title={item.name}
            description="Structure sanitaire"
            pinColor="#2ecc71"
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  map: { flex: 1 },
});
