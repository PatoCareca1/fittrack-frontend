"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";

/**
 * Guarda de rota do painel: exige um access token para renderizar as telas autenticadas.
 * MVP client-side porque o token vive em localStorage (ver progress.md item 3 — a decisão
 * de sessão httpOnly ainda está em aberto). Enquanto valida, não renderiza o conteúdo.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (getAccessToken()) {
      setAuthorized(true);
    } else {
      router.replace("/login");
    }
  }, [router]);

  if (!authorized) return null;

  return <>{children}</>;
}
