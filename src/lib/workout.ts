// Lógica de reordenação e estimativa do Editor de Treino — extraída para módulo puro
// (testável). A UI (WorkoutEditor) só liga estado e drag & drop nativo a estas funções.

/** Descanso médio de setup entre séries (s), somado ao restSec no cálculo de duração. */
const SETUP_SECONDS_PER_SET = 40;

/** Move um exercício uma posição para cima (-1) ou para baixo (1). Imutável; no-op nas bordas. */
export function moveExercise<T extends { id: string }>(
  list: T[],
  id: string,
  direction: -1 | 1,
): T[] {
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) return list;
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

/** Reordena via drag & drop: remove o item arrastado e o insere na posição do alvo. */
export function reorderByDrag<T extends { id: string }>(
  list: T[],
  draggedId: string,
  targetId: string,
): T[] {
  if (draggedId === targetId) return list;
  const from = list.findIndex((item) => item.id === draggedId);
  const to = list.findIndex((item) => item.id === targetId);
  if (from === -1 || to === -1) return list;
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

/** Total de séries planejadas no treino. */
export function totalSets(exercises: { sets: number }[]): number {
  return exercises.reduce((acc, ex) => acc + ex.sets, 0);
}

/** Duração estimada do treino em minutos (séries × (descanso + setup)). */
export function estimateMinutes(exercises: { sets: number; restSec: number }[]): number {
  return Math.round(
    exercises.reduce((acc, ex) => acc + ex.sets * ((ex.restSec + SETUP_SECONDS_PER_SET) / 60), 0),
  );
}
