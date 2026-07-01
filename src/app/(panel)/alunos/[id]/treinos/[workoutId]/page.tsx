import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/panel/Breadcrumb";
import { WorkoutEditor } from "@/components/panel/WorkoutEditor";
import { getStudent, getWorkout } from "@/lib/mock-data";

export default async function WorkoutEditorPage({
  params,
}: {
  params: Promise<{ id: string; workoutId: string }>;
}) {
  const { id, workoutId } = await params;
  const student = getStudent(id);
  const workout = getWorkout(workoutId);
  if (!student || !workout || workout.studentId !== student.id) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: "Meus Alunos", href: "/alunos" },
          { label: student.name, href: `/alunos/${student.id}` },
          { label: workout.name },
        ]}
      />
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Editor de Treino</h1>
        <p className="text-text-secondary">
          Atribuído a <span className="text-text-primary">{student.name}</span>
        </p>
      </div>
      <WorkoutEditor workout={workout} />
    </div>
  );
}
