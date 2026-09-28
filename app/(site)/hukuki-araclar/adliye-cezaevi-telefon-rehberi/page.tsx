import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PhoneDirectory, type RehberKaydi } from "@/components/site/PhoneDirectory";
import { getSiteAyarlari } from "@/lib/content";
import { aracHref } from "@/lib/taxonomy";
import { formatTarih } from "@/lib/format";
import adliyeVerisi from "@/content/rehber/adliyeler.json";
import cezaeviVerisi from "@/content/rehber/cezaevleri.json";

const YOL = aracHref("adliye-cezaevi-telefon-rehberi");

export const metadata: Metadata = {
  title: "Adliye ve Cezaevi Telefon Rehberi",
  description: "Türkiye genelindeki adliyelerin ve ceza infaz kurumlarının adres ve telefon bilgileri; il ve kurum adına göre arama.",
  alternates: { canonical: YOL },
};

export default async function TelefonRehberiPage() {
  const ayarlar = await getSiteAyarlari();
  const guncelleme = [adliyeVerisi.guncelleme, cezaeviVerisi.guncelleme].sort().pop();

  return (
    <div className="pt-48 md:pt-64 pb-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <Breadcrumbs
          adimlar={[
            { ad: "Hukuki Araçlar", yol: "/hukuki-araclar" },
            { ad: "Adliye ve Cezaevi Rehberi", yol: YOL },
          ]}
        />
        <PageHeader
          eyebrow="Rehber"
          title="Adliye ve Cezaevi Telefon Rehberi"
          lead="Adliyelerin ve ceza infaz kurumlarının iletişim bilgileri, Adalet Bakanlığı ve Ceza ve Tevkifevleri Genel Müdürlüğü'nün resmî sitelerinden derlenmiştir."
        />

        <PhoneDirectory adliyeler={adliyeVerisi.kayitlar as RehberKaydi[]} cezaevleri={cezaeviVerisi.kayitlar as RehberKaydi[]} />

        <p className="mt-10 font-sans text-xs opacity-60 leading-relaxed max-w-4xl">
          Son güncelleme: {formatTarih(guncelleme)}. İletişim bilgileri kurumlar tarafından değiştirilebilir; güncelliğini ilgili kurumun resmî
          sitesinden teyit ediniz.
          {ayarlar.eposta && (
            <>
              {" "}
              Hatalı veya eksik bir bilgi fark ederseniz{" "}
              <a
                href={`mailto:${ayarlar.eposta}?subject=${encodeURIComponent("Telefon rehberi düzeltme")}`}
                className="underline underline-offset-4 hover:text-accent"
              >
                bize bildirebilirsiniz
              </a>
              .
            </>
          )}
        </p>
      </div>
    </div>
  );
}
