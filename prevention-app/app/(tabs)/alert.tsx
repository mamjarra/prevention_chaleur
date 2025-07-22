// screens/AlertScreen.tsx
import { View, Text, StyleSheet, RefreshControl, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { fetchAlertes } from '@/lib/api';

export default function AlertScreen() {
  const [alertes, setAlertes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAlertes = async () => {
    try {
      const data = await fetchAlertes();
      setAlertes(data); // Liste d’alertes
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Impossible de charger les alertes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlertes();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAlertes().finally(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>Alertes Météo</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#f39c12" />
      ) : alertes.length === 0 ? (
        <Text style={styles.noAlert}>Aucune alerte en cours</Text>
      ) : (
        alertes.map((alerte, index) => (
          <View key={index} style={styles.alertBox}>
            <Text style={styles.label}>Niveau :</Text>
            <Text style={styles.value}>{alerte.niveau_alerte}</Text>

            <Text style={styles.label}>Message :</Text>
            <Text style={styles.value}>{alerte.description}</Text>

            <Text style={styles.label}>Lieu :</Text>
            <Text style={styles.value}>{alerte.lieu}</Text>

            <Text style={styles.label}>Température min/max :</Text>
            <Text style={styles.value}>
              {alerte.temperature_min}°C / {alerte.temperature_max}°C
            </Text>

            <Text style={styles.label}>Créée le :</Text>
            <Text style={styles.value}>{new Date(alerte.date_creation).toLocaleString()}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  noAlert: { fontSize: 16, color: '#777', textAlign: 'center', marginTop: 40 },
  alertBox: {
    backgroundColor: '#f39c12',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginTop: 4,
  },
});
