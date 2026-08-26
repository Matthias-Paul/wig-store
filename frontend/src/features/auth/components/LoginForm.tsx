"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useSession } from "@/src/features/auth/hooks/useSession";
import { useGoogleSignIn } from "@/src/features/auth/hooks/useGoogleSignIn";
import { Button } from "@/src/components/ui/Button";
import { GoogleIcon } from "@/src/components/ui/icons/GoogleIcon";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const { isAuthenticated, isLoading } = useSession();
  const { triggerSignIn, isPending } = useGoogleSignIn();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirect);
    }
  }, [isLoading, isAuthenticated, redirect, router]);

  function handleSignIn() {
    triggerSignIn(redirect);
  }

  const LOGO_URL =
    "https://res.cloudinary.com/drkxtuaeg/image/upload/v1787745248/jflicf1ob69wl42freyd.jpg";

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left — sign-in card */}
      <div className="flex flex-col bg-gold-tint items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <div className="h-14 w-14 rounded-full bg-brand-tint flex items-center justify-center">
              <Image
                src={LOGO_URL}
                alt="Rockshairmpire"
                width={50}
                height={50}
                className="rounded-full"
              />{" "}
            </div>
          </div>

          <h1 className="font-heading text-2xl text-center text-gray-900">
            Welcome to Rockshairmpire
          </h1>
          <p className="text-gray-500 text-sm text-center mt-2">
            Signing up is easy — just one click with your Google account, no
            forms, no passwords to remember.
          </p>

          <Button
            variant="outline"
            size="lg"
            icon={<GoogleIcon />}
            onClick={handleSignIn}
            disabled={isPending}
            className="w-full mt-8"
          >
            {isPending ? "Signing in..." : "Continue with Google"}
          </Button>

          <p className="text-gray-400 text-xs text-center mt-8 leading-relaxed">
            By continuing, you agree to Rockshairmpire's{" "}
            <a href="/terms" className="underline hover:text-gray-600">
              Terms of Service
            </a>{" "}
            {/* and{" "}
            <a href="/privacy" className="underline hover:text-gray-600">
              Privacy Policy
            </a>
            . */}
          </p>
        </div>
      </div>

      {/* Right — image, desktop only */}
      <div className="hidden md:block relative">
        <Image
          src="/images/hero.png"
          alt="Rockshairmpire hair collection"
          fill
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="font-heading text-2xl leading-snug">
            "Quality hair that feels like your own."
          </p>
          <p className="text-white/80 text-sm mt-2">— Rockshairmpire</p>
        </div>
      </div>
    </div>
  );
}
