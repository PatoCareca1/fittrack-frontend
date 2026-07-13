// Cálculo de macros do plano alimentar — extraído para módulo puro (testável). RN02/RN03
// tratam a distribuição de macros no backend; aqui só somamos o que já vem por item.

export interface MacroItem {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MacroTotals {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

/** Soma os macros de todos os itens de todas as refeições. */
export function sumMacros(meals: { items: MacroItem[] }[]): MacroTotals {
  return meals
    .flatMap((meal) => meal.items)
    .reduce<MacroTotals>(
      (acc, item) => ({
        kcal: acc.kcal + item.kcal,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fat: acc.fat + item.fat,
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0 },
    );
}
