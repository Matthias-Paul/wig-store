import { Suspense } from "react";
import LoginPage from "@/src/features/auth/components/LoginForm";
import { Spinner } from "@/src/components/ui/Spinner";

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
