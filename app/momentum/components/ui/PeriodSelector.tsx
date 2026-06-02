import type { ReactNode } from "react";

export function PeriodSelector({
  label,
  children,
  onPrev,
  onNext,
  onToday,
  isToday,
}: {
  label: string;
  children: ReactNode;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  isToday: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
        {label}
      </span>
      <div className="flex items-center gap-1">
        <NavButton onClick={onPrev} aria-label="Previous">
          ‹
        </NavButton>
        <NavButton onClick={onNext} aria-label="Next">
          ›
        </NavButton>
      </div>
      {children}
      {!isToday && (
        <button
          type="button"
          onClick={onToday}
          className="text-xs font-medium text-violet-400 transition hover:text-violet-300"
        >
          Go to current
        </button>
      )}
    </div>
  );
}

function NavButton({
  children,
  onClick,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  onClick: () => void;
  "aria-label": string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-zinc-950/80 text-lg text-zinc-300 transition hover:border-white/20 hover:bg-zinc-900"
    >
      {children}
    </button>
  );
}
