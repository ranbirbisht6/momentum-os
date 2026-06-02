import type { ChartPoint } from "../../types";

export function BarChart({
  data,
  gradient = "from-violet-500 to-fuchsia-500",
}: {
  data: ChartPoint[];
  gradient?: string;
}) {
  const max = Math.max(100, ...data.map((d) => d.percent));

  return (
    <div className="flex h-48 items-end justify-between gap-2 sm:gap-3">
      {data.map((point) => (
        <div
          key={point.label}
          className="flex min-w-0 flex-1 flex-col items-center gap-2"
        >
          <span className="text-[0.65rem] font-semibold tabular-nums text-zinc-400 sm:text-xs">
            {point.percent}%
          </span>
          <div className="flex w-full flex-1 items-end justify-center">
            <div
              className={`w-full max-w-10 rounded-t-lg bg-gradient-to-t ${gradient} transition-all duration-700 ease-out`}
              style={{
                height: `${Math.max(4, (point.percent / max) * 100)}%`,
                minHeight: point.total > 0 ? "8px" : "4px",
              }}
              title={`${point.completed}/${point.total}`}
            />
          </div>
          <span className="truncate text-[0.6rem] text-zinc-500 sm:text-xs">
            {point.label}
          </span>
        </div>
      ))}
    </div>
  );
}
