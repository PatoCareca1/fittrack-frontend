import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/panel/Breadcrumb";
import { MealPlanEditor } from "@/components/panel/MealPlanEditor";
import { getMealPlan, getStudent } from "@/lib/mock-data";

export default async function MealPlanEditorPage({
  params,
}: {
  params: Promise<{ id: string; planId: string }>;
}) {
  const { id, planId } = await params;
  const student = getStudent(id);
  const plan = getMealPlan(planId);
  if (!student || !plan || plan.studentId !== student.id) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: "Meus Alunos", href: "/alunos" },
          { label: student.name, href: `/alunos/${student.id}` },
          { label: plan.name },
        ]}
      />
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Editor de Plano Alimentar</h1>
        <p className="text-text-secondary">
          Atribuído a <span className="text-text-primary">{student.name}</span>
        </p>
      </div>
      <MealPlanEditor plan={plan} />
    </div>
  );
}
