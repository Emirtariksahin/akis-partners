import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Calculator } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FadeIn } from "@/components/site/FadeIn";
import { Prose } from "@/components/site/Prose";
import { TeamCard } from "@/components/site/TeamCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { getEkip, getFaaliyetAlani, getFaaliyetAlanlari, getMakaleler } from "@/lib/content";
import { FAALIYET_KATEGORILERI, aracBaslik, aracHref, kategoriEtiketi } from "@/lib/taxonomy";
import { formatTarih } from "@/lib/format";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export async function generateStaticParams() {
  const alanlar = await getFaaliyetAlanlari();
  return alanlar.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/faaliyet-alanlari/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const alan = await getFaaliyetAlani(slug);
  if (!alan) return {};
  return {
    title: alan.baslik,
    description: alan.ozet,
    alternates: { canonical: `/faaliyet-alanlari/${slug}` },
  };
}

function anchor(metin: string) {
  return metin
    .toLocaleLowerCase("tr")
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function FaaliyetAlaniPage({ params }: PageProps<"/faaliyet-alanlari/[slug]">) {
  const { slug } = await params;
  const [alan, tumAlanlar, ekip, makaleler] = await Promise.all([
    getFaaliyetAlani(slug),
    getFaaliyetAlanlari(),
    getEkip(),
    getMakaleler(),
  ]);
  if (!alan) notFound();

  const avukatlar = ekip.filter((u) => u.faaliyetAlanlari.includes(slug));
  const ilgiliMakaleler = makaleler.filter((m) => m.faaliyetAlani === slug).slice(0, 3);

  return (
    <div className="pt-48 md:pt-64 pb-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <Breadcrumbs
          adimlar={[
            { ad: "Faaliyet Alanları", yol: "/faaliyet-alanlari" },
            { ad: alan.baslik, yol: `/faaliyet-alanlari/${slug}` },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <article className="lg:col-span-8">
            <FadeIn immediate>
              <p className="font-sans text-xs tracking-widest uppercase text-accent mb-6">{kategoriEtiketi(alan.kategori)}</p>
              <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-tight mb-8">{alan.baslik}</h1>
              <p className="font-sans text-lg md:text-xl leading-relaxed opacity-80 border-l-2 border-accent pl-6 py-2 mb-16">
                {alan.ozet}
              </p>
            </FadeIn>

            {alan.altBasliklar.length > 0 && (
              <div className="mb-16">
                <nav aria-label="Bu sayfada" className="flex flex-wrap gap-2 mb-10">
                  {alan.altBasliklar.map((ab) => (
                    <a
                      key={ab.baslik}
                      href={`#${anchor(ab.baslik)}`}
                      className="font-sans text-xs tracking-wide px-3 py-1.5 border border-border hover:border-accent hover:text-accent transition-colors"
                    >
                      {ab.baslik}
                    </a>
                  ))}
                </nav>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
                  {alan.altBasliklar.map((ab, i) => (
                    <section key={ab.baslik} id={anchor(ab.baslik)} className="bg-background p-8 scroll-mt-32">
                      <span className="font-serif text-3xl text-accent/30 block mb-3">{String(i + 1).padStart(2, "0")}</span>
                      <h2 className="font-serif text-2xl mb-3">{ab.baslik}</h2>
                      <p className="font-sans text-sm opacity-75 leading-relaxed">{ab.metin}</p>
                    </section>
                  ))}
                </div>
              </div>
            )}

            <Prose node={alan.icerik.node} />

            {alan.ilgiliAraclar.length > 0 && (
              <section className="mt-20">
                <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-6">İlgili hukuki araçlar</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {alan.ilgiliAraclar.map((a) => (
                    <Link
                      key={a}
                      href={aracHref(a)}
                      className="group flex items-center gap-4 p-5 border border-border hover:border-accent transition-colors"
                    >
                      <Calculator className="w-5 h-5 text-accent shrink-0" />
                      <span className="font-serif text-lg group-hover:text-accent transition-colors">{aracBaslik(a)}</span>
                      <ArrowUpRight className="w-4 h-4 ml-auto opacity-40 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {avukatlar.length > 0 && (
              <section className="mt-20">
                <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-6">Bu alanda çalışan avukatlarımız</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {avukatlar.map((u) => (
                    <TeamCard key={u.slug} slug={u.slug} ad={u.ad} unvan={u.unvan} foto={u.foto} kompakt />
                  ))}
                </div>
              </section>
            )}

            {ilgiliMakaleler.length > 0 && (
              <section className="mt-20">
                <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-6">İlgili makaleler</h2>
                <ul className="border-t border-border">
                  {ilgiliMakaleler.map((m) => (
                    <li key={m.slug} className="border-b border-border">
                      <Link href={`/makaleler/${m.slug}`} className="group flex flex-col md:flex-row md:items-center gap-2 md:gap-8 py-5">
                        <span className="font-sans text-xs opacity-50 shrink-0 md:w-32">{formatTarih(m.tarih)}</span>
                        <span className="font-serif text-xl group-hover:text-accent transition-colors">{m.baslik}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-20 p-8 md:p-12 bg-surface flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <h2 className="font-serif text-3xl mb-2">Bu konuda görüşmek ister misiniz?</h2>
                <p className="font-sans text-sm opacity-70">Talebinizi iletişim formu, telefon veya e-posta yoluyla iletebilirsiniz.</p>
              </div>
              <MagneticButton href="/iletisim" variant="secondary" showArrow>
                İletişime Geç
              </MagneticButton>
            </div>
          </article>

          {/* Tüm alanlar kenar çubuğu */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32 border border-border p-6 max-h-[calc(100vh-10rem)] overflow-y-auto no-scrollbar">
              <p className="font-sans text-xs tracking-widest uppercase text-accent mb-6">Tüm faaliyet alanları</p>
              {FAALIYET_KATEGORILERI.map((k) => {
                const liste = tumAlanlar.filter((a) => a.kategori === k.value);
                if (!liste.length) return null;
                return (
                  <div key={k.value} className="mb-6 last:mb-0">
                    <p className="font-sans text-[10px] tracking-widest uppercase opacity-50 mb-2">{k.label}</p>
                    <ul className="flex flex-col">
                      {liste.map((a) => (
                        <li key={a.slug}>
                          <Link
                            href={`/faaliyet-alanlari/${a.slug}`}
                            aria-current={a.slug === slug ? "page" : undefined}
                            className={cn(
                              "block py-1.5 pl-3 border-l font-sans text-sm transition-colors",
                              a.slug === slug
                                ? "border-accent text-accent"
                                : "border-border opacity-70 hover:opacity-100 hover:border-accent",
                            )}
                          >
                            {a.baslik}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
