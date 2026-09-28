import type { HesaplamaParametreleri } from "./params";
import { gunFarki, parseTarih, yasHesapla } from "./core/dates";
import { TRH_2010 } from "./data/trh2010";

// Sürekli iş göremezlik (maluliyet) tazminatının aktüeryal tahmini.
// Yöntem: TRH-2010 yaşam tablosu, progresif rant (%10 artırım – %10 iskonto: bugünkü değer = nominal),
// aktif dönemde beyan edilen net gelir, pasif dönemde net asgari ücret esas alınır.
// Geçmiş dönemde de güncel gelir kullanıldığından sonuç yaklaşık bir değerdir.

export type TazminatGirdi = {
  kazaTarihi: string;
  hesapTarihi: string;
  dogumTarihi: string;
  cinsiyet: "erkek" | "kadin";
  netGelir: number;
  maluliyetYuzde: number;
  kusurYuzde: number;
  aktifYasSiniri: number;
  /** İş kazasında SGK tarafından bağlanan gelirin peşin sermaye değeri (mahsup edilir). */
  sgkPsd?: number;
};

export function bakiyeOmur(yas: number, cinsiyet: "erkek" | "kadin") {
  const satir = TRH_2010[Math.min(Math.max(0, Math.floor(yas)), TRH_2010.length - 1)];
  return cinsiyet === "erkek" ? satir[1] : satir[2];
}

export function tazminatHesapla(g: TazminatGirdi, p: Pick<HesaplamaParametreleri, "asgariUcret">) {
  const kaza = parseTarih(g.kazaTarihi);
  const hesap = parseTarih(g.hesapTarihi);
  const dogum = parseTarih(g.dogumTarihi);
  if (!kaza || !hesap || !dogum || hesap < kaza) return null;

  const kazaYasi = yasHesapla(dogum, kaza);
  const omur = bakiyeOmur(kazaYasi, g.cinsiyet);
  const olumYasi = kazaYasi + omur;
  const hesapYasi = gunFarki(dogum, hesap) / 365.25;

  const oran = (g.maluliyetYuzde / 100) * (1 - g.kusurYuzde / 100);
  const gunluk = (tutar: number) => tutar / 30;

  // 1) İşlemiş dönem: kaza → hesap tarihi
  const islemisGun = gunFarki(kaza, hesap);
  const islemisDonemYasSonu = Math.min(hesapYasi, olumYasi);
  const islemis = islemisGun * gunluk(g.netGelir) * oran;

  // 2) İşleyecek aktif dönem: hesap tarihi → aktif yaş sınırı (ölüm yaşını aşmamak kaydıyla)
  const aktifSon = Math.min(g.aktifYasSiniri, olumYasi);
  const aktifGun = Math.max(0, (aktifSon - Math.max(islemisDonemYasSonu, hesapYasi)) * 365);
  const aktif = aktifGun * gunluk(g.netGelir) * oran;

  // 3) Pasif dönem: aktif sınır → ölüm yaşı, net asgari ücret üzerinden
  const pasifBas = Math.max(aktifSon, hesapYasi);
  const pasifGun = Math.max(0, (olumYasi - pasifBas) * 365);
  const pasif = pasifGun * gunluk(p.asgariUcret.net) * oran;

  const toplam = islemis + aktif + pasif;
  const psd = Math.max(0, g.sgkPsd ?? 0);
  const net = Math.max(0, toplam - psd);

  return {
    kazaYasi,
    omur,
    olumYasi,
    oran,
    donemler: [
      { ad: "İşlemiş dönem", gun: islemisGun, gelir: g.netGelir, tutar: islemis },
      { ad: "İşleyecek aktif dönem", gun: Math.round(aktifGun), gelir: g.netGelir, tutar: aktif },
      { ad: "Pasif dönem", gun: Math.round(pasifGun), gelir: p.asgariUcret.net, tutar: pasif },
    ],
    toplam,
    psd,
    net,
  };
}
