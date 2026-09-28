import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { FloatingElements } from '@/components/layout/FloatingElements';
import { IntroLoader } from '@/components/ui/IntroLoader';
import { CustomCursor } from '@/components/ui/CustomCursor';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Akış Partners | Hukuk & Danışmanlık',
  description: 'Ankara merkezli; Türkiye genelinde bireysel ve kurumsal müvekkillere stratejik avukatlık ve hukuki danışmanlık hizmetleri.',
  openGraph: {
    title: 'Akış Partners | Hukuk & Danışmanlık',
    description: 'Ankara merkezli stratejik avukatlık ve hukuki danışmanlık hizmetleri.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Akış Partners | Hukuk & Danışmanlık',
    description: 'Stratejik avukatlık ve hukuki danışmanlık hizmetleri.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="antialiased min-h-screen flex flex-col relative selection:bg-accent selection:text-background" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CustomCursor />
          <IntroLoader />
          <AnnouncementBar />
          <Header />
          <main className="flex-1 flex flex-col min-h-screen">
            {children}
          </main>
          <Footer />
          <FloatingElements />
        </ThemeProvider>
      </body>
    </html>
  );
}
