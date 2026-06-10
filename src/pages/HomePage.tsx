import BannerSlider from "@/components/home/BannerSlider";
import SuperOffers from "@/components/home/SuperOffers";
import TrustStrip from "@/components/home/TrustStrip";
import CategoryNav from "@/components/home/CategoryNav";
import ProductGrid from "@/components/home/ProductGrid";
import WideCtaBanner from "@/components/home/WideCtaBanner";
import BentoFeatures from "@/components/home/BentoFeatures";
import HowItWorks from "@/components/home/HowItWorks";
import CustomerConfidence from "@/components/home/CustomerConfidence";

export default function HomePage() {
  return (
    <main>
      <BannerSlider />
      <SuperOffers />
      <TrustStrip />
      <CategoryNav />
      <ProductGrid />
      <WideCtaBanner />
      <BentoFeatures />
      <HowItWorks />
      <CustomerConfidence />
    </main>
  );
}
