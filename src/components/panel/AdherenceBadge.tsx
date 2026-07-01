import { Badge } from "@/components/ui/Badge";
import { ADHERENCE_LABEL, adherenceLevel } from "@/lib/mock-data";

const COLOR_BY_LEVEL = {
  otimo: "success",
  regular: "warning",
  alerta: "error",
} as const;

export function AdherenceBadge({ pct }: { pct: number }) {
  const level = adherenceLevel(pct);
  return (
    <Badge color={COLOR_BY_LEVEL[level]}>
      {pct}% · {ADHERENCE_LABEL[level]}
    </Badge>
  );
}
