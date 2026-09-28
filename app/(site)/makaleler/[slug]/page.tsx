import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FadeIn } from "@/components/site/FadeIn";
import { Prose } from "@/components/site/Prose";
import { Portre } from "@/components/site/TeamCard";
import { getEkipUyesi, getFaaliyetAlani, getMakale, getMakaleler } from "@/lib/content";
import { formatTarih } from "@/lib/format";

export const dynamicParams = false;

export async function generateStaticParams() {
  const makaleler = await getMakaleler();
  return makaleler.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/makaleler/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const makale = await getMakale(slug);
  if (!makale) return {};
  return {
    title: makale.baslik,
    description: makale.ozet,
    alternates: { canonical: `/makaleler/${slug}` },
    openGraph: {
      type: "article",
      title: makale.baslik,
      description: makale.ozet,
      publishedTime: makale.tarih ?? undefined,
      ...(makale.kapak && { images: [makale.kapak] }),
    },
  };
}

export default async function MakalePage({ params }: PageProps<"/makaleler/[slug]">) {
  const { slug } = await params;
  const makale = await getMakale(slug);
  if (!makale) notFound();

  const [yazar, alan] = await Promise.all([
    makale.yazar ? getEkipUyesi(makale.yazar) : null,
    makale.faaliyetAlani ? getFaaliyetAlani(makale.faaliyetAlani) : null,
  ]);

  return (
    <article className="pt-48 md:pt-64 pb-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <Breadcrumbs
          adimlar={[
            { ad: "Makaleler", yol: "/makaleler" },
            { ad: makale.baslik, yol: `/makaleler/${slug}` },
          ]}
        />

        <FadeIn immediate className="max-w-4xl mb-12">
          <div className="flex flex-wrap items-center gap-4 font-sans text-xs uppercase tracking-widest mb-6">
            {alan && (
              <Link href={`/faaliyet-alanlari/${alan.slug}`} className="text-accent hover:underline underline-offset-4">
                {alan.baslik}
              </Link>
            )}
            <time dateTime={makale.tarih ?? undefined} className="opacity-60">
              {formatTarih(makale.tarih)}
            </time>
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.08] tracking-tight mb-8">{makale.baslik}</h1>
          <p className="font-sans text-lg md:text-xl leading-relaxed opacity-80 border-l-2 border-accent pl-6 py-2">{makale.ozet}</p>
        </FadeIn>

        {makale.kapak && (
          <div className="relative w-full aspect-[21/9] mb-16 overflow-hidden">
            <Image src={makale.kapak} alt={makale.baslik} fill sizes="100vw" className="object-cover" preload />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <Prose node={makale.icerik.node} />
            <p className="mt-16 pt-8 border-t border-border font-sans text-xs opacity-60 leading-relaxed">
              Bu yazı genel bilgilendirme amacı taşır ve hukuki görüş niteliğinde değildir. Ayrıntılı bilgi için{" "}
              <Link href="/yasal-uyari" className="underline underline-offset-4 hover:text-accent">
                Yasal Uyarı
              </Link>{" "}
              sayfamızı inceleyebilirsiniz.
            </p>
          </div>

          {yazar && (
            <aside className="lg:col-span-4">
              <Link href={`/ekibimiz/${yazar.slug}`} className="group lg:sticky lg:top-32 flex gap-5 items-center border border-border p-5">
                <div className="w-20 shrink-0">
                  <Portre ad={yazar.ad} foto={yazar.foto} sizes="80px" />
                </div>
                <div>
                  <p className="font-sans text-[10px] tracking-widest uppercase opacity-60 mb-1">Yazar</p>
                  <p className="font-serif text-xl group-hover:text-accent transition-colors">Av. {yazar.ad}</p>
                  <p className="font-sans text-xs opacity-60">{yazar.unvan}</p>
                </div>
              </Link>
            </aside>
          )}
        </div>
      </div>
    </article>
  );
}
