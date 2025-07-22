import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    // Mapping routeName => nom d'icône Ionicons valide (type-safe)
  const iconsMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    home: 'home-outline',
    alert: 'alert-circle-outline',
    weather: 'partly-sunny-outline',
    advice: 'chatbubble-ellipses-outline',
    structures: 'medkit-outline', 
    location: 'location-outline',  
    profile: 'person-outline',
  };

  return (
    <Tabs
      screenOptions={({ route }) => {
        const iconName = iconsMap[route.name] ?? 'home-outline';
        return {
          tabBarActiveTintColor: '#e63946',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={iconName} size={size} color={color} />
          ),
        };
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Accueil' }} />
      <Tabs.Screen name="alert" options={{ title: 'Alerte' }} />
      <Tabs.Screen name="weather" options={{ title: 'Météo' }} />
      <Tabs.Screen name="advice" options={{ title: 'Conseils' }} />
      <Tabs.Screen name="map" options={{title: 'Carte',
          tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen name="location" options={{ title: 'Ma position' }} /> {/* <-- ici */}
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />

    </Tabs>
  );
}
