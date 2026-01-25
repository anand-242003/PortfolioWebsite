import { Suspense, lazy } from 'react';
import Navigation from '@/components/dom/Navigation';
import HeroText from '@/components/dom/HeroText';
import BentoGrid from '@/components/dom/BentoGrid';
import SkillsSection from '@/components/dom/SkillsSection';
import ContactSection from '@/components/dom/ContactSection';
import Footer from '@/components/dom/Footer';

const DataFlowLines = lazy(() => import('@/components/canvas/DataFlowLines'));

const Canvas3DFallback = () => (
  <div className="absolute inset-0 bg-gradient-radial from-muted/20 to-transparent" />
);

const Index = () => {
  return (
    <>
      <Navigation />

      <section className="relative h-screen overflow-hidden bg-background">
        <Suspense fallback={<Canvas3DFallback />}>
          <DataFlowLines />
        </Suspense>

        <HeroText />
      </section>

      <BentoGrid />

      <SkillsSection />

      <ContactSection />

      <Footer />
    </>
  );
};

export default Index;
