import Link from "next/link";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
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
            Authentication is not connected yet. This page is ready for the future auth flow.
          </p>
        </div>

        <form className="mt-8 space-y-3">
          <input
            type="email"
            placeholder="Email address"
            className="min-h-12 w-full rounded-2xl border border-white/10 bg-[#11140f] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#7fb58f]"
          />
          <input
            type="password"
            placeholder="Password"
            className="min-h-12 w-full rounded-2xl border border-white/10 bg-[#11140f] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#7fb58f]"
          />
          <Link
            href="/app"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#7fb58f] px-5 text-sm font-semibold text-[#11140f] transition hover:bg-[#a3d1ad]"
          >
            {isSignup ? "Continue to demo" : "Continue"}
          </Link>
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
