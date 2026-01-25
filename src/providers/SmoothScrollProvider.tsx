import { ReactNode, useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProviderProps {
  children: ReactNode;
}

const SmoothScrollProvider = ({ children }: SmoothScrollProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null);
  const [shouldUseSmoothScroll, setShouldUseSmoothScroll] = useState(false);

  useEffect(() => {
    const checkShouldUseSmoothScroll = () => {
      const isMobile = window.innerWidth < 1024 || 
                       /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Disable smooth scroll on mobile or when user prefers reduced motion
      return !isMobile && !prefersReducedMotion;
    };

    setShouldUseSmoothScroll(checkShouldUseSmoothScroll());

    const handleChange = () => {
      setShouldUseSmoothScroll(checkShouldUseSmoothScroll());
    };

    window.addEventListener('resize', handleChange);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      window.removeEventListener('resize', handleChange);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    if (!shouldUseSmoothScroll) {
      // Clean up any existing instance
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    const lenis = new Lenis({
      duration: 1.2, // Smooth scroll duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1, // Normal scroll speed
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [shouldUseSmoothScroll]);

  return <>{children}</>;
};

export default SmoothScrollProvider;
