import { StudentList } from "@/components/panel/StudentList";
import { students } from "@/lib/mock-data";

export default function AlunosPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Meus Alunos</h1>
        <p className="text-text-secondary">{students.length} alunos vinculados</p>
      </div>
      <StudentList students={students} />
    </div>
  );
}
