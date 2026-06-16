import type { ReactNode } from "react";

const inputClass =
  "input-shell min-h-11 w-full rounded-xl px-4 text-sm placeholder:text-[var(--muted-soft)] disabled:opacity-50";

const selectClass =
  "input-shell min-h-11 rounded-xl px-3 text-sm disabled:opacity-50";

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
      className={`min-h-11 shrink-0 rounded-xl px-5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${toneClass}`}
    >
      {children}
    </button>
  );
}
