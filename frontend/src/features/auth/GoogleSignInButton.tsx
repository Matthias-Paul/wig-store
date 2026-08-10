'use client';

import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/src/lib/firebase';
import { getGuestId, clearGuestId } from '@/src/lib/guestId';
import { apiFetch } from '@/src/lib/apiClient';
import { useDispatch } from 'react-redux';
import { Button } from '@/src/components/ui/Button';

export function GoogleSignInButton() {
  const dispatch = useDispatch();

  async function handleSignIn() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const guestId = getGuestId();

      const res = await apiFetch('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ idToken, guestId }),
      });

      if (!res.ok) throw new Error('Sign-in failed');

      const data = await res.json();
      clearGuestId(); // cart is now tied to the account, guest identity no longer needed
    } catch (error) {
      console.error('Google sign-in failed', error);
    }
  }

  return <Button variant="primary" onClick={handleSignIn}>Sign in with Google</Button>;
}