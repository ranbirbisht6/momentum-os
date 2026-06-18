import type { Metadata } from "next";
import { redirect } from "next/navigation";
import MomentumApp from "../momentum/MomentumApp";
import {
  createSupabaseServerClient,
  isSupabaseServerConfigured,
} from "../lib/supabase/server";

export const metadata: Metadata = {
  title: "Momentum OS App",
  description: "Momentum OS productivity workspace demo.",
};

export const dynamic = "force-dynamic";

export default async function AppPage() {
  if (!isSupabaseServerConfigured()) {
    redirect("/login?error=missing-supabase-config");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/app");
  }

  return <MomentumApp />;
}
