import HeroSection from "./HeroSectoin";
import FeaturesSection from "./FeaturesSection";
import DiscoverSection from "./DiscoverSection";
import CallToActionSection from "./CallToActionSection";
import FooterSection from "./FooterSection";

const Landing = () => {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <DiscoverSection />
      <CallToActionSection />
      <FooterSection />
    </main>
  );
};

export default Landing;
