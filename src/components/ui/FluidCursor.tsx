import { useEffect, useRef, useCallback } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';

interface Particle {
  x: number;
  y: number;
  opacity: number;
  scale: number;
}

const FluidCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mousePosition = useMousePosition();
  const animationRef = useRef<number>();
  const frameCountRef = useRef(0);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    frameCountRef.current++;
    if (frameCountRef.current % 3 === 0 && (mousePosition.x !== 0 || mousePosition.y !== 0)) {
      particlesRef.current.push({
        x: mousePosition.x,
        y: mousePosition.y,
        opacity: 0.5,
        scale: 1,
      });
    }

    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.opacity -= 0.04;
      particle.scale *= 0.94;

      if (particle.opacity <= 0) return false;

      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        15 * particle.scale
      );
      gradient.addColorStop(0, `rgba(204, 255, 0, ${particle.opacity})`);
      gradient.addColorStop(1, 'rgba(204, 255, 0, 0)');

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 15 * particle.scale, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      return true;
    });

    if (mousePosition.x !== 0 || mousePosition.y !== 0) {
      ctx.beginPath();
      ctx.arc(mousePosition.x, mousePosition.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ccff00';
      ctx.fill();
    }

    if (particlesRef.current.length > 20) {
      particlesRef.current = particlesRef.current.slice(-20);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [mousePosition]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
};

export default FluidCursor;
