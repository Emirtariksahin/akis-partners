import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function NotFound() {
  return (
    <div className="pt-48 md:pt-64 pb-32 bg-background flex-1">
      <div className="container mx-auto px-6 md:px-12 max-w-3xl">
        <p className="font-serif text-[clamp(6rem,15vw,12rem)] leading-none text-accent/30 mb-6">404</p>
        <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-tight tracking-tight mb-6">Aradığınız sayfa bulunamadı.</h1>
        <p className="font-sans text-lg opacity-70 mb-12">
          Sayfa taşınmış veya kaldırılmış olabilir. Aşağıdaki bağlantılardan devam edebilirsiniz.
        </p>
        <div className="flex flex-wrap gap-6 items-center">
          <MagneticButton href="/" variant="secondary" showArrow>
            Ana Sayfa
          </MagneticButton>
          <Link href="/faaliyet-alanlari" className="font-sans text-xs uppercase tracking-widest hover:text-accent transition-colors">
            Faaliyet Alanları
          </Link>
          <Link href="/hukuki-araclar" className="font-sans text-xs uppercase tracking-widest hover:text-accent transition-colors">
            Hukuki Araçlar
          </Link>
        </div>
      </div>
    </div>
  );
}
