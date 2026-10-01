import type { ButtonHTMLAttributes } from "react";

type Props = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const VARIANTS = {
  primary: "bg-accent-solid text-on-accent hover:opacity-90",
  secondary: "border border-line bg-surface hover:bg-surface-2",
  ghost: "text-muted hover:bg-surface-2",
} as const;

export function Button({ variant = "primary", size = "md", className = "", type = "button", ...rest }: Props) {
  const sizing = size === "lg" ? "min-h-12 px-6 text-lg" : "min-h-11 px-4";
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${sizing} ${VARIANTS[variant]} ${className}`}
      {...rest}
    />
  );
}
