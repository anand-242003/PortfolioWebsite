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

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Add new particle at mouse position
    if (mousePosition.x !== 0 || mousePosition.y !== 0) {
      particlesRef.current.push({
        x: mousePosition.x,
        y: mousePosition.y,
        opacity: 0.8,
        scale: 1,
      });
    }

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.opacity -= 0.02;
      particle.scale *= 0.96;

      if (particle.opacity <= 0) return false;

      // Draw particle
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        20 * particle.scale
      );
      gradient.addColorStop(0, `rgba(204, 255, 0, ${particle.opacity})`);
      gradient.addColorStop(1, 'rgba(204, 255, 0, 0)');

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 20 * particle.scale, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      return true;
    });

    // Draw main cursor
    if (mousePosition.x !== 0 || mousePosition.y !== 0) {
      ctx.beginPath();
      ctx.arc(mousePosition.x, mousePosition.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#ccff00';
      ctx.fill();
    }

    // Limit particles array
    if (particlesRef.current.length > 50) {
      particlesRef.current = particlesRef.current.slice(-50);
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
    window.addEventListener('resize', handleResize);

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
    />
  );
};

export default FluidCursor;
