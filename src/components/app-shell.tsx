import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, ClipboardCheck, FileUp, LayoutList, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

const navigation = [
  { to: "/estrutura", label: "Estrutura", icon: LayoutList },
  { to: "/importar", label: "Importar", icon: FileUp },
  { to: "/conferencia", label: "Conferência", icon: ClipboardCheck },
  { to: "/relatorio", label: "Relatório", icon: BarChart3 },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  void pathname;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="rf-header-gradient sticky top-0 z-40 text-white shadow-md">
        <div className="mx-auto flex h-[62px] max-w-[1560px] items-center gap-4 px-4 lg:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-4" onClick={() => setOpen(false)}>
            <span className="text-[17px] font-extrabold tracking-[3.5px] whitespace-nowrap">
              REDE<span className="font-light opacity-75">FLEX</span>
            </span>
            <span className="hidden h-[26px] w-px bg-white/30 sm:block" />
            <span className="hidden min-w-0 flex-col leading-tight sm:flex">
              <strong className="text-sm font-semibold">Dashboard de Indicadores</strong>
              <small className="text-[10.5px] uppercase tracking-wide opacity-75">
                Painel de vendas · Evolução da produtividade
              </small>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Navegação principal">
            {navigation.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 rounded-md border border-transparent px-3 py-1.5 text-[11.5px] font-semibold text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                activeProps={{ className: "bg-white/20 border-white/40 text-white" }}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
          <Button
            className="ml-auto text-white hover:bg-white/15 hover:text-white md:hidden"
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
        {open && (
          <nav className="grid gap-1 border-t border-white/20 p-3 md:hidden">
            {navigation.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-white/85"
                activeProps={{ className: "bg-white/20 text-white" }}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-[1560px] px-4 py-5 lg:px-6 lg:pb-8">{children}</main>
    </div>
  );
}