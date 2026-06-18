import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthPage } from "../components/AuthPage";

export const metadata: Metadata = {
  title: "Create Account - Momentum OS",
  description: "Create your Momentum OS account.",
};

export default function SignupPage() {
  return (
    <Suspense>
      <AuthPage mode="signup" />
    </Suspense>
  );
}
