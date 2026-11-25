// app/login/page.tsx
import type { Metadata } from "next";
import { LoginForm } from '@/components/login-form';

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to manage Cedar Ridge Ward meeting programs.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm">
        <h1>Sign In</h1>
        <LoginForm />
      </div>
    </main>
  );
}
