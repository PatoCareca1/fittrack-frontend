import { describe, it, expect } from "vitest";
import { sumMacros } from "@/lib/macros";

const item = (kcal: number, protein: number, carbs: number, fat: number) => ({
  kcal,
  protein,
  carbs,
  fat,
});

describe("sumMacros", () => {
  it("soma os macros de todos os itens de todas as refeições", () => {
    const meals = [
      { items: [item(100, 10, 20, 5), item(200, 20, 10, 8)] },
      { items: [item(50, 5, 5, 2)] },
    ];
    expect(sumMacros(meals)).toEqual({ kcal: 350, protein: 35, carbs: 35, fat: 15 });
  });

  it("retorna zeros para plano vazio ou refeição sem itens", () => {
    expect(sumMacros([])).toEqual({ kcal: 0, protein: 0, carbs: 0, fat: 0 });
    expect(sumMacros([{ items: [] }])).toEqual({ kcal: 0, protein: 0, carbs: 0, fat: 0 });
  });
});
