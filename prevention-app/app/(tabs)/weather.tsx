import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import * as Location from 'expo-location';
import { fetchDonneesMeteo, fetchAndStoreCurrentWeather } from '@/lib/api';

export default function WeatherScreen() {
  const [zones, setZones] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<any | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [locationInfo, setLocationInfo] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    detectLocation();
  }, []);

  const loadData = async () => {
  try {
    const donnees = await fetchDonneesMeteo();

    // Supprimer les doublons par lieu (en gardant la plus récente)
    const uniqueByLieu = new Map(); // clé: lieu, valeur: objet météo

    for (const d of donnees) {
      if (!uniqueByLieu.has(d.lieu)) {
        uniqueByLieu.set(d.lieu, d); // Premier trouvé pour ce lieu
      }
    }

    const enriched = Array.from(uniqueByLieu.values()).map((d: any) => {
      let risque = 'Très inconfortable';
      if (d.temperature_max >= 40) risque = 'Très dangereux';
      else if (d.temperature_max >= 36) risque = 'Dangereux';

      return {
        nom: d.lieu,
        tempMaxJour: d.temperature_max,
        tempMaxNuit: d.temperature_min,
        risque,
      };
    });

    setZones(enriched);
      if (enriched.length > 0) setSelectedZone(enriched[0]);
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erreur', e.message || 'Impossible de charger les données météo.');
    } finally {
      setLoadingData(false);
    }
  };

  const detectLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({});
      setLocationInfo(`${loc.coords.latitude.toFixed(3)}°, ${loc.coords.longitude.toFixed(3)}°`);
    } catch (e) {
      setLocationInfo(null);
    }
  };

  const handleUpdateWeather = async () => {
  if (!selectedZone) return;

  setLoadingData(true);

  try {
    await fetchAndStoreCurrentWeather(selectedZone.nom);
    
    // Recharger les données sans perdre la sélection actuelle
    const previousZone = selectedZone.nom;

    const donnees = await fetchDonneesMeteo();

    // Supprimer les doublons
    const uniqueByLieu = new Map();
    for (const d of donnees) {
      if (!uniqueByLieu.has(d.lieu)) uniqueByLieu.set(d.lieu, d);
    }

    const enriched = Array.from(uniqueByLieu.values()).map((d: any) => {
      let risque = 'Très inconfortable';
      if (d.temperature_max >= 40) risque = 'Très dangereux';
      else if (d.temperature_max >= 36) risque = 'Dangereux';

      return {
        nom: d.lieu,
        tempMaxJour: d.temperature_max,
        tempMaxNuit: d.temperature_min,
        risque,
      };
    });

    setZones(enriched);

    // Réassigner la même zone sélectionnée
    const matched = enriched.find((z) => z.nom === previousZone);
    if (matched) setSelectedZone(matched);
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erreur', e.message || 'Impossible de mettre à jour la météo.');
    } finally {
      setLoadingData(false);
    }
  };


  


  const getGradientColors = (): readonly [string, string] => {
    switch (selectedZone?.risque) {
      case 'Très dangereux': return ['#e52d27', '#b31217'] as const;
      case 'Dangereux': return ['#f2994a', '#f2c94c'] as const;
      case 'Très inconfortable': return ['#fceabb', '#f8b500'] as const;
      default: return ['#95a5a6', '#7f8c8d'] as const;
    }
  };

  

  const getWeatherIcon = () => {
    switch (selectedZone?.risque) {
      case 'Très dangereux': return 'flame-outline';
      case 'Dangereux': return 'partly-sunny-outline';
      case 'Très inconfortable': return 'sunny-outline';
      default: return 'help-outline';
    }
  };

  if (loadingData) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#ff4500" />
        <Text style={{ marginTop: 10, color: '#333' }}>Chargement des données météo...</Text>
      </View>
    );
  }

  if (!selectedZone) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ marginTop: 10, color: '#333' }}>Aucune donnée météo disponible.</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={getGradientColors()} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>🌤️ Météo Santé - {selectedZone.nom}</Text>

        <View style={styles.summaryBox}>
          <Ionicons name={getWeatherIcon()} size={32} color="#fff" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.summaryText}>Température max : {selectedZone.tempMaxJour}°C</Text>
            <Text style={styles.summaryText}>Risque : {selectedZone.risque}</Text>
          </View>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedZone.nom}
            onValueChange={(itemValue: string) => {
              const zone = zones.find(z => z.nom === itemValue);
              if (zone) setSelectedZone(zone);
            }}
            dropdownIconColor="#fff"
            style={styles.picker}
          >
            {zones.map((zone) => (
              <Picker.Item key={zone.nom} label={zone.nom} value={zone.nom} />
            ))}
          </Picker>
        </View>

        {locationInfo && (
          <Text style={styles.locationText}>Position : {locationInfo}</Text>
        )}

        <View style={styles.card}>
          <Ionicons name={getWeatherIcon()} size={48} color="#fff" style={{ marginBottom: 10 }} />
          <View style={styles.row}>
            <Text style={styles.label}>Temp. max Jour :</Text>
            <Text style={styles.value}>{selectedZone.tempMaxJour}°C</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Temp. max Nuit :</Text>
            <Text style={styles.value}>{selectedZone.tempMaxNuit}°C</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Risque :</Text>
            <Text style={[styles.value, { fontWeight: 'bold' }]}>{selectedZone.risque}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={handleUpdateWeather}>
          <Text style={styles.refreshButtonText}>Actualiser météo ({selectedZone.nom})</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    marginBottom: 24,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  picker: {
    color: '#fff',
    height: 50,
    fontSize: 16,
  },
  summaryBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryText: {
    color: '#fff',
    fontSize: 16,
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 28,
    borderRadius: 24,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 8,
  },
  label: {
    fontSize: 18,
    color: '#eee',
  },
  value: {
    fontSize: 18,
    color: '#fff',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  locationText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#ff7043',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 18,
    alignSelf: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
