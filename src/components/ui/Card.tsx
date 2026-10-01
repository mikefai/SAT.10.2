import type { ReactNode } from "react";

export function Card({
  as: Tag = "section",
  className = "",
  children,
}: {
  as?: "section" | "div";
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={`rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6 ${className}`}>{children}</Tag>;
}
