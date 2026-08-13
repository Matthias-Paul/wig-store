import { Suspense } from "react";
import LoginPage from "@/src/features/auth/components/LoginForm";

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
