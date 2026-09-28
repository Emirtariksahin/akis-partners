const tlBicimi = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const sayiBicimi = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 });

/** Kuruş hassasiyetinde yuvarlama (0,005 → 0,01). */
export function yuvarla(n: number, basamak = 2) {
  const k = 10 ** basamak;
  return Math.round((n + Number.EPSILON) * k) / k;
}

export function formatTL(n: number) {
  return tlBicimi.format(yuvarla(n));
}

export function formatSayi(n: number) {
  return sayiBicimi.format(n);
}

export function formatYuzde(oran: number) {
  return `%${sayiBicimi.format(oran)}`;
}

/**
 * Kullanıcının yazdığı tutarı sayıya çevirir. Türkçe biçim ("33.030,50") esastır;
 * virgül yoksa ve noktalar binlik ayırıcı düzenindeyse ("33.030") binlik kabul edilir,
 * aksi hâlde nokta ondalık ayırıcıdır ("33030.5").
 */
export function parseTutar(girdi: string | number | null | undefined): number | null {
  if (typeof girdi === "number") return Number.isFinite(girdi) ? girdi : null;
  if (!girdi) return null;
  let s = girdi.replace(/[₺TL\s]/gi, "");
  if (!s) return null;
  if (s.includes(",")) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) {
    s = s.replace(/\./g, "");
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** Kademeli (dilimli) oran uygular. Dilim genişliği null ise son dilimdir. */
export function dilimliHesap(tutar: number, dilimler: { genislik: number | null; oran: number }[]) {
  let kalan = Math.max(0, tutar);
  let toplam = 0;
  const detay: { taban: number; tutar: number; oran: number; sonuc: number }[] = [];
  let taban = 0;
  for (const d of dilimler) {
    if (kalan <= 0) break;
    const buDilim = d.genislik === null ? kalan : Math.min(kalan, d.genislik);
    const sonuc = (buDilim * d.oran) / 100;
    detay.push({ taban, tutar: buDilim, oran: d.oran, sonuc });
    toplam += sonuc;
    kalan -= buDilim;
    taban += buDilim;
  }
  return { toplam, detay };
}
