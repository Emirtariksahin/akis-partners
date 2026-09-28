import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { FadeIn } from "@/components/site/FadeIn";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { getFaaliyetAlanlari } from "@/lib/content";
import { FAALIYET_KATEGORILERI } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "Faaliyet Alanları",
  description: "Akış Partners'ın kurumsal, ticari, bireysel, tazminat ve ceza hukuku alanlarındaki faaliyet alanları.",
  alternates: { canonical: "/faaliyet-alanlari" },
};

export default async function FaaliyetAlanlariPage() {
  const alanlar = await getFaaliyetAlanlari();

  return (
    <div className="pt-48 md:pt-64 pb-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <Breadcrumbs adimlar={[{ ad: "Faaliyet Alanları", yol: "/faaliyet-alanlari" }]} />
        <PageHeader
          eyebrow={`${alanlar.length} faaliyet alanı`}
          title="Faaliyet Alanlarımız"
          lead="Bireysel ve kurumsal müvekkillerimize; danışmanlık, uyuşmazlık çözümü ve dava takibi süreçlerinde aşağıdaki alanlarda hukuki destek sunuyoruz."
        />

        <nav aria-label="Kategoriler" className="flex flex-wrap gap-3 mb-20">
          {FAALIYET_KATEGORILERI.map((k) => (
            <a
              key={k.value}
              href={`#${k.value}`}
              className="font-sans text-xs tracking-widest uppercase px-5 py-2.5 border border-border rounded-full hover:border-accent hover:text-accent transition-colors"
            >
              {k.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-24">
          {FAALIYET_KATEGORILERI.map((k, ki) => {
            const kategoriAlanlari = alanlar.filter((a) => a.kategori === k.value);
            if (kategoriAlanlari.length === 0) return null;
            return (
              <section key={k.value} id={k.value} className="scroll-mt-32">
                <FadeIn className="flex items-baseline gap-6 mb-10 border-b border-border pb-6">
                  <span className="font-serif text-4xl text-accent/40">{String(ki + 1).padStart(2, "0")}</span>
                  <h2 className="font-serif text-3xl md:text-5xl tracking-tight">{k.label}</h2>
                </FadeIn>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
                  {kategoriAlanlari.map((a, i) => (
                    <FadeIn key={a.slug} delay={Math.min(i, 5) * 0.05} className="bg-background">
                      <Link href={`/faaliyet-alanlari/${a.slug}`} className="group flex flex-col h-full p-8 hover:bg-surface transition-colors">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <h3 className="font-serif text-2xl leading-snug group-hover:text-accent transition-colors">{a.baslik}</h3>
                          <ArrowUpRight className="w-5 h-5 shrink-0 opacity-40 group-hover:opacity-100 group-hover:text-accent transition-all" />
                        </div>
                        <p className="font-sans text-sm opacity-65 leading-relaxed mb-6">{a.ozet}</p>
                        {a.altBasliklar.length > 0 && (
                          <ul className="mt-auto flex flex-wrap gap-2">
                            {a.altBasliklar.slice(0, 4).map((ab) => (
                              <li key={ab.baslik} className="font-sans text-[11px] tracking-wide px-2.5 py-1 bg-surface group-hover:bg-background transition-colors">
                                {ab.baslik}
                              </li>
                            ))}
                          </ul>
                        )}
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
