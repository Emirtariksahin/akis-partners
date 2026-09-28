import Link from "next/link";
import { ArrowUpRight, Calculator, BookOpen, Phone } from "lucide-react";
import { FadeIn } from "@/components/site/FadeIn";
import { HESAPLAMA_ARACLARI, REHBERLER, aracHref } from "@/lib/taxonomy";

const ONE_CIKAN = [
  "kidem-ve-ihbar-tazminati-hesaplama",
  "infaz-yatar-hesaplama",
  "vekalet-ucreti-hesaplama",
  "kira-artis-orani-hesaplama",
  "mahkeme-harc-ve-gider-hesaplama",
  "trafik-kazasi-tazminati-hesaplama",
];

export function ToolsSection() {
  const araclar = ONE_CIKAN.map((slug) => HESAPLAMA_ARACLARI.find((a) => a.slug === slug)!).filter(Boolean);
  const [kusurRehberi, telefonRehberi] = REHBERLER;

  return (
    <section className="py-24 md:py-40 px-6 md:px-12 bg-background">
      <div className="container mx-auto">
        <FadeIn className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-4">Hukuki Araçlar</h2>
            <h3 className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] tracking-tight">
              Hesaplamalar ve rehberlerle <span className="italic text-accent">ön bilgi</span> edinin.
            </h3>
          </div>
          <Link
            href="/hukuki-araclar"
            className="group flex items-center gap-2 font-sans text-xs uppercase tracking-widest hover:text-accent transition-colors shrink-0"
          >
            {HESAPLAMA_ARACLARI.length} hesaplama aracı <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border mb-8">
          {araclar.map((a, i) => (
            <FadeIn key={a.slug} delay={i * 0.05} className="bg-background">
              <Link href={aracHref(a.slug)} className="group flex flex-col h-full p-8 hover:bg-surface transition-colors">
                <Calculator className="w-5 h-5 text-accent mb-6" />
                <h4 className="font-serif text-2xl mb-3 group-hover:text-accent transition-colors">{a.baslik}</h4>
                <p className="font-sans text-sm opacity-65 leading-relaxed">{a.ozet}</p>
              </Link>
            </FadeIn>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { r: kusurRehberi, Icon: BookOpen },
            { r: telefonRehberi, Icon: Phone },
          ].map(({ r, Icon }) => (
            <FadeIn key={r.slug}>
              <Link
                href={aracHref(r.slug)}
                className="group flex items-start gap-6 p-8 bg-foreground text-background hover:bg-foreground/95 transition-colors h-full"
              >
                <Icon className="w-6 h-6 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif text-2xl mb-2 group-hover:text-accent transition-colors">{r.baslik}</h4>
                  <p className="font-sans text-sm opacity-70 leading-relaxed">{r.ozet}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 ml-auto shrink-0 opacity-60 group-hover:opacity-100 group-hover:text-accent transition-all" />
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
