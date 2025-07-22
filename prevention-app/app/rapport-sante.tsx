import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { fetchRapportsSante } from '@/lib/api';

export default function RapportSanteScreen() {
  const [rapports, setRapports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRapports = async () => {
    try {
      const data = await fetchRapportsSante();
      setRapports(data);
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Impossible de charger les rapports santé');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRapports();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadRapports().finally(() => setRefreshing(false));
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.label}>Utilisateur :</Text>
      <Text style={styles.value}>{item.utilisateur.username}</Text>

      <Text style={styles.label}>Symptômes :</Text>
      <Text style={styles.value}>{item.symptomes}</Text>

      <Text style={styles.label}>Conditions environnementales :</Text>
      <Text style={styles.value}>{item.conditions_environnementales}</Text>

      <Text style={styles.label}>Signalé le :</Text>
      <Text style={styles.value}>{new Date(item.heure_signalement).toLocaleString()}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text>Chargement des rapports santé...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={rapports}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={<Text style={styles.empty}>Aucun rapport santé disponible.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f0f4f7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontWeight: 'bold',
    color: '#34495e',
    marginTop: 6,
  },
  value: {
    color: '#7f8c8d',
    marginTop: 2,
  },
  empty: {
    marginTop: 40,
    textAlign: 'center',
    color: '#95a5a6',
    fontSize: 16,
  },
});
