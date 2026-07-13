import { describe, it, expect, vi, afterEach } from "vitest";
import { ApiError, login } from "@/lib/api";

afterEach(() => vi.unstubAllGlobals());

describe("login", () => {
  it("retorna os tokens em caso de sucesso", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => ({ access: "a", refresh: "r" }) })),
    );
    await expect(login("e@x.com", "pw")).resolves.toEqual({ access: "a", refresh: "r" });
  });

  it("lança ApiError com a mensagem do backend em caso de falha", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 401,
        json: async () => ({ detail: "Credenciais inválidas" }),
      })),
    );
    await expect(login("e@x.com", "bad")).rejects.toMatchObject({
      message: "Credenciais inválidas",
      status: 401,
    });
  });

  it("usa mensagem genérica quando o backend não detalha o erro", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 500, json: async () => ({}) })),
    );
    await expect(login("e", "p")).rejects.toBeInstanceOf(ApiError);
  });
});
