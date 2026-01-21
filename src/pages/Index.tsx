import { Suspense, lazy, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import Navigation from '@/components/dom/Navigation';
import HeroText from '@/components/dom/HeroText';
import BentoGrid from '@/components/dom/BentoGrid';
import SkillsSection from '@/components/dom/SkillsSection';
import ContactSection from '@/components/dom/ContactSection';
import Footer from '@/components/dom/Footer';
import FluidCursor from '@/components/ui/FluidCursor';

// Lazy load heavy 3D component
const NeuralNetwork = lazy(() => import('@/components/canvas/NeuralNetwork'));

// Loading screen component
const LoadingScreen = () => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.8, ease: 'easeInOut' }}
    className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
  >
    <div className="text-center">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 mx-auto"
      >
        <div className="w-8 h-8 rounded-full bg-primary animate-pulse" />
      </motion.div>
      <motion.p 
        className="font-mono text-sm text-muted-foreground uppercase tracking-widest"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Initializing System...
      </motion.p>
    </div>
  </motion.div>
);

// 3D Loading fallback
const Canvas3DFallback = () => (
  <div className="absolute inset-0 bg-gradient-radial from-muted/20 to-transparent" />
);

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const mousePosition = useMousePosition();
  
  // Initialize smooth scroll
  useSmoothScroll();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      {/* Fluid Cursor (desktop only) */}
      <div className="hidden md:block">
        <FluidCursor />
      </div>

      {/* Film Grain Overlay */}
      <div className="grain-overlay" />
      
      {/* Vignette Effect */}
      <div className="vignette" />

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <Suspense fallback={<Canvas3DFallback />}>
          <NeuralNetwork mousePosition={mousePosition} />
        </Suspense>
        <HeroText />
      </section>

      {/* Projects Section */}
      <BentoGrid />

      {/* Skills Section */}
      <SkillsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Index;
