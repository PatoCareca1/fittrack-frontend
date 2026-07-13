import { describe, it, expect, beforeEach } from "vitest";
import {
  ACCOUNT_TYPE_KEY,
  DEFAULT_ACCOUNT_TYPE,
  accentHex,
  badgeColor,
  credentialPrefix,
  getAccountType,
  isAccountType,
  newStudentLabel,
  setStoredAccountType,
  studentNoun,
  studentsNavLabel,
} from "@/lib/account";

beforeEach(() => localStorage.clear());

describe("labels por tipo de conta", () => {
  it("rótulo de navegação alterna Alunos/Pacientes", () => {
    expect(studentsNavLabel("personal")).toBe("Meus Alunos");
    expect(studentsNavLabel("nutritionist")).toBe("Meus Pacientes");
  });

  it("substantivo singular e plural", () => {
    expect(studentNoun("personal")).toBe("aluno");
    expect(studentNoun("personal", true)).toBe("alunos");
    expect(studentNoun("nutritionist")).toBe("paciente");
    expect(studentNoun("nutritionist", true)).toBe("pacientes");
  });

  it("rótulo do CTA de cadastro", () => {
    expect(newStudentLabel("personal")).toBe("Novo aluno");
    expect(newStudentLabel("nutritionist")).toBe("Novo paciente");
  });

  it("cor do badge, credencial e accent hex", () => {
    expect(badgeColor("personal")).toBe("primary");
    expect(badgeColor("nutritionist")).toBe("blue");
    expect(credentialPrefix("personal")).toBe("CREF");
    expect(credentialPrefix("nutritionist")).toBe("CRN");
    expect(accentHex("personal")).toBe("#22c55e");
    expect(accentHex("nutritionist")).toBe("#3b82f6");
  });
});

describe("isAccountType", () => {
  it("valida somente os tipos conhecidos", () => {
    expect(isAccountType("personal")).toBe(true);
    expect(isAccountType("nutritionist")).toBe(true);
    expect(isAccountType("admin")).toBe(false);
    expect(isAccountType(null)).toBe(false);
    expect(isAccountType(undefined)).toBe(false);
  });
});

describe("getAccountType", () => {
  it("usa o default quando nada está salvo", () => {
    expect(getAccountType()).toBe(DEFAULT_ACCOUNT_TYPE);
    expect(DEFAULT_ACCOUNT_TYPE).toBe("personal");
  });

  it("lê o valor persistido", () => {
    setStoredAccountType("nutritionist");
    expect(localStorage.getItem(ACCOUNT_TYPE_KEY)).toBe("nutritionist");
    expect(getAccountType()).toBe("nutritionist");
  });

  it("ignora valor inválido no storage", () => {
    localStorage.setItem(ACCOUNT_TYPE_KEY, "garbage");
    expect(getAccountType()).toBe(DEFAULT_ACCOUNT_TYPE);
  });
});
