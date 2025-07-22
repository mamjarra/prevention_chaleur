import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert, Button } from 'react-native';
import * as Location from 'expo-location';
import MapMobile from '@/components/MapMobile';

export default function LocationScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string>('Initialisation...');

  const getLocation = async () => {
    setLoading(true);
    try {
      setStatusMsg('Demande de permission...');
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      console.log('Permission status:', status);
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'L\'application a besoin de votre position pour fonctionner.');
        setStatusMsg(`Permission refusée. Can ask again: ${canAskAgain}`);
        setLoading(false);
        return;
      }

      setStatusMsg('Récupération de la position...');
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      console.log('Position récupérée:', loc.coords);
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setStatusMsg('Position détectée ✔️');
    } catch (error: any) {
      console.error('Erreur localisation:', error);
      setStatusMsg(`Erreur: ${error.message}`);
      Alert.alert('Erreur', 'Impossible de récupérer la position.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.debug}>{statusMsg}</Text>
        </View>
      )}

      {!loading && !location && (
        <View style={styles.center}>
          <Text style={{ marginBottom: 20 }}>Position non disponible.</Text>
          <Button title="Réessayer" onPress={getLocation} />
          <Text style={styles.debug}>{statusMsg}</Text>
        </View>
      )}

      {!loading && location && (
        <>
          <MapMobile coords={location} />
          <Text style={[styles.debug, { textAlign: 'center' }]}>
            ✔️ Lat: {location.latitude.toFixed(5)} | Lon: {location.longitude.toFixed(5)}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  debug: {
    marginTop: 10,
    color: '#555',
    fontSize: 12,
    fontStyle: 'italic',
  },
});
