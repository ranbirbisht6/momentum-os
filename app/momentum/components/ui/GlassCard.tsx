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
      className={`surface rounded-xl border ${className}`}
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
      <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-5" style={{ borderColor: "var(--border)" }}>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text)]">{title}</h2>
          <p className="mt-1 text-sm muted-text">{description}</p>
        </div>
        {counter && (
          <span className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-sm font-semibold tabular-nums text-[var(--text)]">
            {counter}
          </span>
        )}
      </div>
      <div className="pt-5">{children}</div>
    </GlassCard>
  );
}
