"use client";

import { DragEvent, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DragHandleIcon, PlusIcon, SearchIcon, TrashIcon } from "@/components/ui/icons";
import { exerciseLibrary, type MuscleGroup, type Workout, type WorkoutExercise } from "@/lib/mock-data";

const MUSCLE_GROUPS: (MuscleGroup | "Todos")[] = [
  "Todos",
  "Peito",
  "Costas",
  "Ombros",
  "Bíceps",
  "Tríceps",
  "Quadríceps",
  "Posteriores",
  "Panturrilhas",
  "Core",
];

let nextId = 1000;

export function WorkoutEditor({ workout }: { workout: Workout }) {
  const [name, setName] = useState(workout.name);
  const [division, setDivision] = useState(workout.division);
  const [exercises, setExercises] = useState<WorkoutExercise[]>(workout.exercises);
  const [muscleFilter, setMuscleFilter] = useState<(typeof MUSCLE_GROUPS)[number]>("Todos");
  const [query, setQuery] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const estimatedMinutes = Math.round(
    exercises.reduce((acc, ex) => acc + ex.sets * ((ex.restSec + 40) / 60), 0),
  );

  const filteredLibrary = useMemo(() => {
    return exerciseLibrary.filter((item) => {
      const matchesMuscle = muscleFilter === "Todos" || item.muscleGroup === muscleFilter;
      const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());
      return matchesMuscle && matchesQuery;
    });
  }, [muscleFilter, query]);

  function addExercise(libItem: (typeof exerciseLibrary)[number]) {
    setExercises((prev) => [
      ...prev,
      {
        id: `we-${nextId++}`,
        exerciseId: libItem.exerciseId,
        name: libItem.name,
        muscleGroup: libItem.muscleGroup,
        equipment: libItem.equipment,
        sets: 3,
        reps: "10",
        loadKg: 0,
        restSec: 60,
      },
    ]);
  }

  function removeExercise(id: string) {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  }

  function updateExercise(id: string, patch: Partial<WorkoutExercise>) {
    setExercises((prev) => prev.map((ex) => (ex.id === id ? { ...ex, ...patch } : ex)));
  }

  function moveExercise(id: string, direction: -1 | 1) {
    setExercises((prev) => {
      const index = prev.findIndex((ex) => ex.id === id);
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function handleDrop(e: DragEvent<HTMLDivElement>, targetId: string) {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;
    setExercises((prev) => {
      const next = [...prev];
      const fromIndex = next.findIndex((ex) => ex.id === draggedId);
      const toIndex = next.findIndex((ex) => ex.id === targetId);
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setDraggedId(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4 p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-text-secondary">Nome do treino</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-input border border-border bg-bg-card px-3.5 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-text-secondary">Divisão</label>
            <input
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="rounded-input border border-border bg-bg-card px-3.5 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        <div className="flex gap-6 text-sm text-text-secondary">
          <span>
            <strong className="text-text-primary">{exercises.length}</strong> exercícios
          </span>
          <span>
            <strong className="text-text-primary">{totalSets}</strong> séries
          </span>
          <span>
            ~<strong className="text-text-primary">{estimatedMinutes}</strong> minutos
          </span>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Lista de exercícios — drag & drop */}
        <div className="flex flex-col gap-3">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              draggable
              onDragStart={() => setDraggedId(exercise.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, exercise.id)}
            >
              <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <span className="hidden cursor-grab text-text-muted active:cursor-grabbing sm:block">
                  <DragHandleIcon />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-text-primary">{exercise.name}</p>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <Badge color="primary">{exercise.muscleGroup}</Badge>
                    <Badge color="neutral">{exercise.equipment}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:w-72 sm:shrink-0">
                  <LabeledNumberInput
                    label="Séries"
                    value={exercise.sets}
                    onChange={(v) => updateExercise(exercise.id, { sets: v })}
                  />
                  <LabeledTextInput
                    label="Reps"
                    value={exercise.reps}
                    onChange={(v) => updateExercise(exercise.id, { reps: v })}
                  />
                  <LabeledNumberInput
                    label="Carga (kg)"
                    value={exercise.loadKg}
                    onChange={(v) => updateExercise(exercise.id, { loadKg: v })}
                  />
                </div>
                <div className="flex shrink-0 items-center gap-1 sm:flex-col">
                  <button
                    onClick={() => moveExercise(exercise.id, -1)}
                    className="rounded-input px-2 py-1 text-text-muted hover:text-text-primary sm:hidden"
                    aria-label="Mover para cima"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveExercise(exercise.id, 1)}
                    className="rounded-input px-2 py-1 text-text-muted hover:text-text-primary sm:hidden"
                    aria-label="Mover para baixo"
                  >
                    ▼
                  </button>
                  <button
                    onClick={() => removeExercise(exercise.id)}
                    className="rounded-input p-2 text-text-muted hover:text-error"
                    aria-label="Remover exercício"
                  >
                    <TrashIcon width={16} height={16} />
                  </button>
                </div>
              </Card>
            </div>
          ))}
          {exercises.length === 0 && (
            <Card className="p-8 text-center text-text-secondary">
              Nenhum exercício ainda. Adicione pela biblioteca ao lado.
            </Card>
          )}
          <Button variant="primary" fullWidth>
            Salvar treino
          </Button>
        </div>

        {/* Biblioteca lateral filtrável */}
        <Card className="flex h-fit flex-col gap-4 p-4">
          <h2 className="font-semibold text-text-primary">Biblioteca de exercícios</h2>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              <SearchIcon width={16} height={16} />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar exercício"
              className="w-full rounded-input border border-border bg-bg-card py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MUSCLE_GROUPS.map((group) => (
              <button
                key={group}
                onClick={() => setMuscleFilter(group)}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                  muscleFilter === group
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-text-secondary hover:text-text-primary"
                }`}
              >
                {group}
              </button>
            ))}
          </div>
          <div className="flex max-h-96 flex-col gap-1.5 overflow-y-auto">
            {filteredLibrary.map((item) => (
              <button
                key={item.exerciseId}
                onClick={() => addExercise(item)}
                className="flex items-center justify-between rounded-input px-3 py-2 text-left text-sm hover:bg-bg-card-alt"
              >
                <span>
                  <span className="block text-text-primary">{item.name}</span>
                  <span className="text-xs text-text-muted">
                    {item.muscleGroup} · {item.equipment}
                  </span>
                </span>
                <PlusIcon width={16} height={16} className="shrink-0 text-primary" />
              </button>
            ))}
            {filteredLibrary.length === 0 && (
              <p className="px-3 py-4 text-sm text-text-muted">Nenhum exercício encontrado.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function LabeledNumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-text-secondary">
      {label}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-input border border-border bg-bg-card px-2 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </label>
  );
}

function LabeledTextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-text-secondary">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-input border border-border bg-bg-card px-2 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </label>
  );
}
