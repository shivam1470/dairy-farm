import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

export default function Index() {
  const { user, hydrated } = useAuthStore();

  if (!hydrated) return null;

  if (user) {
    return <Redirect href="/dashboard" />;
  } else {
    return <Redirect href="/login" />;
  }
}
