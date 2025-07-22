import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/lib/constants';

export default function RegisterScreen() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  const handleRegister = async () => {
  if (!username || !prenom || !nom || !email || !motDePasse) {
    Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
    return;
  }

  try {
    const response = await axios.post(`${API_URL}/inscription/`, {
      username,
      email,
      password: motDePasse,
      prenom, // ✅ doit être inclus ici
      nom     // ✅ doit être inclus ici
    });

    const { tokens } = response.data;

    await AsyncStorage.setItem('accessToken', tokens.access);
    await AsyncStorage.setItem('refreshToken', tokens.refresh);

    await AsyncStorage.setItem(
      'profil',
      JSON.stringify({ username, nom, prenom })
    );

    Alert.alert('Succès', 'Compte créé avec succès');
    // router.replace('/(tabs)/home');
    router.replace('/collecte-donnees'); 

  } catch (error: any) {
    console.error('Erreur inscription :', error.response?.data || error.message);
    Alert.alert(
      'Erreur',
        error.response?.data?.detail || "Une erreur est survenue"
      );
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      <View style={styles.group}>
        <Text style={styles.label}>Nom d'utilisateur *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: fatou123"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Prénom *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Fatou"
          value={prenom}
          onChangeText={setPrenom}
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Nom *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Ndiaye"
          value={nom}
          onChangeText={setNom}
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          placeholder="exemple@mail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Mot de passe *</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          secureTextEntry
          value={motDePasse}
          onChangeText={setMotDePasse}
        />
      </View>

      <Button title="Créer mon compte" onPress={handleRegister} />

      <Text style={styles.link} onPress={() => router.replace('/login')}>
        J’ai déjà un compte
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  group: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 6,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    color: '#000',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007BFF',
    fontSize: 15,
  },
});
