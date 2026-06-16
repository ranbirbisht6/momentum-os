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
    <div className="py-16 text-center">
      <div className="surface-soft mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-dashed text-xl accent-text">
        {icon}
      </div>
      <p className="text-base font-medium text-[var(--text)]">{title}</p>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed muted-text">
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
