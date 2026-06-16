import { ProgressBar } from "./ProgressBar";

export function StatCard({
  label,
  sublabel,
  value,
  subvalue,
  percent,
  accent,
}: {
  label: string;
  sublabel?: string;
  value: string | number;
  subvalue?: string;
  percent?: number;
  accent?: string;
}) {
  return (
    <article className="surface rounded-xl border p-4 transition duration-300 hover:border-[var(--border-strong)] sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wider soft-text">
        {label}
      </p>
      {sublabel && (
        <p className="mt-0.5 truncate text-sm muted-text">{sublabel}</p>
      )}
      <p className="mt-3 text-2xl font-semibold tabular-nums text-[var(--text)] sm:text-3xl">
        {value}
        {subvalue && (
          <span className="text-lg font-normal muted-text"> {subvalue}</span>
        )}
      </p>
      {percent !== undefined && accent && (
        <div className="mt-3">
          <ProgressBar percent={percent} gradient={accent} size="sm" />
        </div>
      )}
    </article>
  );
}

export function OverviewStatCard({
  label,
  sublabel,
  completed,
  total,
  percent,
  accent,
  glow,
}: {
  label: string;
  sublabel: string;
  completed: number;
  total: number;
  percent: number;
  accent: string;
  glow: string;
}) {
  return (
    <article className="surface rounded-xl border p-4 transition duration-300 hover:border-[var(--border-strong)] sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider soft-text">
            {label}
          </p>
          <p className="mt-0.5 truncate text-sm muted-text">{sublabel}</p>
        </div>
        <span
          className={`rounded-md bg-gradient-to-br ${accent} px-2.5 py-1 text-sm font-semibold text-white ${glow}`}
        >
          {percent}%
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold tabular-nums text-[var(--text)]">
        {completed}
        <span className="text-lg font-normal muted-text"> / {total}</span>
      </p>
      <div className="mt-3">
        <ProgressBar percent={percent} gradient={accent} />
      </div>
    </article>
  );
}
