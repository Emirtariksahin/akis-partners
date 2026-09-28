import type { HesaplamaParametreleri } from "./params";

// TBK m.344: Yenilenen kira dönemlerinde artış, bir önceki kira yılında TÜFE'nin
// on iki aylık ortalamalara göre değişimini geçemez. Tablodaki "ay", kira artışının uygulanacağı aydır
// (o ay açıklanan, bir önceki aya ait TÜİK verisi).

const AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

export function ayEtiketi(ay: string) {
  const [y, m] = ay.split("-").map(Number);
  return `${AYLAR[m - 1]} ${y}`;
}

export function kiraArtisHesapla(mevcutKira: number, ay: string, p: Pick<HesaplamaParametreleri, "kiraTufe">) {
  const kayit = p.kiraTufe.find((k) => k.ay === ay);
  if (!kayit) return null;
  const artis = (mevcutKira * kayit.oran) / 100;
  return { oran: kayit.oran, artis, yeniKira: mevcutKira + artis, yillikFark: artis * 12 };
}

export function kiraAylari(p: Pick<HesaplamaParametreleri, "kiraTufe">) {
  return [...p.kiraTufe].sort((a, b) => b.ay.localeCompare(a.ay));
}
