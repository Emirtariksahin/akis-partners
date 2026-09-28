// Sitenin sabit sınıflandırmaları. Keystatic config'i ve sayfalar tarafından ortak kullanılır,
// bu yüzden bu dosya yalnızca saf veri içermelidir (React/Node bağımlılığı yok).

export const FAALIYET_KATEGORILERI = [
  { value: "kurumsal-ticari", label: "Kurumsal & Ticari" },
  { value: "uyusmazlik-dava", label: "Uyuşmazlık & Dava" },
  { value: "bireysel", label: "Bireysel Hukuk" },
  { value: "tazminat-sigorta", label: "Tazminat & Sigorta" },
  { value: "ceza-bilisim", label: "Ceza & Bilişim" },
] as const;

export type FaaliyetKategori = (typeof FAALIYET_KATEGORILERI)[number]["value"];

export function kategoriEtiketi(value: string) {
  return FAALIYET_KATEGORILERI.find((k) => k.value === value)?.label ?? value;
}

export const ARAC_KATEGORILERI = [
  { value: "is-hukuku", label: "İş Hukuku" },
  { value: "yargilama", label: "Yargılama Giderleri" },
  { value: "ceza", label: "Ceza İnfaz" },
  { value: "tazminat", label: "Tazminat" },
  { value: "diger", label: "Kira & Diğer" },
] as const;

export type AracKategori = (typeof ARAC_KATEGORILERI)[number]["value"];

export type Arac = {
  slug: string;
  baslik: string;
  kategori: AracKategori;
  ozet: string;
  /** Sonucun avukat kontrolünden geçmesi gereken, varsayıma dayalı araçlar. */
  tahmini?: boolean;
};

export const HESAPLAMA_ARACLARI: Arac[] = [
  {
    slug: "kidem-ve-ihbar-tazminati-hesaplama",
    baslik: "Kıdem ve İhbar Tazminatı",
    kategori: "is-hukuku",
    ozet: "Kıdem tavanı, ihbar süresi, gelir ve damga vergisi kesintileriyle brüt ve net tutarlar.",
  },
  {
    slug: "yillik-izin-ucreti-hesaplama",
    baslik: "Yıllık İzin Süresi ve Ücreti",
    kategori: "is-hukuku",
    ozet: "Hizmet süresine ve yaşa göre izin günü ile kullanılmayan izin ücreti.",
  },
  {
    slug: "fazla-mesai-ucreti-hesaplama",
    baslik: "Fazla Mesai Ücreti",
    kategori: "is-hukuku",
    ozet: "Saatlik ücretin %50 zamlı hesabı ve yasal kesintilerle net fazla çalışma ücreti.",
  },
  {
    slug: "ubgt-ucreti-hesaplama",
    baslik: "UBGT Ücreti",
    kategori: "is-hukuku",
    ozet: "Ulusal bayram ve genel tatil günlerinde çalışma karşılığı ücret.",
  },
  {
    slug: "netten-brute-brutten-nete-hesaplama",
    baslik: "Netten Brüte / Brütten Nete",
    kategori: "is-hukuku",
    ozet: "Güncel vergi dilimleri ve asgari ücret istisnasıyla aylık maaş dönüşümü.",
  },
  {
    slug: "kira-artis-orani-hesaplama",
    baslik: "Kira Artış Oranı",
    kategori: "diger",
    ozet: "TÜFE 12 aylık ortalamasına göre yasal üst sınır ve yeni kira bedeli.",
  },
  {
    slug: "mahkeme-harc-ve-gider-hesaplama",
    baslik: "Mahkeme Harç ve Gider",
    kategori: "yargilama",
    ozet: "Dava açılışında ödenecek harçlar ve gider avansının kalem kalem dökümü.",
  },
  {
    slug: "islah-harci-hesaplama",
    baslik: "Islah Harcı",
    kategori: "yargilama",
    ozet: "Islahla artırılan miktar üzerinden peşin alınacak nispi harç.",
  },
  {
    slug: "vekalet-ucreti-hesaplama",
    baslik: "Vekalet Ücreti",
    kategori: "yargilama",
    ozet: "Avukatlık Asgari Ücret Tarifesine göre nispi ve maktu vekalet ücreti.",
  },
  {
    slug: "arabuluculuk-ucreti-hesaplama",
    baslik: "Arabuluculuk Ücreti",
    kategori: "yargilama",
    ozet: "Arabuluculuk Asgari Ücret Tarifesine göre saatlik ve nispi ücret.",
  },
  {
    slug: "infaz-yatar-hesaplama",
    baslik: "İnfaz (Yatar) Hesaplama",
    kategori: "ceza",
    ozet: "Koşullu salıverilme, denetimli serbestlik ve açık cezaevine geçiş tarihleri.",
    tahmini: true,
  },
  {
    slug: "trafik-kazasi-tazminati-hesaplama",
    baslik: "Trafik Kazası Tazminatı",
    kategori: "tazminat",
    ozet: "Sürekli iş göremezlik (maluliyet) tazminatının aktüeryal tahmini.",
    tahmini: true,
  },
  {
    slug: "is-kazasi-tazminati-hesaplama",
    baslik: "İş Kazası Tazminatı",
    kategori: "tazminat",
    ozet: "İş kazasına bağlı maluliyette maddi tazminatın aktüeryal tahmini.",
    tahmini: true,
  },
];

export const REHBERLER = [
  {
    slug: "trafik-kusur-ve-ceza-rehberi",
    baslik: "Trafik Kusur ve Ceza Rehberi",
    ozet: "Karayolları Trafik Kanunu ihlallerinde kusur niteliği, ceza tutarı ve ceza puanı.",
  },
  {
    slug: "adliye-cezaevi-telefon-rehberi",
    baslik: "Adliye ve Cezaevi Telefon Rehberi",
    ozet: "Türkiye genelindeki adliye ve ceza infaz kurumlarının iletişim bilgileri.",
  },
] as const;

/** Keystatic'te "ilgili araçlar" seçimi için tek liste. */
export const TUM_ARACLAR_SECENEKLERI = [
  ...HESAPLAMA_ARACLARI.map((a) => ({ value: a.slug, label: a.baslik })),
  ...REHBERLER.map((r) => ({ value: r.slug, label: r.baslik })),
];

export function aracHref(slug: string) {
  return `/hukuki-araclar/${slug}`;
}

export function aracBaslik(slug: string) {
  return TUM_ARACLAR_SECENEKLERI.find((a) => a.value === slug)?.label ?? slug;
}

export const KTK_GRUPLARI = [
  { value: "hiz", label: "Hız ve Takip Mesafesi" },
  { value: "serit", label: "Şerit ve Yön" },
  { value: "gecme", label: "Geçme ve Sollama" },
  { value: "kavsak", label: "Kavşak ve Geçiş Önceliği" },
  { value: "isaret", label: "Işık ve İşaretler" },
  { value: "duraklama", label: "Duraklama ve Park" },
  { value: "yaya", label: "Yaya ve Okul Geçitleri" },
  { value: "diger", label: "Diğer Kurallar" },
] as const;
