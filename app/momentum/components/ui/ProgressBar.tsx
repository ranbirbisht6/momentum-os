export function ProgressBar({
  percent,
  gradient = "from-violet-500 to-fuchsia-500",
  size = "md",
}: {
  percent: number;
  gradient?: string;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-1.5" : "h-2.5";
  return (
    <div className={`overflow-hidden rounded-full bg-zinc-800/80 ${h}`}>
      <div
        className={`${h} rounded-full bg-gradient-to-r ${gradient} transition-all duration-700 ease-out`}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}

export function ProgressBlock({
  label,
  percent,
  completed,
  total,
  gradient,
}: {
  label: string;
  percent: number;
  completed: number;
  total: number;
  gradient: string;
}) {
  return (
    <div className="mt-5 rounded-xl border border-white/[0.06] bg-zinc-950/40 p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-400">{label}</span>
        <span className="font-bold tabular-nums text-zinc-200">{percent}%</span>
      </div>
      <ProgressBar percent={percent} gradient={gradient} />
      <p className="mt-2 text-xs text-zinc-600">
        {completed} of {total} completed
      </p>
    </div>
  );
}
