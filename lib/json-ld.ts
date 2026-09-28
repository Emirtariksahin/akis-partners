import type { SiteAyarlari } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

// Yapılandırılmış veri (schema.org). Yalnızca olgusal bilgiler içerir; değerlendirme/puan gibi
// reklam niteliği taşıyabilecek alanlar bilinçli olarak eklenmemiştir.

export function legalServiceJsonLd(ayarlar: SiteAyarlari) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: ayarlar.unvan,
    url: SITE_URL,
    logo: `${SITE_URL}/akislogo.png`,
    image: `${SITE_URL}/akislogo.png`,
    ...(ayarlar.telefonLink && { telephone: ayarlar.telefonLink }),
    ...(ayarlar.eposta && { email: ayarlar.eposta }),
    address: {
      "@type": "PostalAddress",
      streetAddress: ayarlar.adres.replace(/\n/g, ", "),
      addressLocality: "Ankara",
      addressCountry: "TR",
    },
    areaServed: "TR",
  };
}

export function breadcrumbJsonLd(adimlar: { ad: string; yol: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: adimlar.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.ad,
      item: `${SITE_URL}${a.yol}`,
    })),
  };
}
