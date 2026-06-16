import type { ReactNode } from "react";

const inputClass =
  "min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted-soft)] focus:border-[var(--accent)] disabled:opacity-50";

const selectClass =
  "min-h-11 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent)] disabled:opacity-50";

export function TextInput({
  value,
  onChange,
  placeholder,
  disabled,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`${inputClass} ${className}`}
    />
  );
}

export function SelectInput<T extends string>({
  value,
  onChange,
  options,
  disabled,
  className = "",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  disabled?: boolean;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      disabled={disabled}
      className={`${selectClass} ${className}`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function PrimaryButton({
  children,
  disabled,
  type = "button",
  onClick,
  tone = "primary",
}: {
  children: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  tone?: "primary" | "danger";
}) {
  const toneClass =
    tone === "danger"
      ? "bg-[var(--danger)] text-white hover:opacity-90"
      : "bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`min-h-11 shrink-0 rounded-lg px-5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${toneClass}`}
    >
      {children}
    </button>
  );
}
