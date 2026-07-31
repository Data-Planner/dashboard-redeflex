import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RedeFlex · Dashboard Indicadores" },
      {
        name: "description",
        content:
          "Painel de vendas e evolução da produtividade da RedeFlex: metas, ativações, críticos e atingimento DDD.",
      },
      { property: "og:title", content: "RedeFlex · Dashboard Indicadores" },
      {
        property: "og:description",
        content:
          "Painel de vendas e evolução da produtividade da RedeFlex: metas, ativações, críticos e atingimento DDD.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <iframe
      src="/dashboard-indicadores.html"
      title="RedeFlex · Dashboard Indicadores"
      className="h-screen w-screen border-0"
    />
  );
}
