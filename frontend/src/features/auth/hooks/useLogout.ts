
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/src/lib/apiClient';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await apiFetch('/auth/logout', { method: 'POST' });
      if (!res.ok) throw new Error('Logout failed');
    },
    onSuccess: () => {
      queryClient.setQueryData(['session'], null);
      queryClient.clear(); // wipe everything cached — cart, orders, notifications, all tied to the now-logged-out user
    },
  });
}