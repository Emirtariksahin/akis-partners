import { HeroSection } from "@/components/home/HeroSection";
import { FirmIntro } from "@/components/home/FirmIntro";
import { ExpertiseSection } from "@/components/home/ExpertiseSection";
import { WhyAkisSection } from "@/components/home/WhyAkisSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ToolsSection } from "@/components/home/ToolsSection";
import { FeaturedArticlesSection } from "@/components/home/FeaturedArticles";
import { ContactCTASection } from "@/components/home/ContactCTASection";
import { JsonLd } from "@/components/site/JsonLd";
import { getFaaliyetAlanlari, getMakaleler, getSiteAyarlari } from "@/lib/content";
import { FAALIYET_KATEGORILERI } from "@/lib/taxonomy";
import { legalServiceJsonLd } from "@/lib/json-ld";

export default async function Home() {
  const [alanlar, makaleler, ayarlar] = await Promise.all([getFaaliyetAlanlari(), getMakaleler(), getSiteAyarlari()]);

  const kategoriler = FAALIYET_KATEGORILERI.map((k, i) => {
    const kategoriAlanlari = alanlar.filter((a) => a.kategori === k.value);
    return {
      id: String(i + 1).padStart(2, "0"),
      value: k.value,
      title: k.label,
      alanlar: kategoriAlanlari.map((a) => ({ slug: a.slug, baslik: a.baslik })),
    };
  }).filter((k) => k.alanlar.length > 0);

  const oneCikanMakaleler = makaleler.slice(0, 3).map((m) => ({
    slug: m.slug,
    baslik: m.baslik,
    tarih: m.tarih,
    ozet: m.ozet,
    kapak: m.kapak,
    alan: alanlar.find((a) => a.slug === m.faaliyetAlani)?.baslik ?? null,
  }));

  return (
    <>
      <JsonLd data={legalServiceJsonLd(ayarlar)} />
      <HeroSection />
      <FirmIntro />
      <ExpertiseSection kategoriler={kategoriler} toplamAlan={alanlar.length} />
      <WhyAkisSection />
      <ProcessSection />
      <ToolsSection />
      {oneCikanMakaleler.length > 0 && <FeaturedArticlesSection makaleler={oneCikanMakaleler} />}
      <ContactCTASection />
    </>
  );
}
