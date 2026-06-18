import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthPage } from "../components/AuthPage";

export const metadata: Metadata = {
  title: "Login - Momentum OS",
  description: "Login to Momentum OS.",
};

export default function LoginPage() {
  return (
    <Suspense>
      <AuthPage mode="login" />
    </Suspense>
  );
}
