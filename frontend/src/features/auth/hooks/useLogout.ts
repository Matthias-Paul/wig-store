
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signOut } from 'firebase/auth';
import { apiFetch } from '@/src/lib/apiClient';
import { auth } from '@/src/lib/firebase';
import { toast } from 'sonner';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await apiFetch('/auth/logout', { method: 'POST' });
      if (!res.ok) throw new Error('Logout failed');
      await signOut(auth).catch(() => {});
    },
    onSuccess: () => {
      queryClient.setQueryData(['session'], null);
      queryClient.clear(); // wipe everything cached — cart, orders, notifications, all tied to the now-logged-out user
      toast.info("Logged out successfully");
      window.location.href = "/";

    },
  });
}