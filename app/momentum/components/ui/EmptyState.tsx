export function EmptyState({
  title,
  hint,
  icon = "✦",
}: {
  title: string;
  hint: string;
  icon?: string;
}) {
  return (
    <div className="py-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 text-2xl text-violet-300/80">
        {icon}
      </div>
      <p className="text-base font-medium text-zinc-300">{title}</p>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-zinc-600">
        {hint}
      </p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex flex-col items-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500/30 border-t-violet-400" />
      <p className="mt-4 text-sm text-zinc-500">Loading your workspace…</p>
    </div>
  );
}

export function FilteredEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="py-12 text-center">
      <p className="font-medium text-zinc-400">No tasks match your filters</p>
      <button
        type="button"
        onClick={onClear}
        className="mt-3 text-sm font-medium text-violet-400 hover:text-violet-300"
      >
        Clear filters
      </button>
    </div>
  );
}
