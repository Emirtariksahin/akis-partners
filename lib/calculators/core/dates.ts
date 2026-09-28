// Tarihler saat dilimi kaymalarından etkilenmemesi için UTC gece yarısı olarak tutulur.

const GUN_MS = 86_400_000;

export function parseTarih(iso: string | null | undefined): Date | null {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function isoTarih(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function bugunIso() {
  const n = new Date();
  return isoTarih(new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate())));
}

export function gunFarki(bas: Date, bit: Date) {
  return Math.round((bit.getTime() - bas.getTime()) / GUN_MS);
}

export function gunEkle(d: Date, gun: number) {
  return new Date(d.getTime() + Math.round(gun) * GUN_MS);
}

export function yilEkle(d: Date, yil: number) {
  const y = new Date(d);
  y.setUTCFullYear(y.getUTCFullYear() + yil);
  return y;
}

/** İki tarih arasındaki takvim farkı (yıl / ay / gün). Bitiş günü dahil edilmez. */
export function takvimFarki(bas: Date, bit: Date) {
  let yil = bit.getUTCFullYear() - bas.getUTCFullYear();
  let ay = bit.getUTCMonth() - bas.getUTCMonth();
  let gun = bit.getUTCDate() - bas.getUTCDate();
  if (gun < 0) {
    ay -= 1;
    // Önceki ayın gün sayısı kadar ödünç al
    gun += new Date(Date.UTC(bit.getUTCFullYear(), bit.getUTCMonth(), 0)).getUTCDate();
  }
  if (ay < 0) {
    yil -= 1;
    ay += 12;
  }
  return { yil, ay, gun, toplamGun: gunFarki(bas, bit) };
}

/** Doğum tarihine göre belirli bir tarihteki tam yaş. */
export function yasHesapla(dogum: Date, tarih: Date) {
  return takvimFarki(dogum, tarih).yil;
}

const kisaBicim = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });

export function formatTarihKisa(d: Date) {
  return kisaBicim.format(d);
}

export function formatSure({ yil, ay, gun }: { yil: number; ay: number; gun: number }) {
  const parcalar = [yil && `${yil} yıl`, ay && `${ay} ay`, gun && `${gun} gün`].filter(Boolean);
  return parcalar.length ? parcalar.join(" ") : "0 gün";
}

/** Gün sayısını yaklaşık yıl/ay/gün olarak gösterir (yıl 365, ay 30 gün). */
export function gunuSureyeCevir(toplam: number) {
  const g = Math.max(0, Math.round(toplam));
  const yil = Math.floor(g / 365);
  const ay = Math.floor((g % 365) / 30);
  const gun = (g % 365) % 30;
  return { yil, ay, gun };
}
