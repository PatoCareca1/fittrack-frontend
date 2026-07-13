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
            className={`flex items-center gap-3 rounded-input px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-context-accent/10 text-context-accent"
                : "text-text-secondary hover:bg-bg-card-alt hover:text-text-primary"
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
