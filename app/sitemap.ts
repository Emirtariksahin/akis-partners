import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getEkip, getFaaliyetAlanlari, getKtkMaddeleri, getMakaleler } from "@/lib/content";
import { HESAPLAMA_ARACLARI, REHBERLER, aracHref } from "@/lib/taxonomy";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [alanlar, ekip, makaleler, ktk] = await Promise.all([
    getFaaliyetAlanlari(),
    getEkip(),
    getMakaleler(),
    getKtkMaddeleri(),
  ]);

  const statik = [
    "/",
    "/kurumsal",
    "/ekibimiz",
    "/faaliyet-alanlari",
    "/hukuki-araclar",
    "/makaleler",
    "/iletisim",
    "/yasal-uyari",
    "/kvkk-aydinlatma-metni",
    "/gizlilik-politikasi",
    "/cerez-politikasi",
  ];

  const yollar = [
    ...statik.map((yol) => ({ yol })),
    ...alanlar.map((a) => ({ yol: `/faaliyet-alanlari/${a.slug}` })),
    ...ekip.map((u) => ({ yol: `/ekibimiz/${u.slug}` })),
    ...makaleler.map((m) => ({ yol: `/makaleler/${m.slug}`, tarih: m.tarih })),
    ...HESAPLAMA_ARACLARI.map((a) => ({ yol: aracHref(a.slug) })),
    ...REHBERLER.map((r) => ({ yol: aracHref(r.slug) })),
    ...ktk.map((k) => ({ yol: `${aracHref("trafik-kusur-ve-ceza-rehberi")}/${k.slug}` })),
  ];

  return yollar.map(({ yol, tarih }: { yol: string; tarih?: string | null }) => ({
    url: `${SITE_URL}${yol === "/" ? "" : yol}`,
    ...(tarih && { lastModified: tarih }),
  }));
}
