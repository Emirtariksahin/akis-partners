import { LegalPage, yasalSayfaMetadata } from "@/components/site/LegalPage";

const SLUG = "cerez-politikasi";

export const generateMetadata = () => yasalSayfaMetadata(SLUG);

export default function Page() {
  return <LegalPage slug={SLUG} />;
}
