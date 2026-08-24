import { HeroSection } from "@/components/website/home/HeroSection";
import { PhilosophySection } from "@/components/website/home/PhilosophySection";
import { QuoteBanner } from "@/components/website/home/QuoteBanner";
import { CtaSection } from "@/components/website/home/CtaSection";
import PopUpBanner from "@/components/website/home/PopUpBanner";
import AboutUsSection from "@/components/website/home/AboutUsSection";
import Banner from "@/components/website/home/Banner";
import RandomTourPackageSection from "@/components/website/home/RandomTourPackageSection";
import InstaBlog from "@/components/website/home/InstaBlog";
import RoomSection from "@/components/website/home/RoomSection";
import {
  FALLBACK_METADATA,
  getCompanyBasicInfo,
} from "@/services/companyBasicInfo.service";
import { RetreatsSection } from "@/components/website/home/RetreatsSection"
export async function generateMetadata() {
  const company = await getCompanyBasicInfo();
  const title =
    company?.titleTagForMainLandingPage || FALLBACK_METADATA.title;

  return {
    title: {
      absolute: title,
    },
    keywords:
      company?.keywords?.length > 0
        ? company.keywords
        : FALLBACK_METADATA.keywords,
  };
}

export default function HomePage() {
  return (
    <>
      <PopUpBanner />
      <HeroSection />
      <PhilosophySection />
      <AboutUsSection />
      <Banner />
      <RandomTourPackageSection />
      <RoomSection />
      <RetreatsSection/>
      <CtaSection />
      <InstaBlog />
    </>
  );
}
