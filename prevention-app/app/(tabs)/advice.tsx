import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons'; // Assure-toi d'avoir expo vector icons

const conseils = [
  { id: '1', texte: "💧 Buvez beaucoup d'eau." },
  { id: '2', texte: "🌞 Évitez l'exposition directe au soleil." },
  { id: '3', texte: "👕 Portez des vêtements légers." },
  { id: '4', texte: "🌴 Restez à l'ombre autant que possible." },
];

export default function AdviceScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handlePlayAudio = (id: string) => {
    Alert.alert('Audio', `Lecture audio du conseil ${id} (fonctionnalité à venir)`);
  };

  const renderItem = ({ item }: { item: typeof conseils[0] }) => {
    const isSelected = item.id === selectedId;

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => setSelectedId(item.id)}
        onLongPress={() => handlePlayAudio(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <Text style={[styles.cardText, isSelected && styles.cardTextSelected]}>
            {item.texte}
          </Text>
          <Ionicons
            name="volume-high-outline"
            size={24}
            color={isSelected ? '#fff' : '#3498db'}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🩺 Conseils Santé & Chaleur</Text>
      <FlatList
        data={conseils}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        showsVerticalScrollIndicator={false}
      />
      <Text style={styles.info}>(Appui long = Lecture audio du conseil)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef6f9',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 18,
    marginVertical: 10,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  cardSelected: {
    backgroundColor: '#3498db',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  cardTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  info: {
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
    color: '#555',
  },
});
