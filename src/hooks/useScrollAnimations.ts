/**
 * Scroll-driven storytelling with GSAP ScrollTrigger
 * Implements scroll timeline for Hero, Skills, Projects, and Contact sections
 */
import { useEffect, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Camera } from 'three';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationsProps {
  cameraRef?: RefObject<Camera>;
  heroRef?: RefObject<HTMLElement>;
  skillsRef?: RefObject<HTMLElement>;
  projectsRef?: RefObject<HTMLElement>;
  contactRef?: RefObject<HTMLElement>;
}

export const useScrollAnimations = ({
  cameraRef,
  heroRef,
  skillsRef,
  projectsRef,
  contactRef,
}: ScrollAnimationsProps) => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      
      if (heroRef?.current) {
        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        heroTimeline.from('.hero-title', {
          opacity: 0,
          y: 100,
          duration: 0.5,
        });

        heroTimeline.from(
          '.hero-subtitle',
          {
            opacity: 0,
            y: 50,
            duration: 0.5,
          },
          '-=0.3'
        );

        heroTimeline.from(
          '.hero-cta',
          {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
          },
          '-=0.2'
        );

        if (cameraRef?.current) {
          heroTimeline.to(
            cameraRef.current.position,
            {
              x: 2,
              y: 1,
              z: 10,
              duration: 1,
            },
            0
          );

          heroTimeline.to(
            cameraRef.current.rotation,
            {
              y: Math.PI / 6,
              duration: 1,
            },
            0
          );
        }
      }

      
      if (skillsRef?.current) {
        const skillsTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: skillsRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
          },
        });

        skillsTimeline.from('.skill-card', {
          opacity: 0,
          y: 80,
          stagger: 0.1,
          duration: 0.5,
        });

        if (cameraRef?.current) {
          skillsTimeline.to(
            cameraRef.current.position,
            {
              z: 8,
              duration: 1,
            },
            0
          );
        }
      }

      
      if (projectsRef?.current) {
        const projectsTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: projectsRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
          },
        });

        projectsTimeline.from('.bento-card', {
          opacity: 0,
          scale: 0.9,
          y: 60,
          stagger: 0.15,
          duration: 0.6,
        });

        if (cameraRef?.current) {
          projectsTimeline.to(
            cameraRef.current.position,
            {
              z: 12,
              y: 2,
              duration: 1,
            },
            0
          );
        }
      }

      
      if (contactRef?.current) {
        const contactTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: contactRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
          },
        });

        contactTimeline.from('.contact-form', {
          opacity: 0,
          y: 100,
          duration: 0.6,
        });

        contactTimeline.from(
          '.social-link',
          {
            opacity: 0,
            scale: 0,
            stagger: 0.1,
            duration: 0.4,
          },
          '-=0.3'
        );

        if (cameraRef?.current) {
          contactTimeline.to(
            cameraRef.current.rotation,
            {
              y: Math.PI * 2,
              duration: 2,
            },
            0
          );
        }
      }

      
      gsap.utils.toArray<HTMLElement>('.parallax').forEach((element) => {
        const speed = element.dataset.speed || '0.5';
        gsap.to(element, {
          y: () => parseFloat(speed) * -100,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    });

    return () => {
      ctx.revert(); 
    };
  }, [cameraRef, heroRef, skillsRef, projectsRef, contactRef]);
};
