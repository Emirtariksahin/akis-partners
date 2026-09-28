import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getYasalSayfa } from "@/lib/content";
import { formatTarih } from "@/lib/format";
import { PageHeader } from "./PageHeader";
import { Prose } from "./Prose";

export async function yasalSayfaMetadata(slug: string): Promise<Metadata> {
  const sayfa = await getYasalSayfa(slug);
  return { title: sayfa?.baslik ?? "Yasal Metin", alternates: { canonical: `/${slug}` } };
}

export async function LegalPage({ slug }: { slug: string }) {
  const sayfa = await getYasalSayfa(slug);
  if (!sayfa) notFound();

  return (
    <div className="pt-48 md:pt-64 pb-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <PageHeader eyebrow="Yasal Bilgilendirme" title={sayfa.baslik}>
          {sayfa.sonGuncelleme && (
            <p className="font-sans text-xs tracking-widest uppercase opacity-60">
              Son güncelleme: {formatTarih(sayfa.sonGuncelleme)}
            </p>
          )}
        </PageHeader>
        <div className="max-w-3xl">
          <Prose node={sayfa.baslik ? sayfa.icerik.node : null} />
        </div>
      </div>
    </div>
  );
}
