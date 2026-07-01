"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Logo } from "@/components/ui/Logo";
import { CloseIcon, LogoutIcon, MenuIcon } from "@/components/ui/icons";
import { SidebarNav } from "@/components/panel/SidebarNav";
import { professional } from "@/lib/mock-data";
import { clearTokens } from "@/lib/auth";

function ProfessionalFooter() {
  const router = useRouter();

  function handleLogout() {
    clearTokens();
    router.push("/login");
  }

  return (
    <div className="flex items-center gap-3 border-t border-border px-3 py-4">
      <Avatar name={professional.name} size={36} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-primary">{professional.name}</p>
        <Badge color="primary" className="mt-0.5">
          {professional.credential}
        </Badge>
      </div>
      <button
        onClick={handleLogout}
        aria-label="Sair"
        className="text-text-muted hover:text-error"
      >
        <LogoutIcon width={18} height={18} />
      </button>
    </div>
  );
}

export function PanelShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar fixa — desktop */}
      <aside className="hidden w-[200px] shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="flex items-center gap-2 px-4 py-5">
          <Logo size={32} />
          <span className="text-sm font-semibold text-text-primary">FitTrack Pro</span>
        </div>
        <div className="flex-1 px-2">
          <SidebarNav />
        </div>
        <ProfessionalFooter />
      </aside>

      {/* Drawer — mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-surface">
            <div className="flex items-center justify-between px-4 py-5">
              <div className="flex items-center gap-2">
                <Logo size={32} />
                <span className="text-sm font-semibold text-text-primary">FitTrack Pro</span>
              </div>
              <button onClick={() => setDrawerOpen(false)} aria-label="Fechar menu" className="text-text-muted">
                <CloseIcon width={20} height={20} />
              </button>
            </div>
            <div className="flex-1 px-2">
              <SidebarNav onNavigate={() => setDrawerOpen(false)} />
            </div>
            <ProfessionalFooter />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar — mobile */}
        <header className="flex items-center gap-3 border-b border-border px-4 py-3 md:hidden">
          <button onClick={() => setDrawerOpen(true)} aria-label="Abrir menu" className="text-text-secondary">
            <MenuIcon width={22} height={22} />
          </button>
          <div className="flex items-center gap-2">
            <Logo size={26} />
            <span className="text-sm font-semibold text-text-primary">FitTrack Pro</span>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 md:px-10 md:py-8">{children}</main>
      </div>
    </div>
  );
}
