import { LegalPage, yasalSayfaMetadata } from "@/components/site/LegalPage";

const SLUG = "kvkk-aydinlatma-metni";

export const generateMetadata = () => yasalSayfaMetadata(SLUG);

export default function Page() {
  return <LegalPage slug={SLUG} />;
}
