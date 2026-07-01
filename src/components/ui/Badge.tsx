import { ReactNode } from "react";

type BadgeColor = "primary" | "blue" | "success" | "warning" | "error" | "neutral";

const colorClasses: Record<BadgeColor, string> = {
  primary: "border-primary/40 bg-primary/10 text-primary",
  blue: "border-blue-accent/40 bg-blue-accent/10 text-blue-accent",
  success: "border-success/40 bg-success/10 text-success",
  warning: "border-warning/40 bg-warning/10 text-warning",
  error: "border-error/40 bg-error/10 text-error",
  neutral: "border-border bg-bg-card-alt text-text-secondary",
};

export function Badge({
  color = "neutral",
  children,
  className = "",
}: {
  color?: BadgeColor;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${colorClasses[color]} ${className}`}
    >
      {children}
    </span>
  );
}
