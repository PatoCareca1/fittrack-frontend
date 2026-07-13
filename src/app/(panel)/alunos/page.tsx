"use client";

import { StudentList } from "@/components/panel/StudentList";
import { useAccountType } from "@/components/panel/AccountProvider";
import { students } from "@/lib/mock-data";
import { studentNoun, studentsNavLabel } from "@/lib/account";

export default function AlunosPage() {
  const accountType = useAccountType();
  const plural = studentNoun(accountType, true); // "alunos" | "pacientes"

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{studentsNavLabel(accountType)}</h1>
        <p className="text-text-secondary">
          {students.length} {plural} vinculados
        </p>
      </div>
      <StudentList students={students} />
    </div>
  );
}
