import type { ReactNode } from "react";

export function Surface({
  children,
  className = "",
  padding = "md",
}: {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}) {
  const pad =
    padding === "none"
      ? ""
      : padding === "sm"
        ? "p-4"
        : padding === "lg"
          ? "p-8"
          : "p-5 sm:p-6";
  return (
    <div
      className={`surface rounded-xl border ${pad} ${className}`}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 max-w-lg text-sm muted-text">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
