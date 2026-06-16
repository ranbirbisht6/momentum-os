export function EmptyState({
  title,
  hint,
  icon = "+",
}: {
  title: string;
  hint: string;
  icon?: string;
}) {
  return (
    <div className="premium-card rounded-3xl px-6 py-14 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--accent-soft)] text-2xl accent-text shadow-sm">
        {icon}
      </div>
      <p className="text-lg font-semibold tracking-tight text-[var(--text)]">
        {title}
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 muted-text">
        {hint}
      </p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex flex-col items-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
      <p className="mt-4 text-sm muted-text">Loading your workspace...</p>
    </div>
  );
}

export function FilteredEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="py-12 text-center">
      <p className="font-medium muted-text">No tasks match your filters</p>
      <button
        type="button"
        onClick={onClear}
        className="mt-3 text-sm font-medium accent-text hover:underline"
      >
        Clear filters
      </button>
    </div>
  );
}
