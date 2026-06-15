import HeroSection from "@/components/home/HeroSection";
import SuperOffers from "@/components/home/SuperOffers";
import CategoryNav from "@/components/home/CategoryNav";
import ProductGrid from "@/components/home/ProductGrid";
import WideCtaBanner from "@/components/home/WideCtaBanner";
import BentoFeatures from "@/components/home/BentoFeatures";
import HowItWorks from "@/components/home/HowItWorks";
import CustomerConfidence from "@/components/home/CustomerConfidence";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <SuperOffers />
      <CategoryNav />
      <ProductGrid />
      <WideCtaBanner />
      <BentoFeatures />
      <HowItWorks />
      <CustomerConfidence />
    </main>
  );
}
