import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/src/lib/apiClient';

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
    queryKey: ['session'],
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000, // session doesn't need re-checking every minute
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
  };
}