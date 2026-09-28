import type { HesaplamaParametreleri } from "@/lib/calculators/params";
import { KidemIhbar } from "./KidemIhbar";
import { FazlaMesai, Ubgt, YillikIzin } from "./IsciAlacaklari";
import { NetBrut } from "./NetBrut";
import { KiraArtis } from "./KiraArtis";
import { ArabuluculukUcreti, HarcGider, IslahHarci, VekaletUcreti } from "./Yargilama";
import { Infaz } from "./Infaz";
import { Tazminat } from "./Tazminat";

// Hesaplayıcı slug'ı → bileşen. Slug listesi lib/taxonomy.ts içindeki HESAPLAMA_ARACLARI ile aynıdır.
export const HESAPLAYICILAR: Record<string, (props: { p: HesaplamaParametreleri }) => React.ReactNode> = {
  "kidem-ve-ihbar-tazminati-hesaplama": ({ p }) => <KidemIhbar p={p} />,
  "yillik-izin-ucreti-hesaplama": ({ p }) => <YillikIzin p={p} />,
  "fazla-mesai-ucreti-hesaplama": ({ p }) => <FazlaMesai p={p} />,
  "ubgt-ucreti-hesaplama": ({ p }) => <Ubgt p={p} />,
  "netten-brute-brutten-nete-hesaplama": ({ p }) => <NetBrut p={p} />,
  "kira-artis-orani-hesaplama": ({ p }) => <KiraArtis p={p} />,
  "mahkeme-harc-ve-gider-hesaplama": ({ p }) => <HarcGider p={p} />,
  "islah-harci-hesaplama": ({ p }) => <IslahHarci p={p} />,
  "vekalet-ucreti-hesaplama": ({ p }) => <VekaletUcreti p={p} />,
  "arabuluculuk-ucreti-hesaplama": ({ p }) => <ArabuluculukUcreti p={p} />,
  "infaz-yatar-hesaplama": () => <Infaz />,
  "trafik-kazasi-tazminati-hesaplama": ({ p }) => <Tazminat p={p} tur="trafik" />,
  "is-kazasi-tazminati-hesaplama": ({ p }) => <Tazminat p={p} tur="is" />,
};
