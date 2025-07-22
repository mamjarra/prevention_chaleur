import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as Linking from 'expo-linking';

export default function EmergencyScreen() {
  const emergencyNumber = '18'; // ou numéro local adapté

  const handleCall = () => {
    Alert.alert(
      'Appel d’urgence',
      `Voulez-vous appeler le ${emergencyNumber} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Appeler',
          onPress: () => {
            Linking.openURL(`tel:${emergencyNumber}`);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appel d’urgence</Text>

      <TouchableOpacity style={styles.button} onPress={handleCall}>
        <Text style={styles.buttonText}>Appeler le {emergencyNumber}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding: 20 },
  title: { fontSize: 28, marginBottom: 40, fontWeight: 'bold' },
  button: {
    backgroundColor: '#e74c3c',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
});
