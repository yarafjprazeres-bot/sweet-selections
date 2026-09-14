import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, CalendarDays, Copy, ExternalLink, HeartHandshake, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminWeddingOverview, type AdminWeddingSummary } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Administração — Laço" }, { name: "description", content: "Visão administrativa dos casais que usam o Laço." }, { property: "og:title", content: "Administração — Laço" }, { property: "og:description", content: "Visão administrativa protegida do Laço." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminPage,
});

function AdminPage() {
  const loadOverview = useServerFn(getAdminWeddingOverview);
  const [weddings, setWeddings] = useState<AdminWeddingSummary[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { void loadOverview().then(result => setWeddings(result.weddings)).catch(() => setError("Esta conta não tem acesso à administração.")); }, [loadOverview]);
  if (error) return <main className="flex min-h-screen items-center justify-center px-5"><div className="max-w-md text-center"><h1 className="text-4xl">Acesso restrito</h1><p className="mt-3 text-muted-foreground">{error}</p><Button asChild className="mt-6"><Link to="/painel"><ArrowLeft/>Voltar ao painel</Link></Button></div></main>;
  const published = weddings.filter(item => item.isPublished).length;
  const answers = weddings.reduce((total, item) => total + item.rsvpCount, 0);
  return <main className="min-h-screen bg-muted/40"><header className="border-b border-border bg-background"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><Link to="/" className="font-serif text-3xl text-primary">Laço</Link><Button variant="outline" asChild><Link to="/painel"><ArrowLeft/>Painel do casal</Link></Button></div></header><div className="mx-auto max-w-7xl px-5 py-10"><p className="text-xs font-semibold uppercase text-accent">Administração</p><h1 className="mt-2 text-5xl">Casais no Laço</h1><div className="mt-8 grid gap-4 md:grid-cols-3"><Stat icon={Users} label="Casais cadastrados" value={weddings.length}/><Stat icon={HeartHandshake} label="Sites publicados" value={published}/><Stat icon={CalendarDays} label="Confirmações recebidas" value={answers}/></div><section className="mt-8 border border-border bg-background p-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-3xl">Sites cadastrados</h2><p className="mt-1 text-sm text-muted-foreground">A cobrança ficará disponível em uma próxima etapa.</p></div><span className="border border-border bg-muted px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">Cobrança futura</span></div><div className="mt-6 overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Casal</TableHead><TableHead>Casamento</TableHead><TableHead>Site</TableHead><TableHead>Respostas</TableHead><TableHead>Situação</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader><TableBody>{weddings.map(item=><TableRow key={item.id}><TableCell><strong>{item.coupleNames}</strong><p className="text-xs text-muted-foreground">Desde {new Date(item.createdAt).toLocaleDateString("pt-BR")}</p></TableCell><TableCell>{new Date(item.weddingAt).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}</TableCell><TableCell>/casamento/{item.slug}</TableCell><TableCell>{item.rsvpCount}</TableCell><TableCell>{item.setupCompleted?(item.isPublished?"Publicado":"Pausado"):"Configuração inicial"}</TableCell><TableCell><div className="flex justify-end gap-1"><Button size="icon" variant="ghost" title="Copiar endereço" onClick={()=>navigator.clipboard.writeText(`${window.location.origin}/casamento/${item.slug}`)}><Copy/></Button><Button size="icon" variant="ghost" title="Abrir site" asChild><Link to="/casamento/$slug" params={{slug:item.slug}} target="_blank"><ExternalLink/></Link></Button></div></TableCell></TableRow>)}</TableBody></Table></div></section></div></main>;
}

function Stat({icon:Icon,label,value}:{icon:typeof Users;label:string;value:number}) { return <div className="border border-border bg-background p-6"><Icon className="text-accent"/><p className="mt-7 text-sm text-muted-foreground">{label}</p><strong className="font-serif text-5xl font-normal">{value}</strong></div>; }