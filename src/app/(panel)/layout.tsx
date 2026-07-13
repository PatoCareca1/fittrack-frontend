import { AccountProvider } from "@/components/panel/AccountProvider";
import { PanelShell } from "@/components/panel/PanelShell";
import { RequireAuth } from "@/components/panel/RequireAuth";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <AccountProvider>
        <PanelShell>{children}</PanelShell>
      </AccountProvider>
    </RequireAuth>
  );
}
