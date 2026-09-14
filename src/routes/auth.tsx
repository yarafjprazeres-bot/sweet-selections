import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Chrome, LoaderCircle } from "lucide-react";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import hero from "@/assets/wedding-hero.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Entrar — Laço" }, { name: "description", content: "Acesse a área privada do seu casamento." }, { property: "og:title", content: "Entrar — Laço" }, { property: "og:description", content: "Acesse a área privada do seu casamento." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: AuthPage,
});
function AuthPage() {
  const navigate = useNavigate(); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  useEffect(() => { supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: "/painel", replace: true }); }); }, [navigate]);
  async function enter() { setLoading(true); setError(""); const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin, extraParams: { prompt: "select_account" } }); if (result.error) { setError("Não foi possível entrar agora. Tente novamente."); setLoading(false); return; } if (!result.redirected) navigate({ to: "/painel" }); }
  return <main className="grid min-h-screen lg:grid-cols-2"><div className="relative hidden lg:block"><img src={hero} alt="Casal caminhando em um jardim" className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-foreground/20"/></div><div className="flex items-center justify-center bg-background px-6 py-16"><div className="w-full max-w-md animate-rise"><a href="/" className="mb-14 block font-serif text-3xl text-primary">Laço</a><p className="mb-3 text-xs font-semibold uppercase text-accent">Área do casal</p><h1 className="text-5xl leading-none text-foreground">Seu casamento,<br/>em boas mãos.</h1><p className="mt-6 text-muted-foreground">Entre para editar o site, enviar fotos e acompanhar cada confirmação.</p><Button onClick={enter} disabled={loading} size="lg" className="mt-10 h-12 w-full"><span>{loading ? <LoaderCircle className="animate-spin"/> : <Chrome/>}</span>Continuar com Google</Button>{error && <p className="mt-4 text-sm text-destructive">{error}</p>}<p className="mt-6 text-center text-xs text-muted-foreground">Acesso seguro. Seus dados ficam separados dos demais casais.</p></div></div></main>;
}
