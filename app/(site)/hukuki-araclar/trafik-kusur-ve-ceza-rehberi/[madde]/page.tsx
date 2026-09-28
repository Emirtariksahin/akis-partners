import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FadeIn } from "@/components/site/FadeIn";
import { Prose } from "@/components/site/Prose";
import { getKtkMaddeleri, getKtkMaddesi } from "@/lib/content";
import { KTK_GRUPLARI, aracHref } from "@/lib/taxonomy";
import { formatTL } from "@/lib/calculators/core/money";
import { formatTarih } from "@/lib/format";
import { cn } from "@/lib/utils";

const YOL = aracHref("trafik-kusur-ve-ceza-rehberi");

export const dynamicParams = false;

export async function generateStaticParams() {
  const maddeler = await getKtkMaddeleri();
  return maddeler.map((m) => ({ madde: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/hukuki-araclar/trafik-kusur-ve-ceza-rehberi/[madde]">): Promise<Metadata> {
  const { madde } = await params;
  const m = await getKtkMaddesi(madde);
  if (!m) return {};
  const ceza = m.cezaTutari ? ` 2026 idari para cezası ${formatTL(m.cezaTutari)}.` : "";
  return {
    title: `KTK ${m.madde} – ${m.baslik}`,
    description: `${m.baslik}: ${m.kusurTuru === "asli" ? "asli" : "tali"} kusur.${ceza} ${m.ozet}`.slice(0, 300),
    alternates: { canonical: `${YOL}/${madde}` },
  };
}

function Kart({ etiket, deger, vurgu, alt }: { etiket: string; deger: string; vurgu?: boolean; alt?: string }) {
  return (
    <div className={cn("p-6 flex flex-col gap-2", vurgu ? "bg-foreground text-background" : "bg-background")}>
      <span className={cn("font-sans text-[11px] tracking-widest uppercase", vurgu ? "text-accent" : "opacity-60")}>{etiket}</span>
      <span className="font-serif text-3xl">{deger}</span>
      {alt && <span className="font-sans text-xs opacity-60">{alt}</span>}
    </div>
  );
}

export default async function KtkMaddePage({ params }: PageProps<"/hukuki-araclar/trafik-kusur-ve-ceza-rehberi/[madde]">) {
  const { madde } = await params;
  const [m, tum] = await Promise.all([getKtkMaddesi(madde), getKtkMaddeleri()]);
  if (!m) notFound();

  const sira = tum.findIndex((x) => x.slug === madde);
  const onceki = tum[sira - 1];
  const sonraki = tum[sira + 1];
  const ayniGrup = tum.filter((x) => x.grup === m.grup && x.slug !== madde).slice(0, 6);
  const grupAdi = KTK_GRUPLARI.find((g) => g.value === m.grup)?.label;

  return (
    <div className="pt-48 md:pt-64 pb-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <Breadcrumbs
          adimlar={[
            { ad: "Hukuki Araçlar", yol: "/hukuki-araclar" },
            { ad: "Trafik Kusur Rehberi", yol: YOL },
            { ad: `KTK ${m.madde}`, yol: `${YOL}/${madde}` },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <article className="lg:col-span-8">
            <FadeIn immediate className="mb-10">
              <p className="font-sans text-xs tracking-widest uppercase text-accent mb-5">
                KTK {m.madde} {grupAdi && <span className="opacity-60">· {grupAdi}</span>}
              </p>
              <h1 className="font-serif text-[clamp(2.25rem,4.5vw,4rem)] leading-[1.08] tracking-tight mb-6">{m.baslik}</h1>
              <p className="font-sans text-lg leading-relaxed opacity-80">{m.ozet}</p>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border mb-10">
              <Kart etiket="Kusur niteliği" deger={m.kusurTuru === "asli" ? "Asli kusur" : "Tali kusur"} vurgu />
              <Kart
                etiket="İdari para cezası (2026)"
                deger={m.cezaTutari ? formatTL(m.cezaTutari) : "—"}
                alt={m.cezaTutari ? `15 gün içinde ödemede ${formatTL(m.cezaTutari * 0.75)}` : "Resmî rehbere bakınız"}
              />
              <Kart etiket="Ceza puanı" deger={m.cezaPuani ? String(m.cezaPuani) : "—"} />
            </div>

            <section className="mb-10">
              <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-4">İhlalin tanımı</h2>
              <blockquote className="border-l-2 border-accent pl-6 font-serif text-xl leading-relaxed">{m.kanunMetni}</blockquote>
            </section>

            {(m.ehliyetElKoyma || m.aracMen || m.ekYaptirim) && (
              <section className="mb-10 border border-border">
                <h2 className="px-6 pt-5 pb-3 font-sans text-xs tracking-widest uppercase text-accent">Diğer yaptırımlar ve notlar</h2>
                <dl>
                  {m.ehliyetElKoyma && (
                    <div className="px-6 py-4 border-t border-border">
                      <dt className="font-sans text-xs opacity-60 mb-1">Sürücü belgesi</dt>
                      <dd className="font-sans text-sm">{m.ehliyetElKoyma}</dd>
                    </div>
                  )}
                  {m.aracMen && (
                    <div className="px-6 py-4 border-t border-border">
                      <dt className="font-sans text-xs opacity-60 mb-1">Araç</dt>
                      <dd className="font-sans text-sm">{m.aracMen}</dd>
                    </div>
                  )}
                  {m.ekYaptirim && (
                    <div className="px-6 py-4 border-t border-border">
                      <dt className="font-sans text-xs opacity-60 mb-1">Not</dt>
                      <dd className="font-sans text-sm leading-relaxed">{m.ekYaptirim}</dd>
                    </div>
                  )}
                </dl>
              </section>
            )}

            <Prose node={m.aciklama.node} />

            <div className="mt-12 pt-6 border-t border-border flex flex-col gap-2 font-sans text-xs opacity-65">
              {m.guncelleme && <p>Son kontrol: {formatTarih(m.guncelleme)}</p>}
              {m.kaynaklar.length > 0 && (
                <p className="flex flex-wrap gap-x-4 gap-y-1">
                  Kaynaklar:
                  {m.kaynaklar.map((k) =>
                    k.url ? (
                      <a key={k.ad} href={k.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-accent">
                        {k.ad} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span key={k.ad}>{k.ad}</span>
                    ),
                  )}
                </p>
              )}
            </div>

            <nav aria-label="Madde gezinme" className="mt-12 grid grid-cols-2 gap-4">
              {onceki ? (
                <Link href={`${YOL}/${onceki.slug}`} className="group border border-border p-5 hover:border-accent transition-colors">
                  <span className="flex items-center gap-2 font-sans text-xs opacity-60 mb-1">
                    <ArrowLeft className="w-3 h-3" /> KTK {onceki.madde}
                  </span>
                  <span className="font-serif text-lg group-hover:text-accent transition-colors">{onceki.baslik}</span>
                </Link>
              ) : (
                <span />
              )}
              {sonraki && (
                <Link href={`${YOL}/${sonraki.slug}`} className="group border border-border p-5 text-right hover:border-accent transition-colors">
                  <span className="flex items-center justify-end gap-2 font-sans text-xs opacity-60 mb-1">
                    KTK {sonraki.madde} <ArrowRight className="w-3 h-3" />
                  </span>
                  <span className="font-serif text-lg group-hover:text-accent transition-colors">{sonraki.baslik}</span>
                </Link>
              )}
            </nav>
          </article>

          <aside className="lg:col-span-4 flex flex-col gap-8">
            {ayniGrup.length > 0 && (
              <div className="border border-border p-6 lg:sticky lg:top-32">
                <p className="font-sans text-xs tracking-widest uppercase text-accent mb-4">{grupAdi}</p>
                <ul className="flex flex-col">
                  {ayniGrup.map((x) => (
                    <li key={x.slug}>
                      <Link href={`${YOL}/${x.slug}`} className="group block py-3 border-b border-border last:border-0">
                        <span className="font-sans text-xs opacity-60">KTK {x.madde}</span>
                        <span className="block font-serif text-lg group-hover:text-accent transition-colors">{x.baslik}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={YOL} className="inline-block mt-4 font-sans text-xs tracking-widest uppercase hover:text-accent">
                  Tüm maddeler →
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
