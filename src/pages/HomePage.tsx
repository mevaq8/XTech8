import HeroSection from "@/components/home/HeroSection";
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
      <HeroSection />
      {/* Smooth gradient transition from dark Hero to light product section */}
      <div
        className="h-16 sm:h-20 -mt-1"
        style={{
          background: "linear-gradient(to bottom, #0F172A 0%, #1E293B 30%, #334155 60%, #F8FAFC 100%)",
        }}
      />
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
