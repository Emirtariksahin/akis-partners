import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type TeamCardProps = {
  slug: string;
  ad: string;
  unvan: string;
  foto: string | null;
  altBilgi?: string;
  kompakt?: boolean;
};

function basHarfler(ad: string) {
  return ad
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toLocaleUpperCase("tr");
}

export function Portre({ ad, foto, className, sizes }: { ad: string; foto: string | null; className?: string; sizes: string }) {
  return (
    <div className={cn("relative w-full aspect-[3/4] overflow-hidden bg-surface", className)}>
      {foto ? (
        <Image
          src={foto}
          alt={`Av. ${ad}`}
          fill
          sizes={sizes}
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground">
          <span className="font-serif text-6xl tracking-widest text-accent/60">{basHarfler(ad)}</span>
        </div>
      )}
    </div>
  );
}

export function TeamCard({ slug, ad, unvan, foto, altBilgi, kompakt }: TeamCardProps) {
  return (
    <Link href={`/ekibimiz/${slug}`} className="group block">
      <Portre ad={ad} foto={foto} className={kompakt ? "mb-4" : "mb-6"} sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw" />
      <h3 className={cn("font-serif group-hover:text-accent transition-colors", kompakt ? "text-xl" : "text-2xl mb-1")}>Av. {ad}</h3>
      <p className="font-sans text-xs tracking-widest uppercase opacity-60">{unvan}</p>
      {altBilgi && <p className="font-sans text-sm opacity-70 mt-3 line-clamp-3">{altBilgi}</p>}
    </Link>
  );
}
