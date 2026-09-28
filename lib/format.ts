const tarihBicimi = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** "2026-09-28" → "28 Eylül 2026" */
export function formatTarih(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : tarihBicimi.format(d);
}

/** Markdoc/düz metin için yaklaşık okuma süresi (dakika). */
export function okumaSuresi(metin: string) {
  const kelime = metin.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(kelime / 200));
}
