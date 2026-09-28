import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Calculator, Phone } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { FadeIn } from "@/components/site/FadeIn";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ARAC_KATEGORILERI, HESAPLAMA_ARACLARI, REHBERLER, aracHref } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "Hukuki Araçlar",
  description:
    "Kıdem, ihbar, vekalet ücreti, harç, kira artışı, infaz ve tazminat hesaplama araçları; trafik kusur rehberi ile adliye ve cezaevi telefon rehberi.",
  alternates: { canonical: "/hukuki-araclar" },
};

const REHBER_IKONLARI = { "trafik-kusur-ve-ceza-rehberi": BookOpen, "adliye-cezaevi-telefon-rehberi": Phone } as const;

export default function HukukiAraclarPage() {
  return (
    <div className="pt-48 md:pt-64 pb-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <Breadcrumbs adimlar={[{ ad: "Hukuki Araçlar", yol: "/hukuki-araclar" }]} />
        <PageHeader
          eyebrow="Hukuki Araçlar"
          title="Hesaplama araçları ve rehberler"
          lead="Sık karşılaşılan hukuki hesaplamalar için ön bilgi edinebileceğiniz araçlar. Sonuçlar tahminidir ve hukuki görüş niteliği taşımaz."
        />

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          {REHBERLER.map((r) => {
            const Icon = REHBER_IKONLARI[r.slug];
            return (
              <FadeIn key={r.slug}>
                <Link
                  href={aracHref(r.slug)}
                  className="group flex items-start gap-6 p-8 md:p-10 bg-foreground text-background hover:bg-foreground/95 transition-colors h-full"
                >
                  <Icon className="w-7 h-7 text-accent shrink-0 mt-1" />
                  <div>
                    <p className="font-sans text-[10px] tracking-widest uppercase text-accent mb-2">Rehber</p>
                    <h2 className="font-serif text-3xl mb-3 group-hover:text-accent transition-colors">{r.baslik}</h2>
                    <p className="font-sans text-sm opacity-70 leading-relaxed">{r.ozet}</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 ml-auto shrink-0 opacity-60 group-hover:opacity-100 group-hover:text-accent transition-all" />
                </Link>
              </FadeIn>
            );
          })}
        </section>

        <div className="flex flex-col gap-20">
          {ARAC_KATEGORILERI.map((k) => {
            const araclar = HESAPLAMA_ARACLARI.filter((a) => a.kategori === k.value);
            if (!araclar.length) return null;
            return (
              <section key={k.value} id={k.value} className="scroll-mt-32">
                <FadeIn className="flex items-baseline justify-between gap-6 mb-8 border-b border-border pb-5">
                  <h2 className="font-serif text-3xl md:text-4xl tracking-tight">{k.label}</h2>
                  <span className="font-sans text-xs tracking-widest uppercase opacity-50">{araclar.length} araç</span>
                </FadeIn>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
                  {araclar.map((a, i) => (
                    <FadeIn key={a.slug} delay={i * 0.05} className="bg-background">
                      <Link href={aracHref(a.slug)} className="group flex flex-col h-full p-8 hover:bg-surface transition-colors">
                        <div className="flex items-center justify-between mb-6">
                          <Calculator className="w-5 h-5 text-accent" />
                          {a.tahmini && (
                            <span className="font-sans text-[10px] tracking-widest uppercase border border-accent/50 text-accent px-2 py-0.5">Tahmini</span>
                          )}
                        </div>
                        <h3 className="font-serif text-2xl mb-3 group-hover:text-accent transition-colors">{a.baslik}</h3>
                        <p className="font-sans text-sm opacity-65 leading-relaxed">{a.ozet}</p>
                      </Link>
                    </FadeIn>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
