import type { HesaplamaParametreleri } from "../params";
import { dilimliHesap } from "./money";

// Ücret gelirleri için aylık bordro hesabı (işçi tarafı).
// Asgari ücret istisnası (GVK m.23/18 ve DVK) kümülatif olarak uygulanır.

type Parametreler = Pick<HesaplamaParametreleri, "asgariUcret" | "kesintiler" | "gelirVergisiDilimleri">;

function gvDilimleri(p: Parametreler) {
  return p.gelirVergisiDilimleri.map((d) => ({ genislik: d.genislik, oran: d.oranYuzde }));
}

/** Kümülatif matrahtaki artış için ödenecek gelir vergisi. */
export function kumulatifGelirVergisi(oncekiMatrah: number, buAyMatrah: number, p: Parametreler) {
  const dilimler = gvDilimleri(p);
  return dilimliHesap(oncekiMatrah + buAyMatrah, dilimler).toplam - dilimliHesap(oncekiMatrah, dilimler).toplam;
}

export function sgkTavani(p: Parametreler) {
  return p.asgariUcret.brut * p.kesintiler.sgkTavanKati;
}

export type BordroSonucu = {
  brut: number;
  sgk: number;
  issizlik: number;
  gvMatrahi: number;
  gelirVergisi: number;
  gvIstisnasi: number;
  damga: number;
  damgaIstisnasi: number;
  net: number;
};

/**
 * `ay` (1-12) için bordro. Yılbaşından itibaren her ay aynı brüt ücretin ödendiği varsayılır;
 * farklıysa `oncekiKumulatifMatrah` verilebilir.
 */
export function bruttenNete(brut: number, ay: number, p: Parametreler, oncekiKumulatifMatrah?: number): BordroSonucu {
  const primeEsas = Math.min(brut, sgkTavani(p));
  const sgk = (primeEsas * p.kesintiler.sgkIsciYuzde) / 100;
  const issizlik = (primeEsas * p.kesintiler.issizlikIsciYuzde) / 100;
  const gvMatrahi = brut - sgk - issizlik;
  const onceki = oncekiKumulatifMatrah ?? gvMatrahi * (ay - 1);
  const hamGv = kumulatifGelirVergisi(onceki, gvMatrahi, p);

  // Asgari ücretin vergisi kadar istisna (asgari ücretliye göre kümülatif)
  const auBrut = p.asgariUcret.brut;
  const auMatrah = auBrut * (1 - (p.kesintiler.sgkIsciYuzde + p.kesintiler.issizlikIsciYuzde) / 100);
  const gvIstisnasi = Math.min(hamGv, kumulatifGelirVergisi(auMatrah * (ay - 1), auMatrah, p));
  const gelirVergisi = hamGv - gvIstisnasi;

  const hamDamga = (brut * p.kesintiler.damgaBinde) / 1000;
  const damgaIstisnasi = Math.min(hamDamga, (auBrut * p.kesintiler.damgaBinde) / 1000);
  const damga = hamDamga - damgaIstisnasi;

  return {
    brut,
    sgk,
    issizlik,
    gvMatrahi,
    gelirVergisi,
    gvIstisnasi,
    damga,
    damgaIstisnasi,
    net: brut - sgk - issizlik - gelirVergisi - damga,
  };
}

/** Hedef net ücreti veren brüt ücreti ikili arama ile bulur (kuruş hassasiyeti). */
export function nettenBrute(net: number, ay: number, p: Parametreler): BordroSonucu {
  let alt = net;
  let ust = net * 2 + 1000;
  while (bruttenNete(ust, ay, p).net < net) ust *= 2;
  for (let i = 0; i < 100 && ust - alt > 0.001; i++) {
    const orta = (alt + ust) / 2;
    if (bruttenNete(orta, ay, p).net < net) alt = orta;
    else ust = orta;
  }
  return bruttenNete(Math.round(ust * 100) / 100, ay, p);
}

/**
 * Tazminat ve ek ödemelerde (ihbar, izin, fazla mesai vb.) basit kesinti hesabı:
 * kullanıcının seçtiği gelir vergisi oranı düz uygulanır, istisna uygulanmaz.
 */
export function basitKesinti(
  brut: number,
  secenek: { sgk: boolean; gvOraniYuzde: number },
  p: Pick<HesaplamaParametreleri, "kesintiler">,
) {
  const sgk = secenek.sgk ? (brut * p.kesintiler.sgkIsciYuzde) / 100 : 0;
  const issizlik = secenek.sgk ? (brut * p.kesintiler.issizlikIsciYuzde) / 100 : 0;
  const gelirVergisi = ((brut - sgk - issizlik) * secenek.gvOraniYuzde) / 100;
  const damga = (brut * p.kesintiler.damgaBinde) / 1000;
  return { sgk, issizlik, gelirVergisi, damga, net: brut - sgk - issizlik - gelirVergisi - damga };
}
