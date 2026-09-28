import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingElements } from "@/components/layout/FloatingElements";
import { IntroLoader } from "@/components/ui/IntroLoader";
import { CopyAttribution } from "@/components/site/CopyAttribution";
import { CookieConsent } from "@/components/site/CookieConsent";
import { getFaaliyetAlanlari, getSiteAyarlari } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const ACIKLAMA =
  "Ankara merkezli Akış Partners; bireysel ve kurumsal müvekkillere avukatlık ve hukuki danışmanlık hizmeti sunar.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Akış Partners | Hukuk & Danışmanlık", template: "%s | Akış Partners" },
  description: ACIKLAMA,
  openGraph: {
    siteName: "Akış Partners Hukuk & Danışmanlık",
    title: "Akış Partners | Hukuk & Danışmanlık",
    description: ACIKLAMA,
    type: "website",
    locale: "tr_TR",
  },
  twitter: { card: "summary_large_image" },
};

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [ayarlar, alanlar] = await Promise.all([getSiteAyarlari(), getFaaliyetAlanlari()]);
  const navAlanlar = alanlar.map(({ slug, baslik, kategori }) => ({ slug, baslik, kategori }));

  return (
    <html
      lang="tr"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${manrope.variable}`}
    >
      <body
        className="antialiased min-h-screen flex flex-col relative selection:bg-accent selection:text-background"
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <IntroLoader />
          <Header
            alanlar={navAlanlar}
            telefon={ayarlar.telefon}
            adresKisa={ayarlar.adresKisa}
            duyuru={ayarlar.duyuru.aktif && ayarlar.duyuru.metin ? ayarlar.duyuru.metin : undefined}
          />
          <main className="flex-1 flex flex-col min-h-screen">{children}</main>
          <Footer ayarlar={ayarlar} alanlar={navAlanlar} />
          <FloatingElements telefonLink={ayarlar.telefonLink} whatsapp={ayarlar.whatsapp} />
          <CookieConsent />
          <CopyAttribution />
        </ThemeProvider>
      </body>
    </html>
  );
}
