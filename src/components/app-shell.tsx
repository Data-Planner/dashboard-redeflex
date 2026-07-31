import { Link, useRouterState, type LinkProps } from "@tanstack/react-router";
import { type ReactNode } from "react";

const areas = [
  { to: "/", label: "Relatórios", ico: "▣", match: (path: string) => !path.startsWith("/admin") },
  { to: "/admin/calendario", label: "Painel Administrativo", ico: "⚙", match: (path: string) => path.startsWith("/admin") },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="rf-header-gradient sticky top-0 z-40 text-white shadow-md print:hidden">
        <div className="mx-auto flex min-h-[62px] max-w-[1560px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 lg:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-4">
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
          <nav className="ml-auto flex items-center gap-1" aria-label="Áreas">
            {areas.map((area) => (
              <Link
                key={area.to}
                to={area.to}
                className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-[11.5px] font-semibold transition-colors ${
                  area.match(pathname)
                    ? "border-white/40 bg-white/20 text-white"
                    : "border-transparent text-white/80 hover:bg-white/15 hover:text-white"
                }`}
              >
                <span aria-hidden>{area.ico}</span>
                {area.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[1560px] px-4 py-5 lg:px-6 lg:pb-8">{children}</main>
    </div>
  );
}

export function SubNav({ items }: { items: ReadonlyArray<{ to: LinkProps["to"]; label: string; ico: string }> }) {
  return (
    <nav className="mb-6 -mx-4 flex flex-wrap gap-1 border-b bg-card px-4 py-2 shadow-sm lg:-mx-6 lg:px-6 print:hidden" aria-label="Cadastros">
      {items.map((item) => (
        <Link
          key={String(item.to)}
          to={item.to}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-[11.5px] font-semibold text-muted-foreground transition-colors hover:bg-muted"
          activeProps={{ className: "bg-primary/10 text-primary" }}
        >
          <span aria-hidden>{item.ico}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
