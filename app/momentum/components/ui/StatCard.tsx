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
    <article className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 shadow-xl backdrop-blur-xl transition duration-300 hover:border-white/15 hover:bg-white/[0.06] sm:p-5">
      <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
        {label}
      </p>
      {sublabel && (
        <p className="mt-0.5 truncate text-sm text-zinc-400">{sublabel}</p>
      )}
      <p className="mt-3 text-2xl font-bold tabular-nums text-zinc-100 sm:text-3xl">
        {value}
        {subvalue && (
          <span className="text-lg font-normal text-zinc-500"> {subvalue}</span>
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
    <article className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 shadow-xl backdrop-blur-xl transition duration-300 hover:border-white/15 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            {label}
          </p>
          <p className="mt-0.5 truncate text-sm text-zinc-400">{sublabel}</p>
        </div>
        <span
          className={`rounded-lg bg-gradient-to-br ${accent} px-2.5 py-1 text-sm font-bold text-white shadow-lg ${glow}`}
        >
          {percent}%
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold tabular-nums text-zinc-100">
        {completed}
        <span className="text-lg font-normal text-zinc-500"> / {total}</span>
      </p>
      <div className="mt-3">
        <ProgressBar percent={percent} gradient={accent} />
      </div>
    </article>
  );
}
