// lib/auth.ts
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'accessToken';
import { API_URL } from './constants';
export async function getAccessToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setAccessToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearAccessToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) throw new Error('Échec du rafraîchissement');

    const data = await response.json();
    await setAccessToken(data.access);
    return data.access;
  } catch (err) {
    await clearAccessToken(); // Expulsé
    return null;
  }
}
