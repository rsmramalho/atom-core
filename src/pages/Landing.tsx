import { useState } from "react";
import { DemoModal } from "@/components/landing/DemoModal";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { PillarSection } from "@/components/landing/PillarSection";
import { AgnosticSection } from "@/components/landing/AgnosticSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { DeveloperSection } from "@/components/landing/DeveloperSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Landing() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden scroll-smooth">
      <DemoModal open={demoOpen} onOpenChange={setDemoOpen} />
      <LandingNav />
      <HeroSection onDemoOpen={() => setDemoOpen(true)} />
      <PillarSection />
      <AgnosticSection />
      <FeaturesSection />
      <BenefitsSection />
      <DeveloperSection />
      <FAQSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
