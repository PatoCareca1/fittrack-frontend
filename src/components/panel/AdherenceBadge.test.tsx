import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { AdherenceBadge } from "@/components/panel/AdherenceBadge";

describe("AdherenceBadge", () => {
  it("renderiza a porcentagem e o rótulo Ótimo", () => {
    const { container } = render(<AdherenceBadge pct={88} />);
    expect(container.textContent).toContain("88%");
    expect(container.textContent).toContain("Ótimo");
  });

  it("mostra Alerta para aderência baixa", () => {
    const { container } = render(<AdherenceBadge pct={40} />);
    expect(container.textContent).toContain("40%");
    expect(container.textContent).toContain("Alerta");
  });
});
