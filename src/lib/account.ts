// Contexto de conta profissional — diferencia Personal Trainer (accent verde) de
// Nutricionista (accent azul), conforme README seção 6.6. Módulo puro (sem React) para
// ser facilmente testável; a camada de UI consome via AccountProvider.

import { professional } from "@/lib/mock-data";

export type AccountType = "personal" | "nutritionist";

/** Chave usada para persistir o tipo de conta enquanto o endpoint /me/ não é consumido. */
export const ACCOUNT_TYPE_KEY = "fittrack_account_type";

export function isAccountType(value: unknown): value is AccountType {
  return value === "personal" || value === "nutritionist";
}

/**
 * Default enquanto o backend `professional` / `/me/` não estão plugados: vem da persona
 * mockada. Esta função é o único ponto a trocar quando a API real informar o account_type.
 */
export const DEFAULT_ACCOUNT_TYPE: AccountType = professional.type;

export function getAccountType(): AccountType {
  if (typeof window === "undefined") return DEFAULT_ACCOUNT_TYPE;
  const stored = window.localStorage.getItem(ACCOUNT_TYPE_KEY);
  return isAccountType(stored) ? stored : DEFAULT_ACCOUNT_TYPE;
}

export function setStoredAccountType(type: AccountType): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCOUNT_TYPE_KEY, type);
}

// --- Derivações puras (rótulos e cores por contexto) --------------------------------

export function studentsNavLabel(type: AccountType): string {
  return type === "nutritionist" ? "Meus Pacientes" : "Meus Alunos";
}

export function studentNoun(type: AccountType, plural = false): string {
  const base = type === "nutritionist" ? "paciente" : "aluno";
  return plural ? `${base}s` : base;
}

export function newStudentLabel(type: AccountType): string {
  return `Novo ${studentNoun(type)}`;
}

/** Cor do Badge (mapeia para os tokens do design system) por tipo de profissional. */
export function badgeColor(type: AccountType): "primary" | "blue" {
  return type === "nutritionist" ? "blue" : "primary";
}

export function credentialPrefix(type: AccountType): "CREF" | "CRN" {
  return type === "nutritionist" ? "CRN" : "CREF";
}

/** Hex do accent contextual — Personal verde (#22C55E), Nutricionista azul (#3B82F6). */
export function accentHex(type: AccountType): string {
  return type === "nutritionist" ? "#3b82f6" : "#22c55e";
}
