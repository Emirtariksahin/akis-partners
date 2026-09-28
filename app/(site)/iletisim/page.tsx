import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock, Navigation } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactForm } from "@/components/site/ContactForm";
import { JsonLd } from "@/components/site/JsonLd";
import { getSiteAyarlari } from "@/lib/content";
import { legalServiceJsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Akış Partners Hukuk & Danışmanlık iletişim bilgileri ve iletişim formu.",
  alternates: { canonical: "/iletisim" },
};

function Blok({ baslik, Icon, children }: { baslik: string; Icon: typeof Mail; children: React.ReactNode }) {
  return (
    <div className="flex gap-5">
      <Icon className="w-5 h-5 text-accent shrink-0 mt-1" />
      <div>
        <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-3">{baslik}</h2>
        {children}
      </div>
    </div>
  );
}

export default async function IletisimPage() {
  const ayarlar = await getSiteAyarlari();
  const yolTarifi = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ayarlar.haritaSorgusu)}`;

  return (
    <div className="pt-48 md:pt-64 pb-32 bg-background">
      <JsonLd data={legalServiceJsonLd(ayarlar)} />
      <div className="container mx-auto px-6 md:px-12">
        <Breadcrumbs adimlar={[{ ad: "İletişim", yol: "/iletisim" }]} />
        <PageHeader eyebrow="İletişim" title="Hukuki sürecinizi konuşalım." />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-5 flex flex-col gap-10" data-no-attribution>
            {ayarlar.adres && (
              <Blok baslik="Adres" Icon={MapPin}>
                <p className="font-serif text-2xl leading-relaxed whitespace-pre-line mb-3">{ayarlar.adres}</p>
                {ayarlar.haritaSorgusu && (
                  <a
                    href={yolTarifi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase hover:text-accent transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Yol tarifi al
                  </a>
                )}
              </Blok>
            )}
            {ayarlar.telefon && (
              <Blok baslik="Telefon" Icon={Phone}>
                <a href={`tel:${ayarlar.telefonLink}`} className="block font-serif text-2xl hover:text-accent transition-colors">
                  {ayarlar.telefon}
                </a>
              </Blok>
            )}
            {ayarlar.eposta && (
              <Blok baslik="E-posta" Icon={Mail}>
                <a href={`mailto:${ayarlar.eposta}`} className="block font-serif text-2xl hover:text-accent transition-colors break-all">
                  {ayarlar.eposta}
                </a>
              </Blok>
            )}
            {ayarlar.calismaSaatleri && (
              <Blok baslik="Çalışma saatleri" Icon={Clock}>
                <p className="font-serif text-2xl leading-relaxed whitespace-pre-line">{ayarlar.calismaSaatleri}</p>
              </Blok>
            )}
            <p className="font-sans text-xs opacity-55 leading-relaxed border-t border-border pt-6">
              Ofis konumumuzu sayfanın en altındaki haritada görebilirsiniz. Görüşmeler randevu ile yapılmaktadır.
            </p>
          </div>

          <div className="lg:col-span-7 relative">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
