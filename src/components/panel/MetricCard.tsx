import { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

export function MetricCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-2 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary">{label}</span>
        {icon && <span className="text-primary">{icon}</span>}
      </div>
      <span className="font-display text-3xl font-bold text-text-primary">{value}</span>
      {hint && <span className="text-xs text-text-muted">{hint}</span>}
    </Card>
  );
}
