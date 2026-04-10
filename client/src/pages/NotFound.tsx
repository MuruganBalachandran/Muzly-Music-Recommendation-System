import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import LiquidEther from "@/components/animations/LiquidEther";
import ClickSpark from "@/components/animations/ClickSpark";
import { NotFound as NotFoundComponent } from "@/components/common/NotFound";

const NotFoundPage = () => {
  return (
    <ClickSpark sparkColor='#FF9FFC' sparkSize={12} sparkRadius={20} sparkCount={8} duration={500}>
      <div className="min-h-screen relative">
        <div className="fixed inset-0 -z-10">
          <LiquidEther colors={['#1a1a1a', '#0f0f0f', '#262626']} mouseForce={15} cursorSize={80} autoDemo={true} autoSpeed={0.3} autoIntensity={1.5} />
        </div>
        <Header />
        <main className="pt-24">
          <NotFoundComponent />
        </main>
        <Footer />
      </div>
    </ClickSpark>
  );
};

export default NotFoundPage;
