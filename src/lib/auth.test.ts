import { describe, it, expect, beforeEach } from "vitest";
import { clearTokens, getAccessToken, storeTokens } from "@/lib/auth";

beforeEach(() => localStorage.clear());

describe("armazenamento de tokens (auth)", () => {
  it("guarda e lê o access token", () => {
    storeTokens("acc", "ref");
    expect(getAccessToken()).toBe("acc");
  });

  it("retorna null quando não há token", () => {
    expect(getAccessToken()).toBeNull();
  });

  it("limpa os tokens no logout", () => {
    storeTokens("acc", "ref");
    clearTokens();
    expect(getAccessToken()).toBeNull();
  });
});
