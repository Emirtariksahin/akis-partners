// Hesaplama araçlarının kullandığı yıllık parametreler.
// Canlı değerler Keystatic "Hesaplama Parametreleri" ekranından (content/ayarlar/hesaplama-parametreleri.yaml)
// okunur; buradaki VARSAYILAN_PARAMETRELER testlerde ve dosya okunamazsa yedek olarak kullanılır.

export type Dilim = { genislik: number | null; oranYuzde: number };

export type HesaplamaParametreleri = {
  guncelleme: string;
  asgariUcret: { brut: number; net: number };
  kidemTavanlari: { baslangic: string; bitis: string; tutar: number }[];
  kesintiler: {
    sgkIsciYuzde: number;
    issizlikIsciYuzde: number;
    damgaBinde: number;
    sgkTavanKati: number;
  };
  /** Ücret gelirleri için; `genislik` dilimin kendi genişliğidir, son dilimde null. */
  gelirVergisiDilimleri: Dilim[];
  harc: {
    basvurmaAsliye: number;
    basvurmaSulh: number;
    maktuKararIlam: number;
    nispiBinde: number;
    vekaletSuretHarci: number;
    baroPulu: number;
    kesifHarci: number;
    istinafBasvurma: number;
    temyizBasvurma: number;
  };
  giderAvansi: {
    sabitTutar: number;
    tebligatUcreti: number;
    tarafBasinaTebligat: number;
    tanikBasi: number;
    bilirkisiBasi: number;
  };
  aaut: {
    nispiDilimler: Dilim[];
    maktu: { kod: string; ad: string; tutar: number }[];
  };
  arabuluculuk: {
    saatlik: {
      tur: string;
      ad: string;
      ikiTarafKisiBasi: number;
      ucBesTaraf: number;
      altiOnTaraf: number;
      onbirUstuTaraf: number;
    }[];
    nispiDilimler: { genislik: number | null; tekYuzde: number; cokYuzde: number }[];
    asgariAnlasma: number;
    asgariTicariAnlasma: number;
    asgariSaat: number;
  };
  kiraTufe: { ay: string; oran: number }[];
  kaynaklar: { ad: string; url: string }[];
};

export const VARSAYILAN_PARAMETRELER: HesaplamaParametreleri = {
  guncelleme: "2026-09-28",
  asgariUcret: { brut: 33030, net: 28075.5 },
  kidemTavanlari: [
    { baslangic: "2025-01-01", bitis: "2025-06-30", tutar: 46655.43 },
    { baslangic: "2025-07-01", bitis: "2025-12-31", tutar: 53919.68 },
    { baslangic: "2026-01-01", bitis: "2026-06-30", tutar: 64948.77 },
    { baslangic: "2026-07-01", bitis: "2026-12-31", tutar: 73729.87 },
  ],
  kesintiler: { sgkIsciYuzde: 14, issizlikIsciYuzde: 1, damgaBinde: 7.59, sgkTavanKati: 9 },
  gelirVergisiDilimleri: [
    { genislik: 190000, oranYuzde: 15 },
    { genislik: 210000, oranYuzde: 20 },
    { genislik: 1100000, oranYuzde: 27 },
    { genislik: 3800000, oranYuzde: 35 },
    { genislik: null, oranYuzde: 40 },
  ],
  harc: {
    basvurmaAsliye: 732,
    basvurmaSulh: 335.2,
    maktuKararIlam: 732,
    nispiBinde: 68.31,
    vekaletSuretHarci: 104,
    baroPulu: 164,
    kesifHarci: 5188,
    istinafBasvurma: 2062,
    temyizBasvurma: 3608.5,
  },
  giderAvansi: {
    sabitTutar: 530,
    tebligatUcreti: 265,
    tarafBasinaTebligat: 5,
    tanikBasi: 1000,
    bilirkisiBasi: 5900,
  },
  aaut: {
    nispiDilimler: [
      { genislik: 600000, oranYuzde: 16 },
      { genislik: 600000, oranYuzde: 15 },
      { genislik: 1200000, oranYuzde: 14 },
      { genislik: 1200000, oranYuzde: 13 },
      { genislik: 1800000, oranYuzde: 11 },
      { genislik: 2400000, oranYuzde: 8 },
      { genislik: 3000000, oranYuzde: 5 },
      { genislik: 3600000, oranYuzde: 3 },
      { genislik: 4200000, oranYuzde: 2 },
      { genislik: null, oranYuzde: 1 },
    ],
    maktu: [
      { kod: "icra-dairesi", ad: "İcra dairelerinde yapılan takipler", tutar: 9000 },
      { kod: "tahliye-takibi", ad: "Tahliyeye ilişkin icra takipleri", tutar: 20000 },
      { kod: "icra-mahkemesi", ad: "İcra mahkemelerinde takip edilen işler", tutar: 11000 },
      { kod: "icra-mahkemesi-durusmali", ad: "İcra mahkemelerinde dava ve duruşmalı işler", tutar: 18000 },
      { kod: "sulh-hukuk", ad: "Sulh hukuk mahkemeleri", tutar: 30000 },
      { kod: "sulh-ceza", ad: "Sulh ceza ve infaz hâkimlikleri", tutar: 18000 },
      { kod: "asliye", ad: "Asliye mahkemeleri (hukuk, ceza, iş, aile, ticaret)", tutar: 45000 },
      { kod: "tuketici", ad: "Tüketici mahkemeleri", tutar: 22500 },
      { kod: "fikri-sinai", ad: "Fikri ve sınai haklar mahkemeleri", tutar: 55000 },
      { kod: "agir-ceza", ad: "Ağır ceza mahkemeleri", tutar: 65000 },
      { kod: "cocuk", ad: "Çocuk mahkemeleri", tutar: 45000 },
      { kod: "idare-durusmasiz", ad: "İdare ve vergi mahkemeleri (duruşmasız)", tutar: 30000 },
      { kod: "idare-durusmali", ad: "İdare ve vergi mahkemeleri (duruşmalı)", tutar: 40000 },
      { kod: "istinaf-durusmali", ad: "İstinaf – bir duruşmalı işler", tutar: 22000 },
    ],
  },
  arabuluculuk: {
    saatlik: [
      { tur: "aile", ad: "Aile hukuku", ikiTarafKisiBasi: 1000, ucBesTaraf: 2200, altiOnTaraf: 2300, onbirUstuTaraf: 2400 },
      { tur: "is", ad: "İşçi-işveren", ikiTarafKisiBasi: 1130, ucBesTaraf: 2460, altiOnTaraf: 2560, onbirUstuTaraf: 2660 },
      { tur: "ticari", ad: "Ticari", ikiTarafKisiBasi: 1500, ucBesTaraf: 3200, altiOnTaraf: 3300, onbirUstuTaraf: 3400 },
      { tur: "tuketici", ad: "Tüketici", ikiTarafKisiBasi: 1000, ucBesTaraf: 2200, altiOnTaraf: 2300, onbirUstuTaraf: 2400 },
      { tur: "kira", ad: "Kira, komşu hakkı, kat mülkiyeti", ikiTarafKisiBasi: 1170, ucBesTaraf: 2540, altiOnTaraf: 2640, onbirUstuTaraf: 2740 },
      { tur: "ortaklik", ad: "Ortaklığın giderilmesi", ikiTarafKisiBasi: 1170, ucBesTaraf: 2540, altiOnTaraf: 2640, onbirUstuTaraf: 2740 },
      { tur: "diger", ad: "Diğer uyuşmazlıklar", ikiTarafKisiBasi: 1000, ucBesTaraf: 2200, altiOnTaraf: 2300, onbirUstuTaraf: 2400 },
    ],
    nispiDilimler: [
      { genislik: 600000, tekYuzde: 6, cokYuzde: 9 },
      { genislik: 960000, tekYuzde: 5, cokYuzde: 7.5 },
      { genislik: 1560000, tekYuzde: 4, cokYuzde: 6 },
      { genislik: 3120000, tekYuzde: 3, cokYuzde: 4.5 },
      { genislik: 9360000, tekYuzde: 2, cokYuzde: 3 },
      { genislik: 12480000, tekYuzde: 1.5, cokYuzde: 2.5 },
      { genislik: 24960000, tekYuzde: 1, cokYuzde: 1.5 },
      { genislik: null, tekYuzde: 0.5, cokYuzde: 1 },
    ],
    asgariAnlasma: 9000,
    asgariTicariAnlasma: 13000,
    asgariSaat: 2,
  },
  kiraTufe: [
    { ay: "2025-10", oran: 38.36 },
    { ay: "2025-11", oran: 37.15 },
    { ay: "2025-12", oran: 35.91 },
    { ay: "2026-01", oran: 34.88 },
    { ay: "2026-02", oran: 33.98 },
    { ay: "2026-03", oran: 33.39 },
    { ay: "2026-04", oran: 32.82 },
    { ay: "2026-05", oran: 32.43 },
    { ay: "2026-06", oran: 32.24 },
    { ay: "2026-07", oran: 32.03 },
    { ay: "2026-08", oran: 31.9 },
    { ay: "2026-09", oran: 31.79 },
  ],
  kaynaklar: [
    { ad: "Avukatlık Asgari Ücret Tarifesi 2025-2026 (RG 04.11.2025/33067)", url: "https://d.barobirlik.org.tr/2025/20251103_tbbtablo_karsilastirmacetveli.pdf" },
    { ad: "2026 Yılı Arabuluculuk Asgari Ücret Tarifesi (RG 26.12.2025/33119)", url: "https://www.resmigazete.gov.tr/eskiler/2025/12/20251226-3.htm" },
    { ad: "ÇSGB – 2026 asgari ücret", url: "https://www.csgb.gov.tr/Media/gm2fekds/asgari-%C3%BCcret-2026.pdf" },
    { ad: "GİB – 2026 gelir vergisi tarifesi", url: "https://cdn.gib.gov.tr/api/gibportal-file/file/getFileResources?objectKey=arsiv%2Fyardim-kaynaklar%2Fyararli-bilgiler%2Fgelir-vergisi-tarifeleri%2Fgelir-vergisi-tarifesi-2026.pdf" },
    { ad: "TÜİK – Tüketici Fiyat Endeksi bültenleri", url: "https://data.tuik.gov.tr/Kategori/GetKategori?p=enflasyon-ve-fiyat-106" },
  ],
};
