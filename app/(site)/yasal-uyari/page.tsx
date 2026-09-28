import { LegalPage, yasalSayfaMetadata } from "@/components/site/LegalPage";

const SLUG = "yasal-uyari";

export const generateMetadata = () => yasalSayfaMetadata(SLUG);

export default function Page() {
  return <LegalPage slug={SLUG} />;
}
