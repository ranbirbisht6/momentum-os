import type { ReactNode } from "react";

const inputClass =
  "min-h-11 w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50";

const selectClass =
  "min-h-11 rounded-xl border border-white/10 bg-zinc-950/80 px-3 text-sm text-zinc-100 outline-none transition focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50";

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
  gradient = "from-violet-600 to-fuchsia-600",
}: {
  children: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  gradient?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`min-h-11 shrink-0 rounded-xl bg-gradient-to-r ${gradient} px-5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}
