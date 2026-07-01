import { Card } from "@/components/ui/Card";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
      <Card className="flex flex-col items-center gap-2 p-10 text-center">
        <p className="font-medium text-text-primary">Em construção</p>
        <p className="text-text-secondary">{description}</p>
      </Card>
    </div>
  );
}
