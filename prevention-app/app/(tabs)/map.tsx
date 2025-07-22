// app/(tabs)/map.tsx
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import HeatMapSenegal from '@/components/HeatMapSenegal';
import HealthMap from '@/components/HealthMap';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen() {
  const [selectedMap, setSelectedMap] = useState<'heat' | 'health'>('heat');

  const renderMap = () => {
    if (Platform.OS === 'web') {
      return <Text style={styles.unavailable}>❌ Carte non disponible sur le Web</Text>;
    }
    return selectedMap === 'heat' ? <HeatMapSenegal /> : <HealthMap />;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗺️ Carte Interactive</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedMap === 'heat' && styles.activeTab]}
          onPress={() => setSelectedMap('heat')}
        >
          <Ionicons name="flame-outline" size={18} color="#fff" style={styles.icon} />
          <Text style={styles.tabText}>Zones chaudes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, selectedMap === 'health' && styles.activeTab]}
          onPress={() => setSelectedMap('health')}
        >
          <Ionicons name="medkit-outline" size={18} color="#fff" style={styles.icon} />
          <Text style={styles.tabText}>Structures</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapWrapper}>{renderMap()}</View>

      <View style={styles.legendContainer}>
    <Text style={styles.legendTitle}>Légende :</Text>
    <View style={styles.legendItem}>
      <View style={[styles.colorBox, { backgroundColor: '#e74c3c' }]} />
      <Text style={styles.legendText}>Zone très chaude</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.colorBox, { backgroundColor: '#f39c12' }]} />
      <Text style={styles.legendText}>Zone chaude</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.colorBox, { backgroundColor: '#f1c40f' }]} />
      <Text style={styles.legendText}>Zone modérée</Text>
    </View>
    </View>

    </View>

    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f7f7' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#2c3e50' },

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#bdc3c7',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#e67e22',
  },
  tabText: {
    color: '#fff',
    fontWeight: '600',
  },
  icon: {
    marginRight: 8,
  },
  mapWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  unavailable: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 40,
  },




  legendContainer: {
  marginTop: 10,
  padding: 12,
  backgroundColor: '#fff',
  borderRadius: 10,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 2,
},
legendTitle: {
  fontWeight: 'bold',
  fontSize: 16,
  marginBottom: 8,
},
legendItem: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 6,
},
colorBox: {
  width: 20,
  height: 20,
  borderRadius: 4,
  marginRight: 10,
},
legendText: {
  fontSize: 14,
  color: '#333',
},

});
