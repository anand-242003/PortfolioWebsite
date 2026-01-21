import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface KineticTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

const KineticText = ({ 
  children, 
  className = '', 
  as: Component = 'h1' 
}: KineticTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [skewY, setSkewY] = useState(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime.current;
      
      if (deltaTime > 0) {
        const velocity = (currentScrollY - lastScrollY.current) / deltaTime;
        const newSkew = Math.max(-15, Math.min(15, velocity * 10));
        setSkewY(newSkew);
      }
      
      lastScrollY.current = currentScrollY;
      lastTime.current = currentTime;
    };

    // Debounce scroll handler
    let rafId: number;
    const debouncedScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', debouncedScroll, { passive: true });

    // Reset skew when not scrolling
    const resetInterval = setInterval(() => {
      if (Date.now() - lastTime.current > 100) {
        setSkewY((prev) => prev * 0.9);
      }
    }, 50);

    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      cancelAnimationFrame(rafId);
      clearInterval(resetInterval);
    };
  }, []);

  const MotionComponent = motion[Component];

  return (
    <div ref={containerRef} className="overflow-hidden">
      <MotionComponent
        className={`font-display ${className}`}
        style={{ skewY: `${skewY}deg` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {children}
      </MotionComponent>
    </div>
  );
};

export default KineticText;
