import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Calculator, Scale } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FadeIn } from "@/components/site/FadeIn";
import { HESAPLAYICILAR } from "@/components/calculators/registry";
import { getHesaplamaParametreleri } from "@/lib/content";
import { ARAC_META } from "@/lib/calculators/meta";
import { HESAPLAMA_ARACLARI, aracHref } from "@/lib/taxonomy";
import { formatTarih } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return HESAPLAMA_ARACLARI.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/hukuki-araclar/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const arac = HESAPLAMA_ARACLARI.find((a) => a.slug === slug);
  if (!arac) return {};
  return {
    title: `${arac.baslik} Hesaplama`,
    description: arac.ozet,
    alternates: { canonical: aracHref(slug) },
  };
}

export default async function HesaplayiciPage({ params }: PageProps<"/hukuki-araclar/[slug]">) {
  const { slug } = await params;
  const arac = HESAPLAMA_ARACLARI.find((a) => a.slug === slug);
  const Bilesen = HESAPLAYICILAR[slug];
  if (!arac || !Bilesen) notFound();

  const p = await getHesaplamaParametreleri();
  const meta = ARAC_META[slug];
  const benzerler = HESAPLAMA_ARACLARI.filter((a) => a.kategori === arac.kategori && a.slug !== slug);

  return (
    <div className="pt-48 md:pt-64 pb-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <Breadcrumbs
          adimlar={[
            { ad: "Hukuki Araçlar", yol: "/hukuki-araclar" },
            { ad: arac.baslik, yol: aracHref(slug) },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <FadeIn immediate className="mb-12">
              <p className="font-sans text-xs tracking-widest uppercase text-accent mb-6 flex items-center gap-3">
                <Calculator className="w-4 h-4" /> Hesaplama aracı
              </p>
              <h1 className="font-serif text-[clamp(2.5rem,5vw,4.25rem)] leading-[1.05] tracking-tight mb-6">{arac.baslik}</h1>
              {meta && <p className="font-sans text-base md:text-lg leading-relaxed opacity-75 max-w-3xl">{meta.aciklama}</p>}
            </FadeIn>

            <div className="bg-surface p-6 md:p-10 border border-border" data-no-attribution>
              <Bilesen p={p} />
            </div>

            <p className="mt-6 font-sans text-xs opacity-60 leading-relaxed">
              Sonuçlar girdiğiniz bilgiler ve yürürlükteki genel parametrelerle üretilen tahmini değerlerdir; hukuki görüş niteliği taşımaz.
              Girdiğiniz bilgiler yalnızca tarayıcınızda işlenir, hiçbir yere gönderilmez. Parametrelerin son güncellenme tarihi:{" "}
              {formatTarih(p.guncelleme)}.
            </p>

            {meta && meta.sss.length > 0 && (
              <section className="mt-20">
                <h2 className="font-serif text-3xl md:text-4xl mb-8">Sık sorulan sorular</h2>
                <div className="border-t border-border">
                  {meta.sss.map((s) => (
                    <details key={s.soru} className="group border-b border-border py-5">
                      <summary className="cursor-pointer list-none flex justify-between items-start gap-6 font-serif text-xl">
                        {s.soru}
                        <span className="font-sans text-accent text-2xl leading-none transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="font-sans text-sm md:text-base opacity-75 leading-relaxed mt-4 max-w-3xl">{s.cevap}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="lg:col-span-4 flex flex-col gap-8">
            {meta && (
              <div className="border border-border p-6">
                <p className="font-sans text-xs tracking-widest uppercase text-accent mb-4 flex items-center gap-2">
                  <Scale className="w-4 h-4" /> Mevzuat dayanağı
                </p>
                <ul className="flex flex-col gap-2 font-sans text-sm opacity-80">
                  {meta.dayanak.map((d) => (
                    <li key={d} className="pl-3 border-l border-accent/40">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {benzerler.length > 0 && (
              <div className="border border-border p-6">
                <p className="font-sans text-xs tracking-widest uppercase text-accent mb-4">Benzer araçlar</p>
                <ul className="flex flex-col">
                  {benzerler.map((b) => (
                    <li key={b.slug}>
                      <Link href={aracHref(b.slug)} className="group flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
                        <span className="font-serif text-lg group-hover:text-accent transition-colors">{b.baslik}</span>
                        <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-foreground text-background p-6">
              <p className="font-serif text-2xl mb-3">Hesaplamadan fazlası mı gerekiyor?</p>
              <p className="font-sans text-sm opacity-70 mb-6">Somut durumunuza ilişkin değerlendirme için bizimle iletişime geçebilirsiniz.</p>
              <Link href="/iletisim" className="font-sans text-xs tracking-widest uppercase text-accent hover:underline underline-offset-4">
                İletişim →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
