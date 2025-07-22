import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as jwt_decode from 'jwt-decode';
import { API_URL } from '@/lib/constants';
import { jwtDecode } from 'jwt-decode';

type JwtPayload = {
  username: string;
  // ajoute d’autres champs si besoin
};

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !motDePasse) {
      Alert.alert('Champs requis', 'Veuillez renseigner tous les champs');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: motDePasse,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || 'Échec de la connexion');
      }

      // Stocker accessToken et refreshToken (qui sont des strings)
      await SecureStore.setItemAsync('accessToken', data.access);
      await SecureStore.setItemAsync('refreshToken', data.refresh);

      // Extraire username depuis le token JWT si non fourni explicitement
      let userNameToStore = username.trim();

      try {
        const decoded = jwtDecode<JwtPayload>(data.access);
        if (decoded?.username) {
          userNameToStore = decoded.username;
        }
      } catch (e) {
        // Si erreur décodage, on garde username initial
      }

      await SecureStore.setItemAsync('username', userNameToStore);

      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Erreur de connexion', error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Connexion</Text>

        <TextInput
          style={styles.input}
          placeholder="Nom d'utilisateur"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={motDePasse}
          onChangeText={setMotDePasse}
          secureTextEntry
        />

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} />
        ) : (
          <Button title="Se connecter" onPress={handleLogin} />
        )}

        <Text style={styles.link} onPress={() => router.replace('/')}>
          ← Retour à l’accueil
        </Text>
        <Text style={[styles.link, { marginTop: 10 }]} onPress={() => router.push('/register')}>
          Pas encore de compte ? S’inscrire
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    color: '#000',
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
    color: '#007AFF',
    fontSize: 15,
  },
});
