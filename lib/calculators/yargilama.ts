import type { HesaplamaParametreleri } from "./params";
import { dilimliHesap } from "./core/money";

type P = HesaplamaParametreleri;

// ── Mahkeme harç ve gider avansı ─────────────────────────────────────
// 492 s. Harçlar Kanunu (1) sayılı tarife; HMK Gider Avansı Tarifesi.

export type HarcGirdi = {
  mahkeme: "asliye" | "sulh";
  tur: "nispi" | "maktu";
  davaDegeri: number;
  tarafSayisi: number;
  tanikSayisi: number;
  bilirkisiSayisi: number;
  kesif: boolean;
  vekil: boolean;
};

export type Kalem = { ad: string; tutar: number; grup: "harc" | "avans" };

export function harcVeGiderHesapla(g: HarcGirdi, p: P) {
  const h = p.harc;
  const a = p.giderAvansi;
  const kalemler: Kalem[] = [];

  kalemler.push({ ad: "Başvurma harcı", tutar: g.mahkeme === "sulh" ? h.basvurmaSulh : h.basvurmaAsliye, grup: "harc" });

  if (g.tur === "nispi") {
    const nispiHarc = (g.davaDegeri * h.nispiBinde) / 1000;
    kalemler.push({ ad: "Peşin nispi karar ve ilam harcı (1/4)", tutar: Math.max(nispiHarc / 4, h.maktuKararIlam), grup: "harc" });
  } else {
    kalemler.push({ ad: "Maktu karar ve ilam harcı", tutar: h.maktuKararIlam, grup: "harc" });
  }

  if (g.vekil) {
    kalemler.push({ ad: "Vekalet suret harcı", tutar: h.vekaletSuretHarci, grup: "harc" });
    kalemler.push({ ad: "Vekalet pulu", tutar: h.baroPulu, grup: "harc" });
  }
  if (g.kesif) kalemler.push({ ad: "Keşif harcı", tutar: h.kesifHarci, grup: "harc" });

  const tebligat = Math.max(2, g.tarafSayisi) * a.tarafBasinaTebligat * a.tebligatUcreti;
  kalemler.push({ ad: "Gider avansı (sabit)", tutar: a.sabitTutar, grup: "avans" });
  kalemler.push({ ad: `Tebligat gideri (${Math.max(2, g.tarafSayisi)} taraf × ${a.tarafBasinaTebligat})`, tutar: tebligat, grup: "avans" });
  if (g.tanikSayisi > 0) kalemler.push({ ad: `Tanık gideri (${g.tanikSayisi} tanık)`, tutar: g.tanikSayisi * a.tanikBasi, grup: "avans" });
  if (g.bilirkisiSayisi > 0)
    kalemler.push({ ad: `Bilirkişi ücreti (${g.bilirkisiSayisi} bilirkişi)`, tutar: g.bilirkisiSayisi * a.bilirkisiBasi, grup: "avans" });

  const harcToplam = kalemler.filter((k) => k.grup === "harc").reduce((t, k) => t + k.tutar, 0);
  const avansToplam = kalemler.filter((k) => k.grup === "avans").reduce((t, k) => t + k.tutar, 0);
  const tamNispiHarc = g.tur === "nispi" ? (g.davaDegeri * h.nispiBinde) / 1000 : null;

  return { kalemler, harcToplam, avansToplam, toplam: harcToplam + avansToplam, tamNispiHarc };
}

// ── Islah harcı ──────────────────────────────────────────────────────
// Islahla artırılan miktar üzerinden nispi karar ve ilam harcının dörtte biri peşin alınır.

export function islahHarciHesapla(artirilanMiktar: number, p: P) {
  const tamHarc = (artirilanMiktar * p.harc.nispiBinde) / 1000;
  return { tamHarc, pesinHarc: tamHarc / 4, kalanHarc: tamHarc - tamHarc / 4 };
}

// ── Vekalet ücreti (AAÜT) ────────────────────────────────────────────
// Nispi ücret, Tarifenin üçüncü kısmına göre dilimli hesaplanır; ikinci kısımdaki maktu ücretten az
// olamaz, ancak hüküm altına alınan miktarı da geçemez (AAÜT m.13).

export type VekaletGirdi = { tur: "nispi" | "maktu"; yargiYeri: string; tutar: number };

export function vekaletUcretiHesapla(g: VekaletGirdi, p: P) {
  const maktu = p.aaut.maktu.find((m) => m.kod === g.yargiYeri) ?? p.aaut.maktu[0];
  if (g.tur === "maktu") {
    return { ucret: maktu.tutar, maktu, nispi: null, detay: [], kural: "maktu" as const };
  }
  const { toplam, detay } = dilimliHesap(
    g.tutar,
    p.aaut.nispiDilimler.map((d) => ({ genislik: d.genislik, oran: d.oranYuzde })),
  );
  let ucret = toplam;
  let kural: "nispi" | "maktu-alt-sinir" | "tutar-ust-sinir" = "nispi";
  if (toplam < maktu.tutar) {
    if (g.tutar < maktu.tutar) {
      ucret = g.tutar;
      kural = "tutar-ust-sinir";
    } else {
      ucret = maktu.tutar;
      kural = "maktu-alt-sinir";
    }
  }
  return { ucret, maktu, nispi: toplam, detay, kural };
}

// ── Arabuluculuk ücreti ──────────────────────────────────────────────
// 2026 Yılı Arabuluculuk Asgari Ücret Tarifesi (RG 26.12.2025/33119).

export type ArabuluculukGirdi = {
  sonuc: "anlasma" | "anlasamama";
  parasal: boolean;
  tur: string;
  tarafSayisi: number;
  arabulucuSayisi: number;
  saat: number;
  tutar: number;
};

export function arabuluculukUcretiHesapla(g: ArabuluculukGirdi, p: P) {
  const t = p.arabuluculuk;
  const tarife = t.saatlik.find((s) => s.tur === g.tur) ?? t.saatlik[t.saatlik.length - 1];
  const taraf = Math.max(2, Math.round(g.tarafSayisi));
  const saatUcreti =
    taraf === 2 ? tarife.ikiTarafKisiBasi * 2 : taraf <= 5 ? tarife.ucBesTaraf : taraf <= 10 ? tarife.altiOnTaraf : tarife.onbirUstuTaraf;
  const saat = Math.max(g.saat, t.asgariSaat);
  const cokArabulucu = g.arabulucuSayisi > 1;

  // Anlaşma sağlanan parasal uyuşmazlıklar: ikinci kısım (nispi)
  if (g.sonuc === "anlasma" && g.parasal) {
    const { toplam, detay } = dilimliHesap(
      g.tutar,
      t.nispiDilimler.map((d) => ({ genislik: d.genislik, oran: cokArabulucu ? d.cokYuzde : d.tekYuzde })),
    );
    const asgari = g.tur === "ticari" || g.tur === "ortaklik" ? t.asgariTicariAnlasma : t.asgariAnlasma;
    const ucret = Math.max(toplam, asgari);
    return {
      yontem: "nispi" as const,
      ucret,
      nispi: toplam,
      asgari,
      asgariUygulandi: toplam < asgari,
      detay,
      arabulucuBasi: cokArabulucu ? ucret / g.arabulucuSayisi : ucret,
      tarafBasi: ucret / taraf,
      tarife,
      saatUcreti,
      saat,
    };
  }

  // Diğer hâller: birinci kısım (saatlik). Birden fazla arabulucuda her birine ayrı ödenir.
  const arabulucuBasi = saatUcreti * saat;
  const ucret = arabulucuBasi * Math.max(1, g.arabulucuSayisi);
  return {
    yontem: "saatlik" as const,
    ucret,
    nispi: null,
    asgari: null,
    asgariUygulandi: false,
    detay: [],
    arabulucuBasi,
    tarafBasi: ucret / taraf,
    tarife,
    saatUcreti,
    saat,
  };
}
