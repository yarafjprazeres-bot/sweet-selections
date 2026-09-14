export type Venue = { local: string; data: string; hora: string; endereco: string; fotos: string[] };
export type Pix = { key: string; name: string; city: string };
export type Wedding = {
  id: string; owner_id: string; slug: string; couple_names: string; wedding_at: string;
  date_text: string; cover_photo: string; story: string; whatsapp: string;
  ceremony: Venue; reception: Venue; pix: Pix; is_published: boolean;
};

export const fallbackVenue: Venue = { local: "", data: "", hora: "", endereco: "", fotos: [] };
export function asVenue(value: unknown): Venue {
  if (!value || typeof value !== "object") return fallbackVenue;
  const v = value as Partial<Venue>;
  return { local: v.local ?? "", data: v.data ?? "", hora: v.hora ?? "", endereco: v.endereco ?? "", fotos: Array.isArray(v.fotos) ? v.fotos : [] };
}
export function asPix(value: unknown): Pix {
  if (!value || typeof value !== "object") return { key: "", name: "", city: "" };
  const v = value as Partial<Pix>;
  return { key: v.key ?? "", name: v.name ?? "", city: v.city ?? "" };
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