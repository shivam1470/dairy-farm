import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../src/store/authStore';

export default function Layout() {
  const { loadAuth } = useAuthStore();

  useEffect(() => {
    loadAuth();
  }, []);

  return <Slot />;
}
