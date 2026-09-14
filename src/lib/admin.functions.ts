import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type AdminWeddingSummary = {
  id: string;
  coupleNames: string;
  slug: string;
  weddingAt: string;
  isPublished: boolean;
  setupCompleted: boolean;
  createdAt: string;
  rsvpCount: number;
};

export const getAdminWeddingOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ weddings: AdminWeddingSummary[] }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: role, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (roleError) throw roleError;
    if (!role) throw new Error("Acesso administrativo não autorizado.");

    const { data: weddings, error: weddingsError } = await supabaseAdmin
      .from("weddings")
      .select("id, couple_names, slug, wedding_at, is_published, setup_completed, created_at")
      .order("created_at", { ascending: false });
    if (weddingsError) throw weddingsError;
    const ids = (weddings ?? []).map(item => item.id);
    const { data: rsvps, error: rsvpsError } = ids.length
      ? await supabaseAdmin.from("rsvps").select("wedding_id").in("wedding_id", ids)
      : { data: [], error: null };
    if (rsvpsError) throw rsvpsError;
    const counts = new Map<string, number>();
    for (const rsvp of rsvps ?? []) counts.set(rsvp.wedding_id, (counts.get(rsvp.wedding_id) ?? 0) + 1);
    return { weddings: (weddings ?? []).map(item => ({
      id: item.id,
      coupleNames: item.couple_names,
      slug: item.slug,
      weddingAt: item.wedding_at,
      isPublished: item.is_published,
      setupCompleted: item.setup_completed,
      createdAt: item.created_at,
      rsvpCount: counts.get(item.id) ?? 0,
    })) };
  });