import { Suspense, lazy } from 'react';
import Navigation from '@/components/dom/Navigation';
import HeroText from '@/components/dom/HeroText';
import BentoGrid from '@/components/dom/BentoGrid';
import SkillsSection from '@/components/dom/SkillsSection';
import ContactSection from '@/components/dom/ContactSection';
import Footer from '@/components/dom/Footer';

const DataFlowLines = lazy(() => import('@/components/canvas/DataFlowLines'));

const Canvas3DFallback = () => (
  <div className="absolute inset-0 bg-gradient-radial from-muted/20 to-transparent" aria-hidden="true" />
);

const Index = () => {
  return (
    <>
      {/* Semantic header with navigation */}
      <header role="banner">
        <Navigation />
      </header>

      {/* Main content area for SEO */}
      <main id="main-content" role="main">
        {/* Hero Section */}
        <section 
          id="hero" 
          className="relative h-screen overflow-hidden bg-background"
          aria-label="Introduction"
        >
          <Suspense fallback={<Canvas3DFallback />}>
            <DataFlowLines />
          </Suspense>
          <HeroText />
        </section>

        {/* Projects Section */}
        <BentoGrid />

        {/* Skills Section */}
        <SkillsSection />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Semantic footer */}
      <Footer />
    </>
  );
};

export default Index;
