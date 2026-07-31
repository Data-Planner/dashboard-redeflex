import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Novo Projeto" },
      { name: "description", content: "Projeto limpo e pronto para começar." },
      { property: "og:title", content: "Novo Projeto" },
      { property: "og:description", content: "Projeto limpo e pronto para começar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Projeto zerado</h1>
        <p className="mt-2 text-muted-foreground">Pronto para começar uma nova aplicação.</p>
      </div>
    </main>
  );
}
