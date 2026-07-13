import { describe, it, expect } from "vitest";
import {
  ADHERENCE_LABEL,
  adherenceLevel,
  nutritionistProfessional,
  professional,
  resolveProfessional,
} from "@/lib/mock-data";

describe("adherenceLevel", () => {
  it("classifica pelos limiares (≥80 ótimo, 60–79 regular, <60 alerta)", () => {
    expect(adherenceLevel(100)).toBe("otimo");
    expect(adherenceLevel(80)).toBe("otimo");
    expect(adherenceLevel(79)).toBe("regular");
    expect(adherenceLevel(60)).toBe("regular");
    expect(adherenceLevel(59)).toBe("alerta");
    expect(adherenceLevel(0)).toBe("alerta");
  });

  it("mapeia para os rótulos pt-BR", () => {
    expect(ADHERENCE_LABEL[adherenceLevel(85)]).toBe("Ótimo");
    expect(ADHERENCE_LABEL[adherenceLevel(70)]).toBe("Regular");
    expect(ADHERENCE_LABEL[adherenceLevel(50)]).toBe("Alerta");
  });
});

describe("resolveProfessional", () => {
  it("retorna a persona conforme o tipo", () => {
    expect(resolveProfessional("personal")).toBe(professional);
    expect(resolveProfessional("nutritionist")).toBe(nutritionistProfessional);
  });
});
