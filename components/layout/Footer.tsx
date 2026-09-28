import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/site/FadeIn";
import { FooterMap } from "@/components/site/FooterMap";
import { CookiePreferencesButton } from "@/components/site/CookiePreferencesButton";
import { YASAL_LINKLER, type NavAlan } from "@/lib/navigation";
import { HESAPLAMA_ARACLARI, REHBERLER, aracHref } from "@/lib/taxonomy";
import type { SiteAyarlari } from "@/lib/content";

type FooterProps = { ayarlar: SiteAyarlari; alanlar: NavAlan[] };

const baslikSinifi = "font-sans text-xs tracking-widest uppercase text-accent mb-5";
const linkSinifi = "font-sans text-sm opacity-75 hover:opacity-100 hover:text-accent transition-colors";

export function Footer({ ayarlar, alanlar }: FooterProps) {
  const sosyal = [
    { ad: "LinkedIn", url: ayarlar.sosyal.linkedin },
    { ad: "Instagram", url: ayarlar.sosyal.instagram },
    { ad: "X", url: ayarlar.sosyal.x },
  ].filter((s): s is { ad: string; url: string } => !!s.url);

  // Footer'da her kategoriden öne çıkan alanlar yerine ilk 8 alan listelenir; tamamı mega menüde.
  const oneCikanAlanlar = alanlar.slice(0, 8);

  return (
    <footer className="bg-surface pt-24 pb-12 px-6 md:px-12 border-t border-border overflow-hidden relative">
      <div className="container mx-auto">
        <FadeIn className="mb-16 md:mb-24 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          <div className="relative w-32 h-32 md:w-48 md:h-48 shrink-0">
            <Image
              src="/akislogo.png"
              alt="Akış Partners Logo"
              fill
              sizes="192px"
              className="object-contain transition-all opacity-80 hover:opacity-100 dark-footer-logo-bg"
            />
          </div>
          <p className="text-[12vw] md:text-[7vw] leading-none font-serif font-light tracking-tighter text-foreground text-center md:text-left">
            AKIŞ <span className="opacity-50">PARTNERS</span>
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          <div className="flex flex-col gap-3">
            <h2 className={baslikSinifi}>Kurumsal</h2>
            <Link href="/kurumsal" className={linkSinifi}>Biz Kimiz?</Link>
            <Link href="/ekibimiz" className={linkSinifi}>Ekibimiz</Link>
            <Link href="/makaleler" className={linkSinifi}>Makaleler</Link>
            <Link href="/iletisim" className={linkSinifi}>İletişim</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className={baslikSinifi}>Faaliyet Alanları</h2>
            {oneCikanAlanlar.map((a) => (
              <Link key={a.slug} href={`/faaliyet-alanlari/${a.slug}`} className={linkSinifi}>
                {a.baslik}
              </Link>
            ))}
            <Link href="/faaliyet-alanlari" className="font-sans text-xs tracking-widest uppercase text-accent mt-1">
              Tümü ({alanlar.length}) →
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className={baslikSinifi}>Hukuki Araçlar</h2>
            {HESAPLAMA_ARACLARI.slice(0, 5).map((a) => (
              <Link key={a.slug} href={aracHref(a.slug)} className={linkSinifi}>
                {a.baslik}
              </Link>
            ))}
            {REHBERLER.map((r) => (
              <Link key={r.slug} href={aracHref(r.slug)} className={linkSinifi}>
                {r.baslik}
              </Link>
            ))}
            <Link href="/hukuki-araclar" className="font-sans text-xs tracking-widest uppercase text-accent mt-1">
              Tüm araçlar →
            </Link>
          </div>

          <div className="flex flex-col gap-3" data-no-attribution>
            <h2 className={baslikSinifi}>İletişim</h2>
            {ayarlar.adres && <p className="font-serif text-lg leading-relaxed whitespace-pre-line">{ayarlar.adres}</p>}
            {ayarlar.telefon && (
              <a href={`tel:${ayarlar.telefonLink}`} className="font-serif text-lg hover:text-accent transition-colors">
                {ayarlar.telefon}
              </a>
            )}
            {ayarlar.eposta && (
              <a href={`mailto:${ayarlar.eposta}`} className="font-serif text-lg hover:text-accent transition-colors break-all">
                {ayarlar.eposta}
              </a>
            )}
            {ayarlar.calismaSaatleri && (
              <p className="font-sans text-sm opacity-70 whitespace-pre-line mt-2">{ayarlar.calismaSaatleri}</p>
            )}
            {sosyal.length > 0 && (
              <div className="flex gap-4 mt-2">
                {sosyal.map((s) => (
                  <a
                    key={s.ad}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm flex items-center gap-1 group hover:text-accent transition-colors"
                  >
                    {s.ad}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-16">
          <h2 className={baslikSinifi}>Konum</h2>
          <FooterMap sorgu={ayarlar.haritaSorgusu} adres={ayarlar.adres} />
        </div>

        <div className="border-t border-border pt-8 flex flex-col gap-6">
          <nav aria-label="Yasal bağlantılar" className="flex flex-wrap gap-x-6 gap-y-2">
            {YASAL_LINKLER.map((l) => (
              <Link key={l.href} href={l.href} className="font-sans text-xs uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-accent transition-colors">
                {l.name}
              </Link>
            ))}
            <CookiePreferencesButton className="font-sans text-xs uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-accent transition-colors" />
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <p className="font-sans text-xs leading-relaxed opacity-60 max-w-3xl">
              Büromuzun faaliyetleri 1136 sayılı Avukatlık Kanunu ve Türkiye Barolar Birliği Meslek Kuralları çerçevesinde yürütülür. Bu
              sitedeki içerikler yalnızca genel bilgilendirme amacı taşır; hukuki görüş veya danışmanlık niteliğinde değildir.{" "}
              <Link href="/yasal-uyari" className="underline underline-offset-4 hover:text-accent">
                Yasal Uyarı
              </Link>
            </p>
            <p className="font-sans text-xs uppercase tracking-widest opacity-60 shrink-0">
              © {new Date().getFullYear()} {ayarlar.unvan}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
