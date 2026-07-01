import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { AdherenceBadge } from "@/components/panel/AdherenceBadge";
import { ChevronRightIcon } from "@/components/ui/icons";
import type { Student } from "@/lib/mock-data";

export function StudentList({ students }: { students: Student[] }) {
  return (
    <>
      {/* Mobile — lista de cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {students.map((student) => (
          <Link key={student.id} href={`/alunos/${student.id}`}>
            <Card className="flex items-center gap-3 p-4">
              <Avatar name={student.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-text-primary">{student.name}</p>
                <p className="text-sm text-text-secondary">
                  {student.goal} · {student.activeWorkouts} treinos ativos
                </p>
                <div className="mt-2">
                  <AdherenceBadge pct={student.adherencePct} />
                </div>
              </div>
              <ChevronRightIcon className="shrink-0 text-text-muted" />
            </Card>
          </Link>
        ))}
      </div>

      {/* Desktop — tabela */}
      <Card className="hidden overflow-hidden md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-text-secondary">
              <th className="px-5 py-3 font-medium">Aluno</th>
              <th className="px-5 py-3 font-medium">Objetivo</th>
              <th className="px-5 py-3 font-medium">Aderência</th>
              <th className="px-5 py-3 font-medium">Treinos ativos</th>
              <th className="px-5 py-3 font-medium">Última atividade</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b border-border last:border-0 hover:bg-bg-card-alt/50">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={student.name} size={32} />
                    <div>
                      <p className="font-medium text-text-primary">{student.name}</p>
                      <p className="text-xs text-text-muted">{student.level}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-text-secondary">{student.goal}</td>
                <td className="px-5 py-3.5">
                  <AdherenceBadge pct={student.adherencePct} />
                </td>
                <td className="px-5 py-3.5 text-text-secondary">{student.activeWorkouts}</td>
                <td className="px-5 py-3.5 text-text-secondary">{student.lastActivity}</td>
                <td className="px-5 py-3.5 text-right">
                  <Link href={`/alunos/${student.id}`} className="font-medium text-primary hover:brightness-110">
                    Ver perfil
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
