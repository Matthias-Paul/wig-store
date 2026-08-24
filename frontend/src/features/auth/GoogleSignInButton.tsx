"use client";

import { useGoogleSignIn } from "@/src/features/auth/hooks/useGoogleSignIn";
import { Button } from "@/src/components/ui/Button";
import { GoogleIcon } from "@/src/components/ui/icons/GoogleIcon";

export function GoogleSignInButton() {
  const { startGoogleSignIn, isPending } = useGoogleSignIn();

  return (
    <Button
      variant="primary"
      size="sm"
      icon={<GoogleIcon size={16} />}
      onClick={() => startGoogleSignIn()}
      disabled={isPending}
    >
      {isPending ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
}
