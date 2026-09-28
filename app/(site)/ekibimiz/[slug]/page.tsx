import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FadeIn } from "@/components/site/FadeIn";
import { Prose } from "@/components/site/Prose";
import { Portre, TeamCard } from "@/components/site/TeamCard";
import { getEkip, getEkipUyesi, getFaaliyetAlanlari } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  const ekip = await getEkip();
  return ekip.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: PageProps<"/ekibimiz/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const uye = await getEkipUyesi(slug);
  if (!uye) return {};
  return {
    title: `Av. ${uye.ad}`,
    description: uye.kisaTanitim || `Av. ${uye.ad} – ${uye.unvan}`,
    alternates: { canonical: `/ekibimiz/${slug}` },
  };
}

function BilgiSatiri({ etiket, children }: { etiket: string; children: React.ReactNode }) {
  return (
    <div className="py-4 border-b border-border grid grid-cols-3 gap-4">
      <dt className="font-sans text-xs tracking-widest uppercase opacity-60">{etiket}</dt>
      <dd className="col-span-2 font-sans text-sm">{children}</dd>
    </div>
  );
}

export default async function EkipUyesiPage({ params }: PageProps<"/ekibimiz/[slug]">) {
  const { slug } = await params;
  const [uye, ekip, alanlar] = await Promise.all([getEkipUyesi(slug), getEkip(), getFaaliyetAlanlari()]);
  if (!uye) notFound();

  const uyeAlanlari = alanlar.filter((a) => uye.faaliyetAlanlari.includes(a.slug));
  const digerleri = ekip.filter((u) => u.slug !== slug);

  return (
    <div className="pt-48 md:pt-64 pb-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <Breadcrumbs
          adimlar={[
            { ad: "Ekibimiz", yol: "/ekibimiz" },
            { ad: `Av. ${uye.ad}`, yol: `/ekibimiz/${slug}` },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-32">
          <FadeIn immediate className="lg:col-span-4">
            <div className="group lg:sticky lg:top-32">
              <Portre ad={uye.ad} foto={uye.foto} sizes="(min-width: 1024px) 33vw, 100vw" />
            </div>
          </FadeIn>

          <div className="lg:col-span-8">
            <FadeIn immediate delay={0.1}>
              <p className="font-sans text-xs tracking-widest uppercase text-accent mb-6">{uye.unvan}</p>
              <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-tight mb-8">Av. {uye.ad}</h1>
              {uye.kisaTanitim && (
                <p className="font-sans text-lg md:text-xl leading-relaxed opacity-80 border-l-2 border-accent pl-6 py-2 mb-12">
                  {uye.kisaTanitim}
                </p>
              )}
            </FadeIn>

            <dl className="border-t border-border mb-12" data-no-attribution>
              {uye.baro && (
                <BilgiSatiri etiket="Baro">
                  {uye.baro}
                  {uye.sicilNo && ` · Sicil No: ${uye.sicilNo}`}
                </BilgiSatiri>
              )}
              {uye.egitim.length > 0 && (
                <BilgiSatiri etiket="Eğitim">
                  <ul className="flex flex-col gap-1">
                    {uye.egitim.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </BilgiSatiri>
              )}
              {uye.diller.length > 0 && <BilgiSatiri etiket="Yabancı dil">{uye.diller.join(", ")}</BilgiSatiri>}
              {uyeAlanlari.length > 0 && (
                <BilgiSatiri etiket="Çalışma alanları">
                  <div className="flex flex-wrap gap-2">
                    {uyeAlanlari.map((a) => (
                      <Link
                        key={a.slug}
                        href={`/faaliyet-alanlari/${a.slug}`}
                        className="px-2.5 py-1 border border-border hover:border-accent hover:text-accent transition-colors"
                      >
                        {a.baslik}
                      </Link>
                    ))}
                  </div>
                </BilgiSatiri>
              )}
              {uye.eposta && (
                <BilgiSatiri etiket="E-posta">
                  <a href={`mailto:${uye.eposta}`} className="inline-flex items-center gap-2 hover:text-accent transition-colors break-all">
                    <Mail className="w-4 h-4 text-accent shrink-0" /> {uye.eposta}
                  </a>
                </BilgiSatiri>
              )}
              {uye.linkedin && (
                <BilgiSatiri etiket="LinkedIn">
                  <a
                    href={uye.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-accent transition-colors"
                  >
                    Profili görüntüle <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </BilgiSatiri>
              )}
            </dl>

            <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-6">Özgeçmiş</h2>
            <Prose node={uye.ozgecmis.node} />
          </div>
        </div>

        {digerleri.length > 0 && (
          <section>
            <h2 className="font-serif text-3xl md:text-4xl mb-10">Ekibimizden</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {digerleri.map((u) => (
                <TeamCard key={u.slug} slug={u.slug} ad={u.ad} unvan={u.unvan} foto={u.foto} kompakt />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
