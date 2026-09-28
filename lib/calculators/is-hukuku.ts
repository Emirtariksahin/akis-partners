import type { HesaplamaParametreleri } from "./params";
import { takvimFarki } from "./core/dates";
import { basitKesinti } from "./core/payroll";

type P = HesaplamaParametreleri;

// ── Kıdem ve ihbar tazminatı ─────────────────────────────────────────
// Kıdem: 1475 s. İş Kanunu m.14 (yürürlükte), tavan uygulanır, yalnızca damga vergisi kesilir (GVK 25/7).
// İhbar: 4857 s. İş Kanunu m.17, gelir ve damga vergisine tabidir.

export function kidemTavaniBul(cikis: Date, p: P) {
  const iso = cikis.toISOString().slice(0, 10);
  const donem = p.kidemTavanlari.find((t) => t.baslangic <= iso && iso <= t.bitis);
  if (donem) return { tutar: donem.tutar, donem, tahmini: false };
  // Tabloda olmayan (gelecek) bir tarih için en güncel tavan kullanılır.
  const enYeni = [...p.kidemTavanlari].sort((a, b) => b.baslangic.localeCompare(a.baslangic))[0];
  return { tutar: enYeni?.tutar ?? Infinity, donem: enYeni, tahmini: true };
}

export function ihbarSuresiHafta(toplamAy: number) {
  if (toplamAy < 6) return 2;
  if (toplamAy < 18) return 4;
  if (toplamAy < 36) return 6;
  return 8;
}

export type KidemIhbarGirdi = { giris: Date; cikis: Date; brutUcret: number; gvOraniYuzde: number };

export function kidemIhbarHesapla(g: KidemIhbarGirdi, p: P) {
  const sure = takvimFarki(g.giris, g.cikis);
  const tavan = kidemTavaniBul(g.cikis, p);
  const esasUcret = Math.min(g.brutUcret, tavan.tutar);
  const tavanUygulandi = g.brutUcret > tavan.tutar;

  const kidemHakki = sure.yil >= 1;
  const yilTutari = esasUcret * sure.yil;
  const ayTutari = (esasUcret / 12) * sure.ay;
  const gunTutari = (esasUcret / 365) * sure.gun;
  const kidemBrut = kidemHakki ? yilTutari + ayTutari + gunTutari : 0;
  const kidemDamga = (kidemBrut * p.kesintiler.damgaBinde) / 1000;

  const toplamAy = sure.yil * 12 + sure.ay + sure.gun / 30;
  const ihbarHafta = ihbarSuresiHafta(toplamAy);
  const ihbarBrut = (g.brutUcret / 30) * ihbarHafta * 7;
  const ihbarKesinti = basitKesinti(ihbarBrut, { sgk: false, gvOraniYuzde: g.gvOraniYuzde }, p);

  return {
    sure,
    tavan,
    esasUcret,
    tavanUygulandi,
    kidem: {
      hakVar: kidemHakki,
      yilTutari: kidemHakki ? yilTutari : 0,
      ayTutari: kidemHakki ? ayTutari : 0,
      gunTutari: kidemHakki ? gunTutari : 0,
      brut: kidemBrut,
      damga: kidemDamga,
      net: kidemBrut - kidemDamga,
    },
    ihbar: {
      hafta: ihbarHafta,
      gun: ihbarHafta * 7,
      brut: ihbarBrut,
      gelirVergisi: ihbarKesinti.gelirVergisi,
      damga: ihbarKesinti.damga,
      net: ihbarKesinti.net,
    },
    toplamNet: kidemBrut - kidemDamga + ihbarKesinti.net,
  };
}

// ── Yıllık ücretli izin ──────────────────────────────────────────────
// İşçi: 4857 s. İK m.53; memur: 657 s. DMK m.102.

export type IzinGirdi = {
  calisan: "isci" | "memur";
  hizmetYili: number;
  yas: number;
  brutUcret: number;
  /** Ücreti hesaplanacak gün; boşsa yıllık hak kadar. */
  kullanilmayanGun?: number | null;
  gvOraniYuzde: number;
};

export function yillikIzinGunu(calisan: "isci" | "memur", hizmetYili: number, yas: number) {
  if (hizmetYili < 1) return 0;
  if (calisan === "memur") return hizmetYili <= 10 ? 20 : 30;
  let gun = hizmetYili <= 5 ? 14 : hizmetYili < 15 ? 20 : 26;
  if (yas <= 18 || yas >= 50) gun = Math.max(gun, 20);
  return gun;
}

export function yillikIzinHesapla(g: IzinGirdi, p: P) {
  const hakGun = yillikIzinGunu(g.calisan, g.hizmetYili, g.yas);
  const ucretGun = g.kullanilmayanGun ?? hakGun;
  const gunluk = g.brutUcret / 30;
  const brut = gunluk * ucretGun;
  const kesinti = basitKesinti(brut, { sgk: true, gvOraniYuzde: g.gvOraniYuzde }, p);
  return { hakGun, ucretGun, gunluk, brut, ...kesinti };
}

// ── Fazla çalışma ────────────────────────────────────────────────────
// 4857 s. İK m.41: saat ücretinin %50 fazlası; fazla sürelerle çalışmada %25.

export type FazlaMesaiGirdi = { brutUcret: number; saat: number; zamYuzde: 50 | 25; gvOraniYuzde: number };

export const AYLIK_CALISMA_SAATI = 225;
export const YILLIK_FAZLA_MESAI_SINIRI = 270;

export function fazlaMesaiHesapla(g: FazlaMesaiGirdi, p: P) {
  const saatlik = g.brutUcret / AYLIK_CALISMA_SAATI;
  const zamliSaatlik = saatlik * (1 + g.zamYuzde / 100);
  const brut = zamliSaatlik * g.saat;
  const kesinti = basitKesinti(brut, { sgk: true, gvOraniYuzde: g.gvOraniYuzde }, p);
  return { saatlik, zamliSaatlik, brut, sinirAsildi: g.saat > YILLIK_FAZLA_MESAI_SINIRI, ...kesinti };
}

// ── Ulusal bayram ve genel tatil (UBGT) ─────────────────────────────
// 4857 s. İK m.47: tatil günü çalışılırsa, çalışılan her gün için bir günlük ilave ücret.

export type UbgtGirdi = { brutUcret: number; gun: number; gunlukSaat: number; normalSaat: number; gvOraniYuzde: number };

export function ubgtHesapla(g: UbgtGirdi, p: P) {
  const gunluk = g.brutUcret / 30;
  const oran = g.normalSaat > 0 ? Math.min(g.gunlukSaat / g.normalSaat, 1) : 1;
  const brut = gunluk * g.gun * oran;
  const kesinti = basitKesinti(brut, { sgk: true, gvOraniYuzde: g.gvOraniYuzde }, p);
  return { gunluk, oran, brut, ...kesinti };
}
