import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../src/store/authStore';

export default function Layout() {
  const { loadAuth, hydrated } = useAuthStore();

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return <Slot />;
}
