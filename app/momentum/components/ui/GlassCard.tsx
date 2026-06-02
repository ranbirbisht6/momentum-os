import type { ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

export function GlassPanel({
  title,
  description,
  counter,
  children,
}: {
  title: string;
  description: string;
  counter?: string;
  children: ReactNode;
}) {
  return (
    <GlassCard className="p-5 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.06] pb-5">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">{title}</h2>
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        </div>
        {counter && (
          <span className="rounded-lg border border-white/10 bg-zinc-950/60 px-3 py-1.5 text-sm font-semibold tabular-nums text-zinc-300">
            {counter}
          </span>
        )}
      </div>
      <div className="pt-5">{children}</div>
    </GlassCard>
  );
}
