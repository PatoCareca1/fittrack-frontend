import { describe, it, expect } from "vitest";
import { estimateMinutes, moveExercise, reorderByDrag, totalSets } from "@/lib/workout";

const ex = (id: string, sets = 3, restSec = 60) => ({ id, sets, restSec });
const ids = (list: { id: string }[]) => list.map((x) => x.id);

describe("moveExercise", () => {
  const list = [ex("a"), ex("b"), ex("c")];

  it("move para baixo", () => expect(ids(moveExercise(list, "a", 1))).toEqual(["b", "a", "c"]));
  it("move para cima", () => expect(ids(moveExercise(list, "c", -1))).toEqual(["a", "c", "b"]));
  it("no-op no topo", () => expect(moveExercise(list, "a", -1)).toBe(list));
  it("no-op na base", () => expect(moveExercise(list, "c", 1)).toBe(list));
  it("no-op para id inexistente", () => expect(moveExercise(list, "z", 1)).toBe(list));
});

describe("reorderByDrag", () => {
  const list = [ex("a"), ex("b"), ex("c"), ex("d")];

  it("insere o arrastado na posição do alvo (para baixo)", () =>
    expect(ids(reorderByDrag(list, "a", "c"))).toEqual(["b", "c", "a", "d"]));
  it("insere o arrastado na posição do alvo (para cima)", () =>
    expect(ids(reorderByDrag(list, "d", "b"))).toEqual(["a", "d", "b", "c"]));
  it("no-op quando arrastado === alvo", () => expect(reorderByDrag(list, "a", "a")).toBe(list));
  it("no-op para alvo inexistente", () => expect(reorderByDrag(list, "a", "z")).toBe(list));
});

describe("totalSets e estimateMinutes", () => {
  it("soma as séries", () => expect(totalSets([ex("a", 3), ex("b", 4)])).toBe(7));
  it("estima a duração em minutos", () => {
    // 3*((60+40)/60) + 4*((90+40)/60) = 5 + 8.6667 = 13.6667 → 14
    expect(estimateMinutes([ex("a", 3, 60), ex("b", 4, 90)])).toBe(14);
  });
  it("retorna zero para lista vazia", () => {
    expect(totalSets([])).toBe(0);
    expect(estimateMinutes([])).toBe(0);
  });
});
