import { Suspense } from "react";
import LoginPage from "@/src/features/auth/components/LoginForm";
import { Skeleton } from "@/src/components/ui/Skeleton";

function LoginFallback() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-4">
          <Skeleton className="h-14 w-14 rounded-full mx-auto" />
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
          <Skeleton className="h-12 w-full mt-4" />
        </div>
      </div>
      <Skeleton className="hidden md:block h-full min-h-screen w-full rounded-none" />
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginPage />
    </Suspense>
  );
}
