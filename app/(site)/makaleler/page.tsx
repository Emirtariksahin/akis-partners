import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ArticleList } from "@/components/site/ArticleList";
import { getFaaliyetAlanlari, getMakaleler } from "@/lib/content";

export const metadata: Metadata = {
  title: "Makaleler",
  description: "Akış Partners avukatlarının hukuki gelişmeler ve güncel konulara ilişkin yazıları.",
  alternates: { canonical: "/makaleler" },
};

export default async function MakalelerPage() {
  const [makaleler, alanlar] = await Promise.all([getMakaleler(), getFaaliyetAlanlari()]);
  const kartlar = makaleler.map((m) => ({
    slug: m.slug,
    baslik: m.baslik,
    tarih: m.tarih,
    ozet: m.ozet,
    kapak: m.kapak,
    alanSlug: m.faaliyetAlani,
    alanBaslik: alanlar.find((a) => a.slug === m.faaliyetAlani)?.baslik ?? null,
  }));

  return (
    <div className="pt-48 md:pt-64 pb-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <Breadcrumbs adimlar={[{ ad: "Makaleler", yol: "/makaleler" }]} />
        <PageHeader
          eyebrow="Yayınlar"
          title="Makaleler"
          lead="Hukuki gelişmeler, mevzuat değişiklikleri ve güncel yargı kararları üzerine yazılarımız."
        />

        {kartlar.length > 0 ? (
          <ArticleList makaleler={kartlar} />
        ) : (
          <div className="border border-border bg-surface p-10 md:p-16 flex flex-col md:flex-row gap-10 md:items-center justify-between">
            <div className="flex gap-6 items-start max-w-2xl">
              <PenLine className="w-8 h-8 text-accent shrink-0 mt-1" />
              <div>
                <h2 className="font-serif text-3xl md:text-4xl mb-4">Yazılarımız çok yakında burada.</h2>
                <p className="font-sans text-sm md:text-base opacity-70 leading-relaxed">
                  Makaleler bölümümüz hazırlanıyor. Bu sırada hesaplama araçlarımızdan ve trafik kusur rehberimizden yararlanabilirsiniz.
                </p>
              </div>
            </div>
            <Link
              href="/hukuki-araclar"
              className="group inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 font-sans text-xs tracking-widest uppercase hover:bg-foreground/90 transition-colors shrink-0"
            >
              Hukuki Araçlar <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
