import { useEffect, useState } from "react";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { resolveWeddingPhoto } from "@/lib/wedding";

type Props = { ownerId: string; folder: string; value: string; onChange: (path: string) => void; label: string };

export function PhotoUpload({ ownerId, folder, value, onChange, label }: Props) {
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { let live = true; void resolveWeddingPhoto(value).then(url => { if (live) setPreview(url); }); return () => { live = false; }; }, [value]);
  async function upload(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) { setError("Escolha uma imagem de até 8 MB."); return; }
    setBusy(true); setError("");
    const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${ownerId}/${folder}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("wedding-photos").upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) { setError("Não foi possível enviar esta foto."); setBusy(false); return; }
    if (value && !/^https?:\/\//.test(value)) await supabase.storage.from("wedding-photos").remove([value]);
    onChange(path); setBusy(false);
  }
  async function remove() { if (value && !/^https?:\/\//.test(value)) await supabase.storage.from("wedding-photos").remove([value]); onChange(""); setPreview(""); }
  return <div className="space-y-3"><p className="text-sm font-medium">{label}</p>{preview&&<img src={preview} alt={label} className="aspect-video w-full border border-border object-cover"/>}<div className="flex flex-wrap gap-2"><Button type="button" variant="outline" asChild disabled={busy}><label className="cursor-pointer"><input className="sr-only" type="file" accept="image/*" onChange={event=>void upload(event.target.files?.[0])}/>{busy?<LoaderCircle className="animate-spin"/>:<ImagePlus/>}{busy?"Enviando…":preview?"Substituir foto":"Escolher foto"}</label></Button>{value&&<Button type="button" variant="ghost" onClick={()=>void remove()}><Trash2/>Remover</Button>}</div>{error&&<p className="text-sm text-destructive">{error}</p>}<p className="text-xs text-muted-foreground">JPG, PNG ou WebP, até 8 MB.</p></div>;
}