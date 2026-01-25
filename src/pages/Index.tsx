import { Suspense, lazy, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import Navigation from '@/components/dom/Navigation';
import HeroText from '@/components/dom/HeroText';
import BentoGrid from '@/components/dom/BentoGrid';
import SkillsSection from '@/components/dom/SkillsSection';
import ContactSection from '@/components/dom/ContactSection';
import Footer from '@/components/dom/Footer';

const DataFlowLines = lazy(() => import('@/components/canvas/DataFlowLines'));

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

const Canvas3DFallback = () => (
  <div className="absolute inset-0 bg-gradient-radial from-muted/20 to-transparent" />
);

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [show3D, setShow3D] = useState(false);
  
  useSmoothScroll();

  useEffect(() => {
    // Quick initial load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    // Delay 3D canvas to improve LCP
    const canvas3DTimer = setTimeout(() => {
      setShow3D(true);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(canvas3DTimer);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      <div className="grain-overlay" />
      
      <div className="vignette" />

      <Navigation />

      <section className="relative h-screen overflow-hidden bg-background">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="diagonal-lines" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <line x1="0" y1="40" x2="40" y2="0" stroke="#5f5f5f" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diagonal-lines)" />
          </svg>
        </div>
        
        {show3D && (
          <Suspense fallback={<Canvas3DFallback />}>
            <DataFlowLines />
          </Suspense>
        )}
        
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
