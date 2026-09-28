import { REHBERLER, aracHref } from "@/lib/taxonomy";

export type NavAltLink = { name: string; href: string; desc?: string };
export type NavItem = { name: string; href: string; children?: NavAltLink[]; mega?: boolean };

export const NAV_ITEMS: NavItem[] = [
  {
    name: "Hakkımızda",
    href: "/kurumsal",
    children: [
      { name: "Biz Kimiz?", href: "/kurumsal", desc: "Büromuz, çalışma anlayışımız ve ilkelerimiz" },
      { name: "Ekibimiz", href: "/ekibimiz", desc: "Avukatlarımız ve özgeçmişleri" },
    ],
  },
  { name: "Faaliyet Alanları", href: "/faaliyet-alanlari", mega: true },
  {
    name: "Hukuki Araçlar",
    href: "/hukuki-araclar",
    children: [
      { name: "Hesaplama Araçları", href: "/hukuki-araclar", desc: "Tazminat, harç, vekalet ücreti ve daha fazlası" },
      ...REHBERLER.map((r) => ({ name: r.baslik, href: aracHref(r.slug), desc: r.ozet })),
    ],
  },
  { name: "Makaleler", href: "/makaleler" },
];

export const YASAL_LINKLER = [
  { name: "Yasal Uyarı", href: "/yasal-uyari" },
  { name: "KVKK Aydınlatma Metni", href: "/kvkk-aydinlatma-metni" },
  { name: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
  { name: "Çerez Politikası", href: "/cerez-politikasi" },
];

/** Header/Footer'a aktarılan hafif faaliyet alanı bilgisi. */
export type NavAlan = { slug: string; baslik: string; kategori: string };
