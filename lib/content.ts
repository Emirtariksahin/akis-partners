import "server-only";
import { cache } from "react";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "@/keystatic.config";
import { FAALIYET_KATEGORILERI } from "@/lib/taxonomy";
import { VARSAYILAN_PARAMETRELER, type HesaplamaParametreleri } from "@/lib/calculators/params";

export const reader = createReader(process.cwd(), keystaticConfig);

export type SiteAyarlari = NonNullable<Awaited<ReturnType<typeof reader.singletons.siteAyarlari.read>>>;

const BOS_AYARLAR: SiteAyarlari = {
  unvan: "Akış Partners Hukuk & Danışmanlık",
  telefon: "",
  telefonLink: "",
  whatsapp: "",
  eposta: "",
  adres: "",
  adresKisa: "",
  haritaSorgusu: "",
  calismaSaatleri: "",
  sosyal: { linkedin: null, instagram: null, x: null },
  duyuru: { aktif: false, metin: "" },
};

export const getSiteAyarlari = cache(async (): Promise<SiteAyarlari> => {
  return (await reader.singletons.siteAyarlari.read()) ?? BOS_AYARLAR;
});

/** Keystatic'teki boş (null) dilim genişliklerini "sınırsız" olarak korur, eksik alanları varsayılanla tamamlar. */
export const getHesaplamaParametreleri = cache(async (): Promise<HesaplamaParametreleri> => {
  const kayit = await reader.singletons.hesaplamaParametreleri.read();
  if (!kayit) return VARSAYILAN_PARAMETRELER;
  return {
    ...VARSAYILAN_PARAMETRELER,
    ...kayit,
    guncelleme: kayit.guncelleme ?? VARSAYILAN_PARAMETRELER.guncelleme,
    kaynaklar: kayit.kaynaklar.map((k) => ({ ad: k.ad, url: k.url ?? "" })),
  } as HesaplamaParametreleri;
});

const kategoriSirasi = (value: string) => FAALIYET_KATEGORILERI.findIndex((k) => k.value === value);

export const getFaaliyetAlanlari = cache(async () => {
  const hepsi = await reader.collections.faaliyetAlanlari.all();
  return hepsi
    .map(({ slug, entry }) => ({ slug, ...entry }))
    .sort((a, b) => kategoriSirasi(a.kategori) - kategoriSirasi(b.kategori) || (a.sira ?? 0) - (b.sira ?? 0) || a.baslik.localeCompare(b.baslik, "tr"));
});

export type FaaliyetAlaniOzet = Awaited<ReturnType<typeof getFaaliyetAlanlari>>[number];

export const getFaaliyetAlani = cache(async (slug: string) => {
  const entry = await reader.collections.faaliyetAlanlari.read(slug, { resolveLinkedFiles: true });
  return entry ? { slug, ...entry } : null;
});

export const getEkip = cache(async () => {
  const hepsi = await reader.collections.ekip.all();
  return hepsi.map(({ slug, entry }) => ({ slug, ...entry })).sort((a, b) => (a.sira ?? 0) - (b.sira ?? 0));
});

export type EkipUyesiOzet = Awaited<ReturnType<typeof getEkip>>[number];

export const getEkipUyesi = cache(async (slug: string) => {
  const entry = await reader.collections.ekip.read(slug, { resolveLinkedFiles: true });
  return entry ? { slug, ...entry } : null;
});

export const getMakaleler = cache(async () => {
  const hepsi = await reader.collections.makaleler.all();
  return hepsi
    .map(({ slug, entry }) => ({ slug, ...entry }))
    .filter((m) => m.yayinda)
    .sort((a, b) => (b.tarih ?? "").localeCompare(a.tarih ?? ""));
});

export type MakaleOzet = Awaited<ReturnType<typeof getMakaleler>>[number];

export const getMakale = cache(async (slug: string) => {
  const entry = await reader.collections.makaleler.read(slug, { resolveLinkedFiles: true });
  return entry && entry.yayinda ? { slug, ...entry } : null;
});

export const getKtkMaddeleri = cache(async () => {
  const hepsi = await reader.collections.ktkMaddeleri.all();
  const sayisal = (madde: string) => madde.split(/[^0-9]+/).filter(Boolean).map(Number);
  return hepsi
    .map(({ slug, entry }) => ({ slug, ...entry }))
    .sort((a, b) => {
      const x = sayisal(a.madde);
      const y = sayisal(b.madde);
      for (let i = 0; i < Math.max(x.length, y.length); i++) {
        if ((x[i] ?? -1) !== (y[i] ?? -1)) return (x[i] ?? -1) - (y[i] ?? -1);
      }
      return a.madde.localeCompare(b.madde, "tr");
    });
});

export type KtkMaddesiOzet = Awaited<ReturnType<typeof getKtkMaddeleri>>[number];

export const getKtkMaddesi = cache(async (slug: string) => {
  const entry = await reader.collections.ktkMaddeleri.read(slug, { resolveLinkedFiles: true });
  return entry ? { slug, ...entry } : null;
});

export const getYasalSayfa = cache(async (slug: string) => {
  const entry = await reader.collections.yasalSayfalar.read(slug, { resolveLinkedFiles: true });
  return entry ? { slug, ...entry } : null;
});
