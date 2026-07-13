import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      // Foco em componentes de lógica (RNF07 — cobertura mínima 50%).
      include: ["src/lib/**", "src/components/panel/AdherenceBadge.tsx"],
      reporter: ["text", "text-summary"],
      thresholds: { lines: 50, functions: 50, statements: 50 },
    },
  },
});
