import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIndicators } from "@/lib/indicator-store";

export function SectionHead({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignora dados inválidos */
    }
  }, [key]);
  const update = (next: T) => {
    setValue(next);
    localStorage.setItem(key, JSON.stringify(next));
  };
  return [value, update] as const;
}

const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
type Holiday = { id: string; date: string; ddd: string; name: string };

export function CalendarPage() {
  const [reference, setReference] = useState(() => new Date().toISOString().slice(0, 7));
  const [holidays] = useStored<Holiday[]>("rf-feriados", []);
  const [year, month] = reference.split("-").map(Number);
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const totalDays = new Date(year, month, 0).getDate();
  const holidayDays = new Set(holidays.filter((item) => item.date.startsWith(reference)).map((item) => Number(item.date.slice(8, 10))));
  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: totalDays }, (_, index) => index + 1)];
  const useful = Array.from({ length: totalDays }, (_, index) => index + 1).filter((day) => {
    const weekday = new Date(year, month - 1, day).getDay();
    return weekday !== 0 && weekday !== 6 && !holidayDays.has(day);
  }).length;
  return (
    <>
      <SectionHead
        title="Calendário"
        description='Dias, semanas e feriados do mês, por DDD. Os feriados são cadastrados na aba "Feriados por DDD" e alimentam direto o cálculo de meta/dia do Dashboard, em Relatórios.'
      />
      <div className="rf-card mb-5 flex flex-wrap items-end gap-4 p-5">
        <div className="space-y-2">
          <Label htmlFor="cal-ref">Mês de referência</Label>
          <Input id="cal-ref" type="month" value={reference} onChange={(event) => setReference(event.target.value)} className="w-48" />
        </div>
        <div className="ml-auto flex gap-3">
          <Badge variant="secondary">{totalDays} dias no mês</Badge>
          <Badge variant="secondary">{useful} dias úteis</Badge>
          <Badge variant="outline">{holidayDays.size} feriados</Badge>
        </div>
      </div>
      <div className="rf-card overflow-hidden">
        <div className="rf-group-head"><h2 className="text-sm">{monthNames[month - 1]} {year}</h2></div>
        <div className="grid grid-cols-7 border-b text-center text-[11px] font-bold uppercase text-muted-foreground">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => <span key={day} className="py-2">{day}</span>)}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, index) => {
            const weekday = index % 7;
            const isWeekend = weekday === 0 || weekday === 6;
            const isHoliday = typeof day === "number" && holidayDays.has(day);
            return (
              <div
                key={index}
                className={`min-h-20 border-r border-b p-2 text-sm last:border-r-0 ${isWeekend ? "bg-muted/40 text-muted-foreground" : ""} ${isHoliday ? "bg-primary/10 font-semibold text-primary" : ""}`}
              >
                {day ?? ""}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function HolidaysPage() {
  const [holidays, setHolidays] = useStored<Holiday[]>("rf-feriados", []);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const date = String(form.get("date"));
    const name = String(form.get("name")).trim();
    if (!date || !name) return;
    setHolidays([...holidays, { id: crypto.randomUUID(), date, name, ddd: String(form.get("ddd")).trim() }]);
    event.currentTarget.reset();
    toast.success("Feriado cadastrado");
  };
  return (
    <>
      <SectionHead title="Feriados por DDD" description="Feriados nacionais já valem para todos. Cadastre aqui só o que é específico de uma cidade." />
      <form onSubmit={submit} className="rf-card mb-5 flex flex-wrap items-end gap-4 p-5">
        <div className="space-y-2"><Label htmlFor="fer-date">Data</Label><Input id="fer-date" name="date" type="date" required className="w-44" /></div>
        <div className="space-y-2"><Label htmlFor="fer-ddd">DDD</Label><Input id="fer-ddd" name="ddd" placeholder="Ex.: 11" className="w-28" /></div>
        <div className="space-y-2 min-w-56 flex-1"><Label htmlFor="fer-name">Descrição</Label><Input id="fer-name" name="name" placeholder="Aniversário da cidade" required /></div>
        <Button type="submit">Cadastrar feriado</Button>
      </form>
      <div className="rf-card overflow-hidden">
        <div className="rf-group-head"><h2 className="text-sm">Feriados cadastrados</h2><span className="rounded-full border border-white/30 bg-white/15 px-2 py-0.5 text-[10.5px] font-bold">{holidays.length}</span></div>
        {holidays.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">Nenhum feriado específico cadastrado.</p>
        ) : (
          holidays.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b p-4 last:border-0">
              <strong className="w-28 text-sm">{item.date.split("-").reverse().join("/")}</strong>
              <Badge variant="outline">{item.ddd || "Todos os DDDs"}</Badge>
              <span className="flex-1 text-sm">{item.name}</span>
              <Button variant="ghost" size="sm" onClick={() => setHolidays(holidays.filter((row) => row.id !== item.id))}>Excluir</Button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export function HierarchyPage() {
  const store = useIndicators();
  return (
    <>
      <SectionHead title="Hierarquia" description="Estrutura organizacional por mês — consultor, supervisor, gerente, território e DDD. A hierarquia alimenta os filtros do Dashboard, em Relatórios." />
      <div className="rf-card overflow-hidden">
        <div className="rf-group-head"><h2 className="text-sm">Estrutura vigente</h2></div>
        <p className="p-6 text-sm text-muted-foreground">
          Nenhuma planilha de hierarquia importada. Use <strong>Bases importadas</strong> para enviar o arquivo com consultor, supervisor, gerente, território e DDD.
        </p>
        <div className="border-t p-4 text-xs text-muted-foreground">{store.imports.length} base(s) já enviadas no navegador.</div>
      </div>
    </>
  );
}

export function SchedulePage() {
  const [schedule, setSchedule] = useStored("rf-agendamento", { folder: "", time: "07:00" });
  return (
    <>
      <SectionHead title="Agendamento de importação" description="Registre de qual pasta e em qual horário os arquivos devem ser buscados. O navegador não executa a busca sozinho — o registro serve de referência para a rotina automática." />
      <form
        className="rf-card max-w-xl space-y-4 p-5"
        onSubmit={(event) => {
          event.preventDefault();
          toast.success("Agendamento salvo");
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="sch-folder">Pasta de origem</Label>
          <Input id="sch-folder" value={schedule.folder} onChange={(event) => setSchedule({ ...schedule, folder: event.target.value })} placeholder="\\servidor\indicadores\vendas" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sch-time">Horário diário</Label>
          <Input id="sch-time" type="time" value={schedule.time} onChange={(event) => setSchedule({ ...schedule, time: event.target.value })} className="w-40" />
        </div>
        <Button type="submit">Salvar agendamento</Button>
      </form>
    </>
  );
}
