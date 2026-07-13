// Dados mockados para o painel web — Bloco de desenvolvimento sem o app "professional"
// ainda pronto no backend. Substituir por chamadas reais à API quando o endpoint existir.

export type AdherenceLevel = "otimo" | "regular" | "alerta";

export function adherenceLevel(pct: number): AdherenceLevel {
  if (pct >= 80) return "otimo";
  if (pct >= 60) return "regular";
  return "alerta";
}

export const ADHERENCE_LABEL: Record<AdherenceLevel, string> = {
  otimo: "Ótimo",
  regular: "Regular",
  alerta: "Alerta",
};

export interface Professional {
  id: string;
  name: string;
  type: "personal" | "nutritionist";
  credential: string;
}

export const professional: Professional = {
  id: "prof-1",
  name: "Rafael Souza",
  type: "personal",
  credential: "CREF 012345",
};

// Persona de nutricionista — usada para demonstrar o contexto azul (accent) enquanto o
// account_type real não vem do backend. Ver src/lib/account.ts.
export const nutritionistProfessional: Professional = {
  id: "prof-2",
  name: "Juliana Alves",
  type: "nutritionist",
  credential: "CRN 56789",
};

const PROFESSIONALS_BY_TYPE: Record<Professional["type"], Professional> = {
  personal: professional,
  nutritionist: nutritionistProfessional,
};

export function resolveProfessional(type: Professional["type"]): Professional {
  return PROFESSIONALS_BY_TYPE[type] ?? professional;
}

export interface SeriesPoint {
  date: string;
  value: number;
}

export interface Student {
  id: string;
  name: string;
  goal: string;
  level: string;
  adherencePct: number;
  activeWorkouts: number;
  lastActivity: string;
  weightSeries: SeriesPoint[];
  bodyFatSeries: SeriesPoint[];
  muscleMassSeries: SeriesPoint[];
  adherenceSeries: SeriesPoint[];
}

export const students: Student[] = [
  {
    id: "lucas-andrade",
    name: "Lucas Andrade",
    goal: "Hipertrofia",
    level: "Intermediário",
    adherencePct: 87,
    activeWorkouts: 3,
    lastActivity: "Hoje, 8:42",
    weightSeries: [
      { date: "28 mai", value: 82.0 },
      { date: "04 jun", value: 81.2 },
      { date: "11 jun", value: 80.3 },
      { date: "18 jun", value: 79.4 },
      { date: "25 jun", value: 78.5 },
    ],
    bodyFatSeries: [
      { date: "28 mai", value: 19.8 },
      { date: "04 jun", value: 19.3 },
      { date: "11 jun", value: 18.9 },
      { date: "18 jun", value: 18.4 },
      { date: "25 jun", value: 18.1 },
    ],
    muscleMassSeries: [
      { date: "28 mai", value: 62.9 },
      { date: "04 jun", value: 63.2 },
      { date: "11 jun", value: 63.5 },
      { date: "18 jun", value: 63.9 },
      { date: "25 jun", value: 64.2 },
    ],
    adherenceSeries: [
      { date: "Sem 1", value: 75 },
      { date: "Sem 2", value: 80 },
      { date: "Sem 3", value: 83 },
      { date: "Sem 4", value: 87 },
    ],
  },
  {
    id: "beatriz-lima",
    name: "Beatriz Lima",
    goal: "Emagrecimento",
    level: "Iniciante",
    adherencePct: 64,
    activeWorkouts: 2,
    lastActivity: "Ontem, 19:10",
    weightSeries: [
      { date: "28 mai", value: 71.0 },
      { date: "04 jun", value: 70.4 },
      { date: "11 jun", value: 70.1 },
      { date: "18 jun", value: 69.6 },
      { date: "25 jun", value: 69.2 },
    ],
    bodyFatSeries: [
      { date: "28 mai", value: 28.5 },
      { date: "04 jun", value: 28.0 },
      { date: "11 jun", value: 27.6 },
      { date: "18 jun", value: 27.1 },
      { date: "25 jun", value: 26.8 },
    ],
    muscleMassSeries: [
      { date: "28 mai", value: 45.1 },
      { date: "04 jun", value: 45.0 },
      { date: "11 jun", value: 45.3 },
      { date: "18 jun", value: 45.2 },
      { date: "25 jun", value: 45.4 },
    ],
    adherenceSeries: [
      { date: "Sem 1", value: 70 },
      { date: "Sem 2", value: 68 },
      { date: "Sem 3", value: 62 },
      { date: "Sem 4", value: 64 },
    ],
  },
  {
    id: "marcos-vieira",
    name: "Marcos Vieira",
    goal: "Hipertrofia",
    level: "Avançado",
    adherencePct: 52,
    activeWorkouts: 1,
    lastActivity: "há 5 dias",
    weightSeries: [
      { date: "28 mai", value: 90.2 },
      { date: "04 jun", value: 90.5 },
      { date: "11 jun", value: 90.3 },
      { date: "18 jun", value: 90.6 },
      { date: "25 jun", value: 90.4 },
    ],
    bodyFatSeries: [
      { date: "28 mai", value: 15.2 },
      { date: "04 jun", value: 15.4 },
      { date: "11 jun", value: 15.3 },
      { date: "18 jun", value: 15.6 },
      { date: "25 jun", value: 15.5 },
    ],
    muscleMassSeries: [
      { date: "28 mai", value: 74.0 },
      { date: "04 jun", value: 74.1 },
      { date: "11 jun", value: 73.9 },
      { date: "18 jun", value: 74.0 },
      { date: "25 jun", value: 73.8 },
    ],
    adherenceSeries: [
      { date: "Sem 1", value: 65 },
      { date: "Sem 2", value: 58 },
      { date: "Sem 3", value: 50 },
      { date: "Sem 4", value: 52 },
    ],
  },
  {
    id: "camila-teixeira",
    name: "Camila Teixeira",
    goal: "Saúde geral",
    level: "Intermediário",
    adherencePct: 91,
    activeWorkouts: 3,
    lastActivity: "Hoje, 6:15",
    weightSeries: [
      { date: "28 mai", value: 64.5 },
      { date: "04 jun", value: 64.2 },
      { date: "11 jun", value: 63.9 },
      { date: "18 jun", value: 63.7 },
      { date: "25 jun", value: 63.5 },
    ],
    bodyFatSeries: [
      { date: "28 mai", value: 22.1 },
      { date: "04 jun", value: 21.7 },
      { date: "11 jun", value: 21.4 },
      { date: "18 jun", value: 21.0 },
      { date: "25 jun", value: 20.6 },
    ],
    muscleMassSeries: [
      { date: "28 mai", value: 41.8 },
      { date: "04 jun", value: 42.0 },
      { date: "11 jun", value: 42.3 },
      { date: "18 jun", value: 42.5 },
      { date: "25 jun", value: 42.8 },
    ],
    adherenceSeries: [
      { date: "Sem 1", value: 85 },
      { date: "Sem 2", value: 88 },
      { date: "Sem 3", value: 90 },
      { date: "Sem 4", value: 91 },
    ],
  },
];

export function getStudent(id: string): Student | undefined {
  return students.find((s) => s.id === id);
}

// --- Treinos ---

export type MuscleGroup =
  | "Peito"
  | "Costas"
  | "Ombros"
  | "Bíceps"
  | "Tríceps"
  | "Antebraços"
  | "Core"
  | "Glúteos"
  | "Quadríceps"
  | "Posteriores"
  | "Panturrilhas"
  | "Cardio"
  | "Corpo todo";

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: string;
  sets: number;
  reps: string;
  loadKg: number;
  restSec: number;
}

export interface Workout {
  id: string;
  studentId: string;
  name: string;
  division: string;
  exercises: WorkoutExercise[];
}

export const workouts: Workout[] = [
  {
    id: "treino-a-lucas",
    studentId: "lucas-andrade",
    name: "Treino A",
    division: "Peito e Tríceps",
    exercises: [
      { id: "we-1", exerciseId: "supino-reto", name: "Supino Reto", muscleGroup: "Peito", equipment: "Barra", sets: 4, reps: "8-10", loadKg: 60, restSec: 90 },
      { id: "we-2", exerciseId: "supino-inclinado", name: "Supino Inclinado", muscleGroup: "Peito", equipment: "Halter", sets: 3, reps: "10", loadKg: 24, restSec: 75 },
      { id: "we-3", exerciseId: "crucifixo", name: "Crucifixo", muscleGroup: "Peito", equipment: "Halter", sets: 3, reps: "12", loadKg: 16, restSec: 60 },
      { id: "we-4", exerciseId: "triceps-pulley", name: "Tríceps Pulley", muscleGroup: "Tríceps", equipment: "Cabo", sets: 4, reps: "12", loadKg: 35, restSec: 60 },
      { id: "we-5", exerciseId: "triceps-corda", name: "Tríceps Corda", muscleGroup: "Tríceps", equipment: "Cabo", sets: 3, reps: "15", loadKg: 25, restSec: 45 },
    ],
  },
];

export const exerciseLibrary: Array<Omit<WorkoutExercise, "id" | "sets" | "reps" | "loadKg" | "restSec">> = [
  { exerciseId: "supino-reto", name: "Supino Reto", muscleGroup: "Peito", equipment: "Barra" },
  { exerciseId: "supino-inclinado", name: "Supino Inclinado", muscleGroup: "Peito", equipment: "Halter" },
  { exerciseId: "crucifixo", name: "Crucifixo", muscleGroup: "Peito", equipment: "Halter" },
  { exerciseId: "crossover", name: "Crossover", muscleGroup: "Peito", equipment: "Cabo" },
  { exerciseId: "puxada-frontal", name: "Puxada Frontal", muscleGroup: "Costas", equipment: "Cabo" },
  { exerciseId: "remada-curvada", name: "Remada Curvada", muscleGroup: "Costas", equipment: "Barra" },
  { exerciseId: "remada-unilateral", name: "Remada Unilateral", muscleGroup: "Costas", equipment: "Halter" },
  { exerciseId: "desenvolvimento", name: "Desenvolvimento", muscleGroup: "Ombros", equipment: "Halter" },
  { exerciseId: "elevacao-lateral", name: "Elevação Lateral", muscleGroup: "Ombros", equipment: "Halter" },
  { exerciseId: "rosca-direta", name: "Rosca Direta", muscleGroup: "Bíceps", equipment: "Barra" },
  { exerciseId: "rosca-alternada", name: "Rosca Alternada", muscleGroup: "Bíceps", equipment: "Halter" },
  { exerciseId: "triceps-pulley", name: "Tríceps Pulley", muscleGroup: "Tríceps", equipment: "Cabo" },
  { exerciseId: "triceps-corda", name: "Tríceps Corda", muscleGroup: "Tríceps", equipment: "Cabo" },
  { exerciseId: "agachamento", name: "Agachamento Livre", muscleGroup: "Quadríceps", equipment: "Barra" },
  { exerciseId: "leg-press", name: "Leg Press", muscleGroup: "Quadríceps", equipment: "Máquina" },
  { exerciseId: "cadeira-extensora", name: "Cadeira Extensora", muscleGroup: "Quadríceps", equipment: "Máquina" },
  { exerciseId: "stiff", name: "Stiff", muscleGroup: "Posteriores", equipment: "Barra" },
  { exerciseId: "mesa-flexora", name: "Mesa Flexora", muscleGroup: "Posteriores", equipment: "Máquina" },
  { exerciseId: "elevacao-panturrilha", name: "Elevação de Panturrilha", muscleGroup: "Panturrilhas", equipment: "Máquina" },
  { exerciseId: "prancha", name: "Prancha", muscleGroup: "Core", equipment: "Peso corporal" },
  { exerciseId: "abdominal-supra", name: "Abdominal Supra", muscleGroup: "Core", equipment: "Peso corporal" },
];

export function getWorkout(id: string): Workout | undefined {
  return workouts.find((w) => w.id === id);
}

export function getWorkoutByStudent(studentId: string): Workout | undefined {
  return workouts.find((w) => w.studentId === studentId);
}

// --- Histórico de sessões ---

export interface WorkoutSession {
  id: string;
  workoutName: string;
  division: string;
  date: string;
  durationMin: number;
  volumeTon: number;
}

export const sessionHistory: Record<string, WorkoutSession[]> = {
  "lucas-andrade": [
    { id: "s1", workoutName: "Treino A", division: "Peito e Tríceps", date: "Hoje", durationMin: 52, volumeTon: 4.2 },
    { id: "s2", workoutName: "Treino C", division: "Pernas e Ombro", date: "Ontem", durationMin: 58, volumeTon: 6.1 },
    { id: "s3", workoutName: "Treino B", division: "Costas e Bíceps", date: "23 jun", durationMin: 49, volumeTon: 5.0 },
    { id: "s4", workoutName: "Treino A", division: "Peito e Tríceps", date: "21 jun", durationMin: 51, volumeTon: 4.0 },
  ],
  "beatriz-lima": [
    { id: "s1", workoutName: "Treino A", division: "Corpo todo", date: "Ontem", durationMin: 40, volumeTon: 2.1 },
    { id: "s2", workoutName: "Treino A", division: "Corpo todo", date: "18 jun", durationMin: 38, volumeTon: 2.0 },
  ],
  "marcos-vieira": [
    { id: "s1", workoutName: "Treino B", division: "Costas e Bíceps", date: "há 5 dias", durationMin: 55, volumeTon: 7.4 },
  ],
  "camila-teixeira": [
    { id: "s1", workoutName: "Treino A", division: "Corpo todo", date: "Hoje", durationMin: 45, volumeTon: 3.1 },
    { id: "s2", workoutName: "Treino B", division: "Cardio e Core", date: "23 jun", durationMin: 35, volumeTon: 0.8 },
  ],
};

// --- Dieta ---

export interface FoodMacros {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodItem extends FoodMacros {
  id: string;
  name: string;
  source: "TACO" | "OFF";
  unit: string;
  qty: number;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  items: FoodItem[];
}

export interface MealPlan {
  id: string;
  studentId: string;
  name: string;
  meals: Meal[];
}

export const mealPlans: MealPlan[] = [
  {
    id: "plano-lucas",
    studentId: "lucas-andrade",
    name: "Plano Hipertrofia 12sem",
    meals: [
      {
        id: "cafe-manha",
        name: "Café da manhã",
        time: "7:30",
        items: [
          { id: "fi-1", name: "Ovos mexidos", source: "TACO", unit: "g", qty: 120, kcal: 186, protein: 15, carbs: 1, fat: 13 },
          { id: "fi-2", name: "Pão integral", source: "TACO", unit: "g", qty: 60, kcal: 148, protein: 6, carbs: 26, fat: 2 },
        ],
      },
      {
        id: "almoco",
        name: "Almoço",
        time: "12:30",
        items: [
          { id: "fi-3", name: "Arroz branco cozido", source: "TACO", unit: "g", qty: 150, kcal: 193, protein: 4, carbs: 42, fat: 0 },
          { id: "fi-4", name: "Frango grelhado", source: "TACO", unit: "g", qty: 120, kcal: 198, protein: 37, carbs: 0, fat: 4 },
          { id: "fi-5", name: "Feijão preto", source: "TACO", unit: "g", qty: 100, kcal: 132, protein: 9, carbs: 24, fat: 1 },
          { id: "fi-6", name: "Salada verde", source: "TACO", unit: "g", qty: 80, kcal: 24, protein: 1, carbs: 4, fat: 0 },
        ],
      },
      {
        id: "lanche",
        name: "Lanche",
        time: "16:00",
        items: [
          { id: "fi-7", name: "Whey protein", source: "OFF", unit: "g", qty: 30, kcal: 120, protein: 24, carbs: 3, fat: 1 },
          { id: "fi-8", name: "Banana", source: "TACO", unit: "un", qty: 1, kcal: 89, protein: 1, carbs: 23, fat: 0 },
        ],
      },
      {
        id: "jantar",
        name: "Jantar",
        time: "20:00",
        items: [
          { id: "fi-9", name: "Batata doce", source: "TACO", unit: "g", qty: 150, kcal: 129, protein: 2, carbs: 30, fat: 0 },
          { id: "fi-10", name: "Tilápia", source: "TACO", unit: "g", qty: 120, kcal: 128, protein: 26, carbs: 0, fat: 2 },
          { id: "fi-11", name: "Brócolis", source: "TACO", unit: "g", qty: 80, kcal: 27, protein: 3, carbs: 5, fat: 0 },
        ],
      },
    ],
  },
];

export function getMealPlan(id: string): MealPlan | undefined {
  return mealPlans.find((p) => p.id === id);
}

export function getMealPlanByStudent(studentId: string): MealPlan | undefined {
  return mealPlans.find((p) => p.studentId === studentId);
}

export const foodCatalog: Array<{ id: string; name: string; source: "TACO" | "OFF" } & FoodMacros> = [
  { id: "f-frango-grelhado", name: "Frango grelhado (100g)", source: "TACO", kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: "f-peito-frango-cru", name: "Peito de frango cru (100g)", source: "TACO", kcal: 159, protein: 32, carbs: 0, fat: 2.5 },
  { id: "f-frango-passarinho", name: "Frango à passarinho (100g)", source: "OFF", kcal: 220, protein: 27, carbs: 2, fat: 11 },
  { id: "f-arroz-branco", name: "Arroz branco cozido (100g)", source: "TACO", kcal: 128, protein: 2.5, carbs: 28, fat: 0.2 },
  { id: "f-feijao-preto", name: "Feijão preto cozido (100g)", source: "TACO", kcal: 132, protein: 8.9, carbs: 24, fat: 0.5 },
  { id: "f-batata-doce", name: "Batata doce cozida (100g)", source: "TACO", kcal: 86, protein: 1.3, carbs: 20, fat: 0.1 },
  { id: "f-tilapia", name: "Tilápia grelhada (100g)", source: "TACO", kcal: 107, protein: 22, carbs: 0, fat: 1.7 },
  { id: "f-ovo", name: "Ovo cozido (unidade)", source: "TACO", kcal: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
  { id: "f-whey", name: "Whey protein (30g)", source: "OFF", kcal: 120, protein: 24, carbs: 3, fat: 1 },
  { id: "f-banana", name: "Banana prata (unidade)", source: "TACO", kcal: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { id: "f-brocolis", name: "Brócolis cozido (100g)", source: "TACO", kcal: 34, protein: 3.6, carbs: 6.6, fat: 0.4 },
  { id: "f-pao-integral", name: "Pão integral (fatia)", source: "TACO", kcal: 74, protein: 3, carbs: 13, fat: 1 },
];

// --- Chat ---

export interface ChatMessage {
  id: string;
  from: "professional" | "student";
  text: string;
  time: string;
}

export const chatThreads: Record<string, ChatMessage[]> = {
  "lucas-andrade": [
    { id: "m1", from: "professional", text: "Fala Lucas! Como foi o treino A de hoje?", time: "8:30" },
    { id: "m2", from: "student", text: "Foi pesado! Consegui subir a carga no supino pra 62kg.", time: "8:42" },
    { id: "m3", from: "professional", text: "Boa! Tua progressão tá ótima. Semana que vem a gente aumenta o volume de tríceps.", time: "8:44" },
    { id: "m4", from: "student", text: "Fechou. Valeu, Rafa!", time: "8:45" },
  ],
  "beatriz-lima": [
    { id: "m1", from: "student", text: "Rafael, posso trocar o treino de hoje pra amanhã? Bateu uma reunião.", time: "17:02" },
    { id: "m2", from: "professional", text: "Pode sim, sem problema. Só não pula duas vezes seguidas 🙂", time: "17:10" },
  ],
  "marcos-vieira": [
    { id: "m1", from: "professional", text: "Marcos, notei que você não registra treino há 5 dias. Tudo certo?", time: "há 2 dias" },
  ],
  "camila-teixeira": [
    { id: "m1", from: "student", text: "Consegui bater todas as metas da semana!", time: "6:20" },
    { id: "m2", from: "professional", text: "Excelente, Camila! Vou revisar seu plano pra próxima fase.", time: "7:05" },
  ],
};
