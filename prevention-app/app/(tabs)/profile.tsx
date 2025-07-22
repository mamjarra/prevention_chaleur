import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '@/lib/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function ProfileScreen() {
  const router = useRouter();
  const [profil, setProfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  // Fonction pour récupérer profil
  const fetchProfil = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) throw new Error('Token manquant');

      const decoded: any = jwtDecode(token);
      setUsername(decoded.username);
      setUserId(decoded.user_id);

      const response = await axios.get(`${API_URL}/profils/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const monProfil = response.data.find(
        (item: any) => item.utilisateur === decoded.user_id
      );

      if (!monProfil) {
        // Profil vide par défaut si pas trouvé
        setProfil({
          est_age: false,
          est_enceinte: false,
          est_enfant: false,
          a_maladie_chronique: false,
          utilisateur: decoded.user_id,
        });
      } else {
        setProfil(monProfil);
      }
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de récupérer le profil');
    } finally {
      setLoading(false);
    }
  };

  // Rafraîchir profil à chaque fois que l'écran est focus
  useFocusEffect(
    React.useCallback(() => {
      fetchProfil();
    }, [])
  );

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('username');
    router.replace('/login');
  };

  // Gérer la mise à jour du switch Maladie chronique (exemple)
  const handleToggleMaladieChronique = async (value: boolean) => {
    if (!userId) return;
    setProfil((prev: any) => ({ ...prev, a_maladie_chronique: value }));
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) throw new Error('Token manquant');

      if (!profil.id) {
        Alert.alert('Erreur', 'Profil introuvable pour mise à jour');
        return;
      }

      await axios.patch(
        `${API_URL}/profils/${profil.id}/`,
        { a_maladie_chronique: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      Alert.alert('Erreur', 'Impossible de mettre à jour la donnée');
      // Remettre la valeur précédente en cas d'erreur
      setProfil((prev: any) => ({ ...prev, a_maladie_chronique: !value }));
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={['#6dd5ed', '#2193b0']} style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Chargement du profil...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#00c6ff', '#0072ff']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Ionicons name="person-circle-outline" size={80} color="#fff" style={{ marginBottom: 16 }} />
        <Text style={styles.title}>Bienvenue, {username}</Text>

        {(!profil ||
          (!profil.est_age &&
            !profil.est_enceinte &&
            !profil.est_enfant &&
            !profil.a_maladie_chronique)) && (
          <View style={styles.collecteBox}>
            <Text style={styles.collecteText}>
              Pour recevoir des conseils de santé personnalisés, complétez votre profil.
            </Text>
            <TouchableOpacity
              style={styles.collecteButton}
              onPress={() => router.push('/collecte-donnees')}
            >
              <Text style={styles.collecteButtonText}>Compléter mon profil</Text>
            </TouchableOpacity>
          </View>
        )}

        {profil && (
          <View style={styles.infoCard}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Femme enceinte</Text>
              <Switch value={profil.est_enceinte} disabled />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Enfant</Text>
              <Switch value={profil.est_enfant} disabled />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Âgé (60+)</Text>
              <Switch value={profil.est_age} disabled />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Maladie chronique</Text>
              <Switch
                value={profil.a_maladie_chronique}
                onValueChange={handleToggleMaladieChronique}
              />
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={() => router.push('/rapport-sante')}>
          <Text style={styles.buttonText}>📊 Voir mon rapport santé</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/historique-alertes')}>
          <Text style={styles.buttonText}>Voir historique-alertes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    width: '100%',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    paddingBottom: 6,
  },
  label: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#E63946',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 18,
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#4B5563',
    fontSize: 16,
  },
  collecteBox: {
    backgroundColor: '#FFF3CD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFEEBA',
    width: '100%',
  },
  collecteText: {
    color: '#856404',
    fontSize: 15,
    marginBottom: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  collecteButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  collecteButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#e357d5ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
