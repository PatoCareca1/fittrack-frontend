import { Card } from "@/components/ui/Card";
import { LineChart } from "@/components/panel/LineChart";
import type { SeriesPoint } from "@/lib/mock-data";

export function EvolutionCard({
  title,
  unit,
  series,
  color,
}: {
  title: string;
  unit: string;
  series: SeriesPoint[];
  color: string;
}) {
  const current = series[series.length - 1]?.value ?? 0;
  const first = series[0]?.value ?? current;
  const delta = current - first;
  const arrow = delta === 0 ? "•" : delta > 0 ? "▲" : "▼";

  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-text-secondary">{title}</span>
        <span className="text-xs text-text-muted">
          {arrow} {Math.abs(delta).toFixed(1)}
          {unit}
        </span>
      </div>
      <span className="font-display text-2xl font-bold text-text-primary">
        {current.toFixed(1)}
        <span className="ml-1 text-base font-normal text-text-secondary">{unit}</span>
      </span>
      <LineChart data={series} color={color} />
    </Card>
  );
}
