export type Venue = { local: string; data: string; hora: string; endereco: string; maps_url: string; fotos: string[] };
export type Pix = { key: string; name: string; city: string };
export const weddingSections = ["story", "ceremony", "reception", "rsvp", "gifts", "contact"] as const;
export type WeddingSection = (typeof weddingSections)[number];
export type WeddingTheme = {
  template: "garden" | "editorial" | "classic";
  palette: "olive" | "rose" | "ocean" | "terracotta" | "custom";
  customColors: { primary: string; accent: string; background: string };
  font: "romantic" | "modern" | "classic";
  icons: "minimal" | "floral" | "classic";
  heroAlign: "left" | "center";
  sections: WeddingSection[];
  hidden: WeddingSection[];
};
export type Wedding = {
  id: string; owner_id: string; slug: string; couple_names: string; wedding_at: string;
  date_text: string; cover_photo: string; story: string; whatsapp: string;
  ceremony: Venue; reception: Venue; pix: Pix; is_published: boolean;
  partner_one_name: string; partner_one_role: string; partner_two_name: string;
  partner_two_role: string; setup_completed: boolean; theme: WeddingTheme;
};

export const fallbackVenue: Venue = { local: "", data: "", hora: "", endereco: "", maps_url: "", fotos: [] };
export function asVenue(value: unknown): Venue {
  if (!value || typeof value !== "object") return fallbackVenue;
  const v = value as Partial<Venue>;
  return { local: v.local ?? "", data: v.data ?? "", hora: v.hora ?? "", endereco: v.endereco ?? "", maps_url: v.maps_url ?? "", fotos: Array.isArray(v.fotos) ? v.fotos : [] };
}
export function asPix(value: unknown): Pix {
  if (!value || typeof value !== "object") return { key: "", name: "", city: "" };
  const v = value as Partial<Pix>;
  return { key: v.key ?? "", name: v.name ?? "", city: v.city ?? "" };
}
export const defaultTheme: WeddingTheme = { template: "garden", palette: "olive", customColors: { primary: "#365b45", accent: "#b87858", background: "#fbf8f1" }, font: "romantic", icons: "minimal", heroAlign: "center", sections: [...weddingSections], hidden: [] };
export function asTheme(value: unknown): WeddingTheme {
  if (!value || typeof value !== "object") return defaultTheme;
  const v = value as Partial<WeddingTheme>;
  const sections = Array.isArray(v.sections) ? v.sections.filter((item): item is WeddingSection => weddingSections.includes(item as WeddingSection)) : [];
  return {
    template: ["garden", "editorial", "classic"].includes(v.template ?? "") ? v.template as WeddingTheme["template"] : "garden",
    palette: ["olive", "rose", "ocean", "terracotta", "custom"].includes(v.palette ?? "") ? v.palette as WeddingTheme["palette"] : "olive",
    customColors: {
      primary: validHex(v.customColors?.primary) ? v.customColors.primary : defaultTheme.customColors.primary,
      accent: validHex(v.customColors?.accent) ? v.customColors.accent : defaultTheme.customColors.accent,
      background: validHex(v.customColors?.background) ? v.customColors.background : defaultTheme.customColors.background,
    },
    font: ["romantic", "modern", "classic"].includes(v.font ?? "") ? v.font as WeddingTheme["font"] : "romantic",
    icons: ["minimal", "floral", "classic"].includes(v.icons ?? "") ? v.icons as WeddingTheme["icons"] : "minimal",
    heroAlign: v.heroAlign === "left" ? "left" : "center",
    sections: [...sections, ...weddingSections.filter(item => !sections.includes(item))],
    hidden: Array.isArray(v.hidden) ? v.hidden.filter((item): item is WeddingSection => weddingSections.includes(item as WeddingSection)) : [],
  };
}
function validHex(value: unknown): value is string { return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value); }
function readableOn(hex: string) {
  const rgb = [1, 3, 5].map(index => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
  const linear = rgb.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return (0.2126 * (linear[0] ?? 0) + 0.7152 * (linear[1] ?? 0) + 0.0722 * (linear[2] ?? 0)) > 0.48 ? "#18201b" : "#ffffff";
}
export function weddingThemeStyle(theme: WeddingTheme) {
  if (theme.palette !== "custom") return undefined;
  return {
    "--background": theme.customColors.background,
    "--foreground": readableOn(theme.customColors.background),
    "--primary": theme.customColors.primary,
    "--primary-foreground": readableOn(theme.customColors.primary),
    "--accent": theme.customColors.accent,
    "--accent-foreground": readableOn(theme.customColors.accent),
    "--secondary": `color-mix(in oklab, ${theme.customColors.background} 86%, ${theme.customColors.primary})`,
    "--secondary-foreground": readableOn(theme.customColors.background),
    "--muted": `color-mix(in oklab, ${theme.customColors.background} 92%, ${theme.customColors.primary})`,
    "--muted-foreground": `color-mix(in oklab, ${readableOn(theme.customColors.background)} 66%, transparent)`,
    "--border": `color-mix(in oklab, ${theme.customColors.primary} 25%, ${theme.customColors.background})`,
    "--input": `color-mix(in oklab, ${theme.customColors.primary} 25%, ${theme.customColors.background})`,
    "--ring": theme.customColors.accent,
  } as Record<string, string>;
}
export function formatWeddingDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "America/Sao_Paulo" });
}
export function weddingDatePart(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find(item => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}
export function weddingTimePart(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
}
export function combineWeddingDateTime(current: string, date = weddingDatePart(current), time = weddingTimePart(current)) {
  if (!date || !time) return current;
  return new Date(`${date}T${time}:00-03:00`).toISOString();
}
export function safeGoogleMapsUrl(value: string) {
  if (!value.trim()) return "";
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return host === "maps.app.goo.gl" || host === "maps.google.com" || host === "www.google.com" || host.endsWith(".google.com") ? url.toString() : "";
  } catch { return ""; }
}
export async function resolveWeddingPhoto(path: string) {
  if (!path || /^https?:\/\//.test(path)) return path;
  const { supabase } = await import("@/integrations/supabase/client");
  const { data } = await supabase.storage.from("wedding-photos").createSignedUrl(path, 3600);
  return data?.signedUrl ?? "";
}
export function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 54) || "nosso-casamento";
}
export function buildPixPayload(key: string, name: string, city: string, amount: number, txid: string) {
  const field = (id: string, value: string) => id + value.length.toString().padStart(2, "0") + value;
  const clean = (s: string, max: number) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 ]/g, "").toUpperCase().slice(0, max) || "CASAMENTO";
  const account = field("00", "br.gov.bcb.pix") + field("01", key);
  let payload = field("00", "01") + field("26", account) + field("52", "0000") + field("53", "986") + field("54", amount.toFixed(2)) + field("58", "BR") + field("59", clean(name, 25)) + field("60", clean(city, 15)) + field("62", field("05", clean(txid, 25))) + "6304";
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) { crc ^= payload.charCodeAt(i) << 8; for (let j = 0; j < 8; j++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff; }
  return payload + crc.toString(16).toUpperCase().padStart(4, "0");
}