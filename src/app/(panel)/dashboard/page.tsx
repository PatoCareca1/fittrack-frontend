import { MetricCard } from "@/components/panel/MetricCard";
import { StudentList } from "@/components/panel/StudentList";
import { ChatIcon, GridIcon, PeopleIcon, ReportIcon } from "@/components/ui/icons";
import { chatThreads, professional, students } from "@/lib/mock-data";

export default function DashboardPage() {
  const activeWorkoutsTotal = students.reduce((acc, s) => acc + s.activeWorkouts, 0);
  const avgAdherence = Math.round(
    students.reduce((acc, s) => acc + s.adherencePct, 0) / students.length,
  );
  const unreadThreads = Object.values(chatThreads).filter(
    (messages) => messages[messages.length - 1]?.from === "student",
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Olá, {professional.name.split(" ")[0]}</h1>
        <p className="text-text-secondary">Resumo dos seus alunos hoje</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Alunos ativos" value={students.length} icon={<PeopleIcon width={18} height={18} />} />
        <MetricCard label="Treinos ativos" value={activeWorkoutsTotal} icon={<GridIcon width={18} height={18} />} />
        <MetricCard
          label="Aderência média"
          value={`${avgAdherence}%`}
          hint="Últimas 4 semanas"
          icon={<ReportIcon width={18} height={18} />}
        />
        <MetricCard label="Mensagens não lidas" value={unreadThreads} icon={<ChatIcon width={18} height={18} />} />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-text-primary">Seus alunos</h2>
        <StudentList students={students} />
      </div>
    </div>
  );
}
