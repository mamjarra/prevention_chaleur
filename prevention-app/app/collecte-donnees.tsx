// app/collecte-donnees.tsx
import { useState, useEffect } from 'react';
import { View, Text, Switch, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '@/lib/constants';
import { router, useRouter } from 'expo-router';
export default function CollecteDonneesScreen() {
  const [profil, setProfil] = useState({
    est_age: false,
    est_enceinte: false,
    a_maladie_chronique: false,
    est_enfant: false,
  });

  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.user_id);
      }
    };
    getUserId();
  }, []);

  const handleSubmit = async () => {
  try {
    const token = await SecureStore.getItemAsync('accessToken');
    if (!token || !userId) return;

    // Si le profil existe, faire PATCH (update), sinon POST (create)
    // Pour simplifier ici on fait POST (à adapter selon ton backend)

    await axios.post(`${API_URL}/profils/`, {
      utilisateur: userId,
      ...profil
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    Alert.alert('Succès', 'Données enregistrées', [
      { text: 'OK', onPress: () => router.replace('/profile') } // Redirection vers profil
    ]);
  } catch (error: any) {
    Alert.alert('Erreur', error.message || 'Échec de l’enregistrement');
  }
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complétez votre profil santé</Text>
      <View style={styles.switchRow}>
        <Text>Femme enceinte</Text>
        <Switch value={profil.est_enceinte} onValueChange={(val) => setProfil({ ...profil, est_enceinte: val })} />
      </View>
      <View style={styles.switchRow}>
        <Text>Enfant</Text>
        <Switch value={profil.est_enfant} onValueChange={(val) => setProfil({ ...profil, est_enfant: val })} />
      </View>
      <View style={styles.switchRow}>
        <Text>Âgé (60+)</Text>
        <Switch value={profil.est_age} onValueChange={(val) => setProfil({ ...profil, est_age: val })} />
      </View>
      <View style={styles.switchRow}>
        <Text>Maladie chronique</Text>
        <Switch value={profil.a_maladie_chronique} onValueChange={(val) => setProfil({ ...profil, a_maladie_chronique: val })} />
      </View>
      <Button title="Enregistrer" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
});
