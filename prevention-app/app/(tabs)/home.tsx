import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function HomeScreen() {
  const router = useRouter();

  const [niveauVigilance, setNiveauVigilance] = useState<
    'Très inconfortable' | 'Dangereux' | 'Très dangereux'
  >('Dangereux');

  const getAlertColor = () => {
    switch (niveauVigilance) {
      case 'Très inconfortable': return '#f1c40f';
      case 'Dangereux': return '#e67e22';
      case 'Très dangereux': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getWeatherIcon = () => {
    switch (niveauVigilance) {
      case 'Très inconfortable': return 'sunny-outline';
      case 'Dangereux': return 'partly-sunny-outline';
      case 'Très dangereux': return 'flame-outline';
      default: return 'warning-outline';
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/bg-weather.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Karangue</Text>

        <BlurView intensity={60} tint="dark" style={[styles.alertBox, { borderColor: getAlertColor() }]}>
          <Ionicons name={getWeatherIcon()} size={48} color={getAlertColor()} style={{ marginBottom: 10 }} />
          <Text style={styles.alertTitle}>Niveau de vigilance</Text>
          <Text style={[styles.alertLevel, { color: getAlertColor() }]}>{niveauVigilance}</Text>
        </BlurView>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#3498db' }]}
            onPress={() => router.push('/(tabs)/advice')}
          >
            <Ionicons name="chatbubbles-outline" size={22} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Conseils</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#c0392b' }]}
            onPress={() => router.push('/emergency')}
          >
            <Ionicons name="call-outline" size={22} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Urgence</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 36,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 5,
  },
  alertBox: {
    padding: 26,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 50,
    borderWidth: 2,
    width: '100%',
    maxWidth: 330,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  alertTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 6,
  },
  alertLevel: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
