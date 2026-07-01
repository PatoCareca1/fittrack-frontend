import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { AdherenceBadge } from "@/components/panel/AdherenceBadge";
import { Breadcrumb } from "@/components/panel/Breadcrumb";
import { ChatThread } from "@/components/panel/ChatThread";
import { EvolutionCard } from "@/components/panel/EvolutionCard";
import {
  chatThreads,
  getMealPlanByStudent,
  getStudent,
  getWorkoutByStudent,
  professional,
  sessionHistory,
} from "@/lib/mock-data";

export default async function StudentProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const student = getStudent(id);
  if (!student) notFound();

  const workout = getWorkoutByStudent(student.id);
  const mealPlan = getMealPlanByStudent(student.id);
  const sessions = sessionHistory[student.id] ?? [];
  const messages = chatThreads[student.id] ?? [];

  const tabs: TabItem[] = [
    {
      id: "evolucao",
      label: "Evolução",
      content: (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <EvolutionCard title="Peso" unit="kg" series={student.weightSeries} color="#22c55e" />
          <EvolutionCard title="% Gordura" unit="%" series={student.bodyFatSeries} color="#ef4444" />
          <EvolutionCard title="Massa magra" unit="kg" series={student.muscleMassSeries} color="#3b82f6" />
          <EvolutionCard title="Aderência" unit="%" series={student.adherenceSeries} color="#f97316" />
        </div>
      ),
    },
    {
      id: "treinos",
      label: "Treinos",
      content: workout ? (
        <Card className="flex flex-col gap-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-text-primary">
                {workout.name} · {workout.division}
              </p>
              <p className="text-sm text-text-secondary">{workout.exercises.length} exercícios</p>
            </div>
            <Link href={`/alunos/${student.id}/treinos/${workout.id}`}>
              <Button variant="secondary">Editar treino</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <EmptyState message="Nenhum treino atribuído ainda." />
      ),
    },
    {
      id: "dieta",
      label: "Dieta",
      content: mealPlan ? (
        <Card className="flex flex-col gap-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-text-primary">{mealPlan.name}</p>
              <p className="text-sm text-text-secondary">{mealPlan.meals.length} refeições no dia</p>
            </div>
            <Link href={`/alunos/${student.id}/dieta/${mealPlan.id}`}>
              <Button variant="secondary">Editar plano</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <EmptyState message="Nenhuma dieta atribuída ainda." />
      ),
    },
    {
      id: "historico",
      label: "Histórico",
      content:
        sessions.length > 0 ? (
          <div className="flex flex-col gap-3">
            {sessions.map((session) => (
              <Card key={session.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-text-primary">
                    {session.workoutName} · {session.division}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {session.date} · {session.durationMin} min
                  </p>
                </div>
                <span className="font-display font-semibold text-text-primary">{session.volumeTon}t</span>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState message="Nenhuma sessão registrada ainda." />
        ),
    },
    {
      id: "chat",
      label: "Chat",
      content: <ChatThread initialMessages={messages} />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={[{ label: "Meus Alunos", href: "/alunos" }, { label: student.name }]} />

      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={student.name} size={56} />
          <div>
            <h1 className="text-xl font-bold text-text-primary">{student.name}</h1>
            <div className="mt-1.5 flex flex-wrap gap-2">
              <Badge color="primary">{student.goal}</Badge>
              <Badge color="neutral">{student.level}</Badge>
              <Badge color="primary">{professional.credential}</Badge>
            </div>
          </div>
        </div>
        <AdherenceBadge pct={student.adherencePct} />
      </Card>

      <Tabs tabs={tabs} defaultTab={tab} />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="flex flex-col items-center gap-1 p-8 text-center">
      <p className="text-text-secondary">{message}</p>
    </Card>
  );
}
