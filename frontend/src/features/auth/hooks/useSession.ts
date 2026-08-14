import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/src/lib/apiClient';
import { requestPushToken } from '@/src/lib/fcm';
import { useEffect } from 'react';
import { registerDeviceToken } from '../../notifications/api/notificationsApi';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage: string | null;
}

async function fetchSession(): Promise<User | null> {
  const res = await apiFetch('/auth/me');
  if (!res.ok) return null;
  return res.json();
}

export function useSession() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000, // session doesn't need re-checking every minute
  });

  useEffect(() => {
    if (user) {
      requestPushToken()
        .then((token) => {
          if (token) return registerDeviceToken(token);
        })
        .catch(() => {});
    }
  }, [user?.id, user]); // re-run only when the logged-in user actually changes
  return {
    user,
    isAuthenticated: !!user,
    isLoading,
  };
}