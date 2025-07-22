import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#fdfbfb', '#ebedee']} style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Bienvenue sur</Text>
        <Text style={styles.brand}>Karange</Text>
        <Text style={styles.subtitle}>Protégez votre santé face aux vagues de chaleur</Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#3498db' }]}
          onPress={() => router.push('/login')}
        >
          <Ionicons name="log-in-outline" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#27ae60' }]}
          onPress={() => router.push('/register')}
        >
          <Ionicons name="person-add-outline" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: '#333',
  },
  brand: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
