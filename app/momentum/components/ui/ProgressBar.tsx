export function ProgressBar({
  percent,
  gradient,
  size = "md",
}: {
  percent: number;
  gradient?: string;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-1.5" : "h-2.5";
  return (
    <div className={`overflow-hidden rounded-full bg-[var(--surface-soft)] ${h}`}>
      <div
        className={`${h} rounded-full transition-all duration-700 ease-out ${gradient ? `bg-gradient-to-r ${gradient}` : "bg-[var(--accent)]"}`}
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
    <div className="surface-soft mt-5 rounded-xl border p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium muted-text">{label}</span>
        <span className="font-semibold tabular-nums text-[var(--text)]">{percent}%</span>
      </div>
      <ProgressBar percent={percent} gradient={gradient} />
      <p className="mt-2 text-xs soft-text">
        {completed} of {total} completed
      </p>
    </div>
  );
}
