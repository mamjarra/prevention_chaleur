// app/components/MapMobile.tsx
import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';

export default function MapMobile({
  coords,
}: {
  coords?: { latitude: number; longitude: number };
}) {
  if (!coords) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#555' }}>📍 Position non disponible</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
    >
      <Marker
        coordinate={coords}
        title="Votre position"
        description="Vous êtes ici"
        pinColor="#2ecc71"
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
