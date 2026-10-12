import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Recuperar senha — Laço" },
      { name: "description", content: "Defina uma nova senha para acessar a área privada do seu casamento." },
      { property: "og:title", content: "Recuperar senha — Laço" },
      { property: "og:description", content: "Defina uma nova senha para acessar a área privada do seu casamento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (data.user) {
        setReady(true);
      } else {
        void navigate({ to: "/auth", replace: true });
      }
    };
    void check();
    return () => {
      active = false;
    };
  }, [navigate]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não são iguais.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError("Não foi possível salvar a nova senha. O link pode ter expirado — peça outro em “Esqueci minha senha”.");
      return;
    }
    await navigate({ to: "/painel", replace: true });
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <p className="text-sm text-muted-foreground">Verificando seu link de recuperação…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md animate-rise">
        <a href="/" className="mb-10 block font-serif text-3xl text-primary">
          Laço
        </a>
        <p className="mb-3 text-xs font-semibold uppercase text-accent">Recuperar acesso</p>
        <h1 className="text-4xl leading-none text-foreground">Defina uma nova senha</h1>
        <p className="mt-4 text-muted-foreground">
          Escolha uma nova senha para voltar a entrar com e-mail no seu painel.
        </p>
        <form className="mt-8 space-y-4" onSubmit={submit}>
          <div>
            <Label htmlFor="password">Nova senha</Label>
            <Input
              id="password"
              type="password"
              minLength={6}
              autoComplete="new-password"
              className="mt-2 h-12"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="confirm">Confirmar nova senha</Label>
            <Input
              id="confirm"
              type="password"
              minLength={6}
              autoComplete="new-password"
              className="mt-2 h-12"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading} size="lg" className="h-12 w-full">
            {loading ? <LoaderCircle className="animate-spin" /> : null}
            Salvar nova senha
          </Button>
        </form>
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Depois de salvar, você já entra direto no seu painel.
        </p>
      </div>
    </main>
  );
}
