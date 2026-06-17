import type { Metadata } from "next";
import { AuthPage } from "../components/AuthPage";

export const metadata: Metadata = {
  title: "Login - Momentum OS",
  description: "Login to Momentum OS.",
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
