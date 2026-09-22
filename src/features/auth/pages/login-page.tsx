import { Suspense } from "react";
import { LoginForm } from "../components/login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-lg mx-auto h-96 animate-pulse bg-card/50 rounded-3xl" />}>
      <LoginForm />
    </Suspense>
  );
}

