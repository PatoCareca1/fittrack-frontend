"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/components/panel/nav-items";
import { useAccountType } from "@/components/panel/AccountProvider";
import { studentsNavLabel } from "@/lib/account";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const accountType = useAccountType();

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        // "Meus Alunos" vira "Meus Pacientes" no contexto de nutricionista.
        const displayLabel = href === "/alunos" ? studentsNavLabel(accountType) : label;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            // Accent contextual (verde/azul) aplicado via CSS var — inline para não depender
            // da geração de utilitários Tailwind a partir de um token @theme auto-referente.
            style={
              active
                ? {
                    color: "var(--color-context-accent)",
                    backgroundColor:
                      "color-mix(in oklab, var(--color-context-accent) 10%, transparent)",
                  }
                : undefined
            }
            className={`flex items-center gap-3 rounded-input px-3 py-2.5 text-sm font-medium transition ${
              active ? "" : "text-text-secondary hover:bg-bg-card-alt hover:text-text-primary"
            }`}
          >
            <Icon width={18} height={18} />
            {displayLabel}
          </Link>
        );
      })}
    </nav>
  );
}
