"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  getSupabaseBrowserClient,
  getSupabaseConfigStatus,
} from "../lib/supabase/client";

const missingConfigMessage =
  "Supabase is not configured yet. Add the project URL and anon key to continue.";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const searchParams = useSearchParams();
  const configStatus = getSupabaseConfigStatus();
  const isConfigured = configStatus.hasUrl && configStatus.hasAnonKey;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [message, setMessage] = useState(isConfigured ? "" : missingConfigMessage);

  const redirectTo = useMemo(() => {
    const requested = searchParams.get("redirectTo");
    return requested?.startsWith("/") ? requested : "/app";
  }, [searchParams]);

  useEffect(() => {
    if (!isConfigured) return;
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/app");
    });
  }, [isConfigured, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    let supabase;
    try {
      supabase = getSupabaseBrowserClient();
    } catch {
      setStatus("idle");
      setMessage(missingConfigMessage);
      return;
    }

    const credentials = {
      email: email.trim(),
      password,
    };

    const { data, error } = isSignup
      ? await supabase.auth.signUp(credentials)
      : await supabase.auth.signInWithPassword(credentials);

    if (error) {
      setStatus("idle");
      setMessage(error.message);
      return;
    }

    if (data.session) {
      setStatus("success");
      router.replace(redirectTo);
      router.refresh();
      return;
    }

    setStatus("success");
    setMessage(
      isSignup
        ? "Account created. Check your email if confirmation is enabled, then log in."
        : "Login complete. Redirecting...",
    );
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#151513] px-5 py-12 text-[#f6f1e8]">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30 sm:p-8">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[#7fb58f] text-sm font-bold text-[#121411]">
            M
          </span>
          <span className="text-sm font-semibold tracking-tight">Momentum OS</span>
        </Link>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a3d1ad]">
            {isSignup ? "Create account" : "Welcome back"}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {isSignup ? "Start building momentum." : "Log in to Momentum OS."}
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/58">
            {isSignup
              ? "Create your workspace with email and password."
              : "Continue to your Momentum OS workspace."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            autoComplete="email"
            required
            className="min-h-12 w-full rounded-2xl border border-white/10 bg-[#11140f] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#7fb58f]"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            minLength={6}
            required
            className="min-h-12 w-full rounded-2xl border border-white/10 bg-[#11140f] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#7fb58f]"
          />
          {message && (
            <p
              className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${
                status === "success"
                  ? "border-[#7fb58f]/30 bg-[#7fb58f]/10 text-[#cde8d3]"
                  : "border-[#e27d72]/30 bg-[#e27d72]/10 text-[#f2b0a8]"
              }`}
            >
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#7fb58f] px-5 text-sm font-semibold text-[#11140f] transition hover:bg-[#a3d1ad] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "Please wait..." : isSignup ? "Create account" : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          {isSignup ? "Already have an account?" : "New to Momentum?"}{" "}
          <Link href={isSignup ? "/login" : "/signup"} className="font-semibold text-[#a3d1ad]">
            {isSignup ? "Login" : "Create account"}
          </Link>
        </p>
      </section>
    </main>
  );
}
