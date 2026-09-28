import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { JsonLd } from "./JsonLd";

export type BreadcrumbAdimi = { ad: string; yol: string };

/** Görünür içerik yolu + BreadcrumbList yapılandırılmış verisi. Son adım geçerli sayfadır. */
export function Breadcrumbs({ adimlar }: { adimlar: BreadcrumbAdimi[] }) {
  const tum = [{ ad: "Ana Sayfa", yol: "/" }, ...adimlar];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(tum)} />
      <nav aria-label="İçerik yolu" className="mb-10">
        <ol className="flex flex-wrap items-center gap-2 font-sans text-[11px] tracking-widest uppercase opacity-60">
          {tum.map((a, i) => (
            <li key={a.yol} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="w-3 h-3" aria-hidden />}
              {i === tum.length - 1 ? (
                <span aria-current="page">{a.ad}</span>
              ) : (
                <Link href={a.yol} className="hover:text-accent transition-colors">
                  {a.ad}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
