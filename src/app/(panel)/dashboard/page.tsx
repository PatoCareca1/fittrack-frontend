"use client";

import { MetricCard } from "@/components/panel/MetricCard";
import { StudentList } from "@/components/panel/StudentList";
import { useAccountType } from "@/components/panel/AccountProvider";
import { ChatIcon, GridIcon, PeopleIcon, ReportIcon } from "@/components/ui/icons";
import { chatThreads, resolveProfessional, students } from "@/lib/mock-data";
import { studentNoun } from "@/lib/account";

export default function DashboardPage() {
  const accountType = useAccountType();
  const person = resolveProfessional(accountType);
  const plural = studentNoun(accountType, true); // "alunos" | "pacientes"
  const pluralTitle = plural.charAt(0).toUpperCase() + plural.slice(1);

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
        <h1 className="text-2xl font-bold text-text-primary">Olá, {person.name.split(" ")[0]}</h1>
        <p className="text-text-secondary">Resumo dos seus {plural} hoje</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label={`${pluralTitle} ativos`} value={students.length} icon={<PeopleIcon width={18} height={18} />} />
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
        <h2 className="text-lg font-semibold text-text-primary">Seus {plural}</h2>
        <StudentList students={students} />
      </div>
    </div>
  );
}
