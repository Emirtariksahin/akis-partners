import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { KtkList } from "@/components/site/KtkList";
import { Uyari } from "@/components/calculators/ui";
import { getKtkMaddeleri } from "@/lib/content";
import { aracHref } from "@/lib/taxonomy";

const YOL = aracHref("trafik-kusur-ve-ceza-rehberi");

export const metadata: Metadata = {
  title: "Trafik Kusur ve Ceza Rehberi",
  description:
    "Karayolları Trafik Kanunu ihlallerinin kusur niteliği (asli/tali), 2026 yılı idari para cezası tutarları, ceza puanları ve sade anlatımları.",
  alternates: { canonical: YOL },
};

const SENARYOLAR = [
  { durum: "Bir sürücü asli, diğeri tali kusurlu", oran: "%75 – %25" },
  { durum: "İki sürücü de asli kusurlu", oran: "%50 – %50" },
  { durum: "İki sürücü de tali kusurlu", oran: "%50 – %50" },
  { durum: "Yalnızca bir sürücü kusurlu", oran: "%100 – %0" },
];

export default async function KtkRehberiPage() {
  const maddeler = await getKtkMaddeleri();
  const kartlar = maddeler.map((m) => ({
    slug: m.slug,
    madde: m.madde,
    baslik: m.baslik,
    grup: m.grup,
    kusurTuru: m.kusurTuru,
    cezaTutari: m.cezaTutari,
    cezaPuani: m.cezaPuani,
  }));

  return (
    <div className="pt-48 md:pt-64 pb-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <Breadcrumbs
          adimlar={[
            { ad: "Hukuki Araçlar", yol: "/hukuki-araclar" },
            { ad: "Trafik Kusur ve Ceza Rehberi", yol: YOL },
          ]}
        />
        <PageHeader
          eyebrow="Rehber"
          title="Trafik Kusur ve Ceza Rehberi"
          lead="Karayolları Trafik Kanunu'ndaki kural ihlallerinin sade anlatımı, kusur niteliği, 2026 yılı idari para cezası tutarları ve ceza puanları."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="font-serif text-3xl">Asli ve tali kusur nedir?</h2>
            <p className="font-sans opacity-80 leading-relaxed">
              2918 sayılı Karayolları Trafik Kanunu&apos;nun 84. maddesi; kırmızı ışıkta geçme, arkadan çarpma, geçme yasağına uymama,
              şerit ve kavşak kurallarını ihlal etme gibi hâlleri <strong>asli kusur</strong> olarak sayar. Bu hâller dışındaki kural
              ihlalleri kural olarak <strong>tali kusur</strong> niteliğindedir. Kazadaki kusur oranları, sürücülerin ihlallerinin asli veya
              tali olmasına göre belirlenir.
            </p>
            <Uyari tur="dikkat">
              Kusur oranları her olayın koşullarına göre kaza tespit tutanağı ve bilirkişi raporuyla belirlenir. Yandaki oranlar uygulamada
              sık karşılaşılan başlangıç değerleridir; bağlayıcı değildir.
            </Uyari>
          </div>
          <div className="border border-border">
            <p className="px-5 pt-5 pb-3 font-sans text-xs tracking-widest uppercase text-accent">İki araçlı kazalarda sık görülen oranlar</p>
            <dl>
              {SENARYOLAR.map((s) => (
                <div key={s.durum} className="flex justify-between gap-4 px-5 py-3 border-t border-border font-sans text-sm">
                  <dt className="opacity-80">{s.durum}</dt>
                  <dd className="font-medium tabular-nums whitespace-nowrap">{s.oran}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <KtkList maddeler={kartlar} tabanYol={YOL} />

        <p className="mt-6 font-sans text-xs opacity-60 leading-relaxed max-w-4xl">
          Ceza tutarları, 7574 sayılı Kanun ile yapılan değişiklikler sonrası Emniyet Genel Müdürlüğü&apos;nün 2026 Yılı Trafik İdari Para
          Ceza Rehberi esas alınarak derlenmiştir. &quot;—&quot; ile gösterilen değerler için{" "}
          <a
            href="https://www.trafik.gov.tr/kurumlar/trafik.gov.tr/trafik-para-cezasi/2026/2026-YILI-TRAFIK-IDARI-PARA-CEZA-REHBERI.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-accent"
          >
            resmî rehbere
          </a>{" "}
          bakınız. Tazminat hesabı için{" "}
          <Link href={aracHref("trafik-kazasi-tazminati-hesaplama")} className="underline underline-offset-4 hover:text-accent">
            trafik kazası tazminatı hesaplama
          </Link>{" "}
          aracımızı kullanabilirsiniz.
        </p>
      </div>
    </div>
  );
}
