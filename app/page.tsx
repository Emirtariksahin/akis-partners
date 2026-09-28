import { HeroSection } from "@/components/home/HeroSection";
import { FirmIntro } from "@/components/home/FirmIntro";
import { ExpertiseSection } from "@/components/home/ExpertiseSection";
import { WhyAkisSection } from "@/components/home/WhyAkisSection";
import { StatsSection } from "@/components/home/StatsSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { FeaturedArticlesSection } from "@/components/home/FeaturedArticles";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ContactCTASection } from "@/components/home/ContactCTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FirmIntro />
      <ExpertiseSection />
      <WhyAkisSection />
      <StatsSection />
      <ProcessSection />
      <FeaturedArticlesSection />
      <TestimonialsSection />
      <ContactCTASection />
    </>
  );
}
