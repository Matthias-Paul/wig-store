'use client';

import { useSession } from '@/src/features/auth/hooks/useSession';
import { useGoogleSignIn } from '@/src/features/auth/hooks/useGoogleSignIn';
import { useLogout } from '@/src/features/auth/hooks/useLogout';
import { Button } from '@/src/components/ui/Button';
import { Avatar } from '@/src/components/ui/Avatar';
import { Spinner } from '@/src/components/ui/Spinner';

export function AuthStatus() {
  const { user, isAuthenticated, isLoading } = useSession();
  const signIn = useGoogleSignIn();
  const logout = useLogout();

  if (isLoading) return <Spinner size="sm" />;

  if (!isAuthenticated) {
    return (
      <Button onClick={() => signIn.mutate()} disabled={signIn.isPending}>
        {signIn.isPending ? 'Signing in...' : 'Sign in with Google'}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar src={user!.profileImage} name={user!.name} size="sm" />
      <Button variant="outline" onClick={() => logout.mutate()}>
        Log out
      </Button>
    </div>
  );
}