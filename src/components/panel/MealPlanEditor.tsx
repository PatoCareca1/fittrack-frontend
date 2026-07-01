"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlusIcon, SearchIcon, TrashIcon } from "@/components/ui/icons";
import { foodCatalog, type FoodItem, type Meal, type MealPlan } from "@/lib/mock-data";

let nextItemId = 1000;

function sumMacros(meals: Meal[]) {
  return meals
    .flatMap((meal) => meal.items)
    .reduce(
      (acc, item) => ({
        kcal: acc.kcal + item.kcal,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fat: acc.fat + item.fat,
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0 },
    );
}

export function MealPlanEditor({ plan }: { plan: MealPlan }) {
  const [meals, setMeals] = useState<Meal[]>(plan.meals);

  const totals = useMemo(() => sumMacros(meals), [meals]);

  function addFoodToMeal(mealId: string, food: (typeof foodCatalog)[number]) {
    const item: FoodItem = {
      id: `fi-${nextItemId++}`,
      name: food.name,
      source: food.source,
      unit: "porção",
      qty: 1,
      kcal: food.kcal,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    };
    setMeals((prev) => prev.map((meal) => (meal.id === mealId ? { ...meal, items: [...meal.items, item] } : meal)));
  }

  function removeFoodFromMeal(mealId: string, itemId: string) {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.id === mealId ? { ...meal, items: meal.items.filter((i) => i.id !== itemId) } : meal,
      ),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4 p-5">
        <span className="text-sm text-text-secondary">Total do plano</span>
        <div className="flex flex-wrap items-end gap-6">
          <span className="font-display text-3xl font-bold text-text-primary">
            {Math.round(totals.kcal)}
            <span className="ml-1 text-base font-normal text-text-secondary">kcal</span>
          </span>
          <MacroPill label="Proteína" value={totals.protein} color="text-blue-accent" />
          <MacroPill label="Carbo" value={totals.carbs} color="text-accent" />
          <MacroPill label="Gordura" value={totals.fat} color="text-error" />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {meals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onAddFood={(food) => addFoodToMeal(meal.id, food)}
            onRemoveFood={(itemId) => removeFoodFromMeal(meal.id, itemId)}
          />
        ))}
      </div>

      <Button variant="primary" fullWidth>
        Salvar plano
      </Button>
    </div>
  );
}

function MacroPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span className="text-sm text-text-secondary">
      {label} <span className={`font-display font-semibold ${color}`}>{Math.round(value)}g</span>
    </span>
  );
}

function MealCard({
  meal,
  onAddFood,
  onRemoveFood,
}: {
  meal: Meal;
  onAddFood: (food: (typeof foodCatalog)[number]) => void;
  onRemoveFood: (itemId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const mealKcal = meal.items.reduce((acc, item) => acc + item.kcal, 0);

  const results =
    query.trim().length > 0
      ? foodCatalog.filter((food) => food.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
      : [];

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-text-primary">{meal.name}</p>
          <p className="text-xs text-text-muted">{meal.time}</p>
        </div>
        <span className="font-display font-semibold text-text-primary">{mealKcal} kcal</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {meal.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-input bg-bg-card-alt px-3 py-2 text-sm">
            <span className="text-text-primary">
              {item.name}
              <span className="ml-1.5 text-xs text-text-muted">
                {item.qty}
                {item.unit}
              </span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-text-secondary">{item.kcal} kcal</span>
              <button
                onClick={() => onRemoveFood(item.id)}
                aria-label="Remover alimento"
                className="text-text-muted hover:text-error"
              >
                <TrashIcon width={14} height={14} />
              </button>
            </div>
          </div>
        ))}
        {meal.items.length === 0 && (
          <p className="rounded-input bg-bg-card-alt px-3 py-3 text-center text-sm text-text-muted">
            Nenhum alimento adicionado.
          </p>
        )}
      </div>

      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
          <SearchIcon width={15} height={15} />
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Adicionar alimento..."
          className="w-full rounded-input border border-border bg-bg-card py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        {results.length > 0 && (
          <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-input border border-border bg-bg-card shadow-lg">
            {results.map((food) => (
              <button
                key={food.id}
                onClick={() => {
                  onAddFood(food);
                  setQuery("");
                }}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-bg-card-alt"
              >
                <span className="text-text-primary">{food.name}</span>
                <PlusIcon width={14} height={14} className="shrink-0 text-primary" />
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
