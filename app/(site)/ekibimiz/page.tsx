import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { FadeIn } from "@/components/site/FadeIn";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { TeamCard } from "@/components/site/TeamCard";
import { getEkip } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ekibimiz",
  description: "Akış Partners avukatları, eğitim bilgileri ve özgeçmişleri.",
  alternates: { canonical: "/ekibimiz" },
};

export default async function EkibimizPage() {
  const ekip = await getEkip();

  return (
    <div className="pt-48 md:pt-64 pb-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <Breadcrumbs adimlar={[{ ad: "Ekibimiz", yol: "/ekibimiz" }]} />
        <PageHeader
          eyebrow="Hakkımızda"
          title="Ekibimiz"
          lead="Büromuzun avukatları; farklı hukuk disiplinlerindeki çalışmalarını ortak bir çalışma anlayışıyla bir araya getirir."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {ekip.map((u, i) => (
            <FadeIn key={u.slug} delay={i * 0.1}>
              <TeamCard slug={u.slug} ad={u.ad} unvan={u.unvan} foto={u.foto} altBilgi={u.kisaTanitim} />
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
