// lib/api.ts
import { API_URL } from './constants';
import { getAccessToken } from './auth';
import {refreshAccessToken, clearAccessToken } from './auth';

export async function postData(endpoint: string, data: any, useAuth = false) {
  const headers: any = { 'Content-Type': 'application/json' };

  if (useAuth) {
    const token = await getAccessToken();
    if (!token) throw new Error('Token manquant');
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMsg = 'Erreur réseau ou API';
    try {
      const errorData = await response.json();
      if (errorData.detail) errorMsg = errorData.detail;
      else if (typeof errorData === 'string') errorMsg = errorData;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}


export async function fetchDonneesMeteo() {
  let token = await getAccessToken();
  if (!token) throw new Error('Token manquant');

  let response = await fetch(`${API_URL}/donnees-meteo/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    // Token expiré, on tente de le rafraîchir
    token = await refreshAccessToken();
    if (!token) throw new Error('Session expirée. Veuillez vous reconnecter.');

    response = await fetch(`${API_URL}/donnees-meteo/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  if (!response.ok) {
    let errorMsg = 'Erreur API données météo';
    try {
      const errorData = await response.json();
      if (errorData.detail) errorMsg = errorData.detail;
    } catch {}
    throw new Error(errorMsg);
  }

  return await response.json();
}



export async function fetchAndStoreCurrentWeather(lieu: string) {
  const token = await getAccessToken();
  if (!token) throw new Error('Token manquant');

  const response = await fetch(`${API_URL}/weather/current/?lieu=${encodeURIComponent(lieu)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const msg = errorData?.detail || 'Erreur lors de la récupération météo';
    throw new Error(msg);
  }

  return response.json();
}


// lib/api.ts
export async function fetchWithToken(url: string, token: string) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Erreur lors du chargement des données');
  }

  return res.json();
}

// lib/api.ts
export async function fetchAlertes() {
  const token = await getAccessToken();
  if (!token) throw new Error('Token manquant');

  const res = await fetch(`${API_URL}/alarmes/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    if (res.status === 401) await clearAccessToken();
    throw new Error('Erreur lors du chargement des alertes');
  }

  return res.json();
}

export async function fetchHistoriqueAlertes() {
  const token = await getAccessToken();
  if (!token) throw new Error('Token manquant');

  const res = await fetch(`${API_URL}/historique-alertes/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    if (res.status === 401) await clearAccessToken();
    throw new Error('Erreur lors du chargement de l’historique');
  }

  return res.json();
}

export async function fetchRapportsSante() {
  const token = await getAccessToken();
  if (!token) throw new Error('Token manquant');

  const res = await fetch(`${API_URL}/rapports-sante/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    if (res.status === 401) await clearAccessToken();
    throw new Error('Erreur lors du chargement des rapports santé');
  }

  return res.json();
}

export async function postRapportSante(data: {
  symptomes: string;
  conditions_environnementales: string;
}) {
  return postData('/rapports-sante/', data, true);
}

export async function fetchConseilsSante() {
  const token = await getAccessToken();
  if (!token) throw new Error('Token manquant');

  const res = await fetch(`${API_URL}/conseils-sante/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    if (res.status === 401) await clearAccessToken();
    throw new Error('Erreur lors du chargement des conseils santé');
  }

  return res.json();
}
