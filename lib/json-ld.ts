import type { EkipUyesiOzet, SiteAyarlari } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

// Yapılandırılmış veri (schema.org). Yalnızca olgusal bilgiler içerir; değerlendirme/puan gibi
// reklam niteliği taşıyabilecek alanlar bilinçli olarak eklenmemiştir.

/** Büro varlığının sabit kimliği; kişi ve makale verileri bu kimliğe bağlanır. */
const BURO_ID = `${SITE_URL}/#buro`;

const mutlak = (yol: string) => (yol.startsWith("http") ? yol : `${SITE_URL}${yol}`);

/** "…\nYenimahalle / Ankara" biçimindeki açık adresi sokak, ilçe ve il olarak ayırır. */
function adresParcala(adres: string) {
  const satirlar = adres.split("\n").map((s) => s.trim()).filter(Boolean);
  const [ilce, il] = (satirlar.at(-1) ?? "").split("/").map((s) => s.trim());
  if (satirlar.length < 2 || !il) return { streetAddress: satirlar.join(", "), addressLocality: "Ankara" };
  return { streetAddress: satirlar.slice(0, -1).join(", "), addressLocality: ilce, addressRegion: il };
}

/** "Pazartesi – Cuma / 09:00 – 18:00" biçimindeki çalışma saatlerini schema.org'a çevirir; tanınmazsa boş döner. */
function calismaSaatleri(metin: string) {
  const saat = metin.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/);
  if (!saat || !/pazartesi/i.test(metin) || !/cuma/i.test(metin)) return undefined;
  return [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: saat[1].padStart(5, "0"),
      closes: saat[2].padStart(5, "0"),
    },
  ];
}

export function legalServiceJsonLd(ayarlar: SiteAyarlari, ekip: EkipUyesiOzet[] = []) {
  const sameAs = Object.values(ayarlar.sosyal ?? {}).filter((u): u is string => !!u);
  const saatler = calismaSaatleri(ayarlar.calismaSaatleri);
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": BURO_ID,
    name: ayarlar.unvan,
    url: SITE_URL,
    logo: `${SITE_URL}/akislogo.png`,
    image: `${SITE_URL}/akislogo.png`,
    ...(ayarlar.telefonLink && { telephone: ayarlar.telefonLink }),
    ...(ayarlar.eposta && { email: ayarlar.eposta }),
    address: { "@type": "PostalAddress", ...adresParcala(ayarlar.adres), addressCountry: "TR" },
    ...(saatler && { openingHoursSpecification: saatler }),
    ...(sameAs.length > 0 && { sameAs }),
    ...(ekip.length > 0 && {
      employee: ekip.map((u) => ({
        "@type": "Person",
        name: `Av. ${u.ad}`,
        jobTitle: u.unvan,
        url: `${SITE_URL}/ekibimiz/${u.slug}`,
      })),
    }),
    areaServed: "TR",
  };
}

type KisiBilgisi = Pick<EkipUyesiOzet, "slug" | "ad" | "unvan" | "foto" | "eposta" | "egitim" | "linkedin">;

export function personJsonLd(uye: KisiBilgisi) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: `Av. ${uye.ad}`,
    jobTitle: uye.unvan,
    url: `${SITE_URL}/ekibimiz/${uye.slug}`,
    ...(uye.foto && { image: mutlak(uye.foto) }),
    ...(uye.eposta && { email: uye.eposta }),
    ...(uye.egitim.length > 0 && {
      alumniOf: uye.egitim.map((e) => ({ "@type": "EducationalOrganization", name: e })),
    }),
    ...(uye.linkedin && { sameAs: [uye.linkedin] }),
    worksFor: { "@id": BURO_ID },
  };
}

export function articleJsonLd(makale: {
  slug: string;
  baslik: string;
  ozet: string;
  tarih: string | null;
  kapak: string | null;
  yazar: { slug: string; ad: string } | null;
  unvan: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: makale.baslik,
    description: makale.ozet,
    url: `${SITE_URL}/makaleler/${makale.slug}`,
    mainEntityOfPage: `${SITE_URL}/makaleler/${makale.slug}`,
    ...(makale.tarih && { datePublished: makale.tarih }),
    image: makale.kapak ? mutlak(makale.kapak) : `${SITE_URL}/opengraph-image`,
    ...(makale.yazar && {
      author: { "@type": "Person", name: `Av. ${makale.yazar.ad}`, url: `${SITE_URL}/ekibimiz/${makale.yazar.slug}` },
    }),
    publisher: {
      "@type": "Organization",
      "@id": BURO_ID,
      name: makale.unvan,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/akislogo.png` },
    },
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
