import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { FadeIn } from "@/components/site/FadeIn";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { TeamCard } from "@/components/site/TeamCard";
import { getEkip } from "@/lib/content";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Akış Partners Hukuk & Danışmanlık: çalışma anlayışımız, ilkelerimiz ve ekibimiz.",
  alternates: { canonical: "/kurumsal" },
};

const ILKELER = [
  { baslik: "Gizlilik", metin: "Müvekkillerimizle paylaşılan her bilgi, avukatlık mesleğinin gerektirdiği sır saklama yükümlülüğü çerçevesinde korunur." },
  { baslik: "Bağımsızlık", metin: "Hukuki değerlendirmelerimizi, mesleki bağımsızlık ilkesi doğrultusunda ve yalnızca hukuka dayanarak yaparız." },
  { baslik: "Açık iletişim", metin: "Müvekkillerimizi süreç, seçenekler ve olası sonuçlar hakkında anlaşılır biçimde ve düzenli olarak bilgilendiririz." },
  { baslik: "Özen", metin: "Her dosyayı kendine özgü koşullarıyla ele alır, süreli işlemleri ve ayrıntıları dikkatle takip ederiz." },
];

export default async function KurumsalPage() {
  const ekip = await getEkip();

  return (
    <div className="pt-48 md:pt-64 pb-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <Breadcrumbs adimlar={[{ ad: "Hakkımızda", yol: "/kurumsal" }]} />
        <PageHeader
          eyebrow="Hakkımızda"
          title="Biz Kimiz?"
          lead="Hukuk yalnızca mevzuatı bilmek değil, doğru zamanda doğru stratejiyi kurabilmektir."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center mb-32">
          <FadeIn className="relative aspect-square w-full max-w-lg bg-surface flex items-center justify-center">
            <div className="relative w-2/3 h-2/3">
              <Image src="/akislogo.png" alt="Akış Partners" fill sizes="(min-width: 768px) 33vw, 66vw" className="object-contain dark-footer-logo-bg" />
            </div>
          </FadeIn>

          <div className="flex flex-col gap-12">
            <FadeIn>
              <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-4">Misyon</h2>
              <p className="font-serif text-2xl leading-relaxed">
                Müvekkillerimizin hukuki haklarını korurken, ticari ve kişisel hedeflerine uygun, açık ve sürdürülebilir hukuki çözümler
                üretmek.
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-4">Vizyon</h2>
              <p className="font-serif text-2xl leading-relaxed">
                Mesleki etik ilkelerine bağlı, güvenilir ve erişilebilir hukuki hizmet anlayışıyla müvekkilleriyle uzun soluklu ilişkiler
                kuran bir hukuk bürosu olmak.
              </p>
            </FadeIn>
          </div>
        </div>

        <section className="mb-32">
          <FadeIn>
            <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-10">Çalışma ilkelerimiz</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
            {ILKELER.map((ilke, i) => (
              <FadeIn key={ilke.baslik} delay={i * 0.08} className="bg-background p-8">
                <span className="font-serif text-3xl text-accent/30 block mb-4">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-serif text-2xl mb-3">{ilke.baslik}</h3>
                <p className="font-sans text-sm opacity-70 leading-relaxed">{ilke.metin}</p>
              </FadeIn>
            ))}
          </div>
        </section>

        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight">Ekibimiz</h2>
            <Link
              href="/ekibimiz"
              className="group flex items-center gap-2 font-sans text-xs uppercase tracking-widest hover:text-accent transition-colors"
            >
              Tüm ekip <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {ekip.map((u) => (
              <TeamCard key={u.slug} slug={u.slug} ad={u.ad} unvan={u.unvan} foto={u.foto} kompakt />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
