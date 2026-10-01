import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const TONES = {
  trap: "border-trap-line bg-trap-soft text-trap",
  ok: "border-transparent bg-ok-soft text-ok",
  info: "border-transparent bg-accent-soft text-accent",
} as const;

export function Callout({
  tone,
  title,
  icon: Icon,
  className = "",
  children,
}: {
  tone: keyof typeof TONES;
  title?: ReactNode;
  icon?: LucideIcon;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`rounded-xl border p-4 ${TONES[tone]} ${className}`}>
      {title && (
        <p className="flex items-center gap-2 font-semibold">
          {Icon && <Icon aria-hidden="true" className="size-5 shrink-0" />}
          {title}
        </p>
      )}
      {children && <div className={title ? "mt-2 text-ink" : "text-ink"}>{children}</div>}
    </div>
  );
}
