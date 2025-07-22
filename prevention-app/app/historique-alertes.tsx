import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { fetchHistoriqueAlertes } from '@/lib/api';

export default function HistoriqueAlertesScreen() {
  const [historique, setHistorique] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistorique = async () => {
    try {
      setLoading(true);
      const data = await fetchHistoriqueAlertes();
      setHistorique(data);
    } catch (e: any) {
      Alert.alert('Erreur', e.message || 'Impossible de charger l\'historique');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistorique();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadHistorique().finally(() => setRefreshing(false));
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Text style={styles.action}>{item.action_prendre}</Text>
      <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e67e22" />
        <Text>Chargement de l'historique...</Text>
      </View>
    );
  }

  if (historique.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Aucun historique disponible.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={historique}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  item: {
    backgroundColor: '#f39c12',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  action: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  date: {
    fontSize: 14,
    color: '#fff',
    marginTop: 8,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
