"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { ApiError, login } from "@/lib/api";
import { storeTokens } from "@/lib/auth";
import { isAccountType, setStoredAccountType } from "@/lib/account";

const FEATURES = [
  {
    title: "Atribuição de planos",
    description: "Crie treinos e dietas e atribua aos seus alunos com um clique.",
  },
  {
    title: "Acompanhamento de aderência",
    description: "Veja quem está indo bem e quem precisa de atenção, em tempo real.",
  },
  {
    title: "Chat direto com o aluno",
    description: "Converse sem sair do painel, com histórico de treino à mão.",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const tokens = await login(email, password);
      storeTokens(tokens.access, tokens.refresh);
      // Persiste o tipo de conta quando o backend o devolver, para o painel escolher o
      // contexto Personal (verde) vs Nutricionista (azul).
      if (isAccountType(tokens.account_type)) setStoredAccountType(tokens.account_type);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full bg-surface">
      {/* Proposta de valor — oculta em telas estreitas, painel esquerdo a partir de md */}
      <section className="hidden w-1/2 flex-col justify-center gap-10 bg-gradient-to-br from-primary-dark/20 via-surface to-surface px-16 md:flex">
        <div className="flex items-center gap-3">
          <Logo size={44} />
          <span className="text-xl font-semibold text-text-primary">FitTrack Pro</span>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold leading-tight text-text-primary">
            Gerencie seus alunos em um só lugar
          </h1>
          <p className="max-w-md text-text-secondary">
            Atribua treinos e planos alimentares, acompanhe a aderência e converse com seus
            alunos — tudo em um painel feito para o profissional.
          </p>
        </div>
        <ul className="flex flex-col gap-4">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="flex items-start gap-3 rounded-card border border-border bg-bg-card/60 p-4">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <div>
                <p className="font-medium text-text-primary">{feature.title}</p>
                <p className="text-sm text-text-secondary">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Formulário — sempre visível, prioridade em mobile */}
      <section className="flex w-full flex-col justify-center px-6 py-12 sm:px-10 md:w-1/2 md:px-16">
        <div className="mx-auto flex w-full max-w-sm flex-col gap-8">
          <div className="flex flex-col items-center gap-3 md:hidden">
            <Logo size={48} />
            <span className="text-lg font-semibold text-text-primary">FitTrack Pro</span>
          </div>

          <div className="flex flex-col gap-1.5 text-center md:text-left">
            <h2 className="text-2xl font-bold text-text-primary">Bem-vindo de volta</h2>
            <p className="text-text-secondary">Entre para acompanhar seus alunos</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<MailIcon />}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<LockIcon />}
            />

            <div className="flex justify-end">
              <a href="#" className="text-sm font-medium text-primary hover:brightness-110">
                Esqueci minha senha
              </a>
            </div>

            {error && <p className="text-sm text-error">{error}</p>}

            <Button type="submit" variant="secondary" fullWidth loading={loading}>
              Entrar
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-wide text-text-muted">ou</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* Login social ainda não suportado pelo backend (README §4.5 — apenas JWT
              e-mail/senha). Renderizado para paridade visual com o protótipo, desabilitado. */}
          <button
            type="button"
            disabled
            title="Login com Google ainda não disponível"
            className="flex w-full items-center justify-center gap-2 rounded-input border border-border bg-bg-card px-4 py-2.5 text-sm font-medium text-text-secondary opacity-60"
          >
            <GoogleIcon />
            Continuar com Google
          </button>

          <p className="text-center text-sm text-text-secondary">
            Não tem uma conta?{" "}
            <a href="#" className="font-medium text-primary hover:brightness-110">
              Criar conta profissional
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
