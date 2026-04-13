import React, { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger to ensure it's available
gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: React.ReactNode;
  enabled?: boolean;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children, enabled = true }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const isTouchDevice =
      window.matchMedia('(pointer: coarse)').matches || window.navigator.maxTouchPoints > 0;

    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: isTouchDevice ? 0.5 : 0.72,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: isTouchDevice,
      syncTouchLerp: isTouchDevice ? 0.12 : undefined,
      touchInertiaMultiplier: isTouchDevice ? 28 : undefined,
      wheelMultiplier: 0.94,
      touchMultiplier: isTouchDevice ? 1.38 : 1.1,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Keep Lenis state aligned with initial `enabled` value.
    if (enabled) {
      lenis.start();
      document.documentElement.classList.remove('lenis-stopped');
    } else {
      lenis.stop();
      document.documentElement.classList.add('lenis-stopped');
    }

    // 2. Connect Lenis to ScrollTrigger
    // This tells ScrollTrigger to update whenever Lenis scrolls
    lenis.on('scroll', ScrollTrigger.update);

    // 3. Sync Lenis update with GSAP's ticker
    // This ensures animations and scrolling stay perfectly in sync
    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);

    // 4. Disable GSAP's lag smoothing to prevent scroll jumps during heavy loads
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove('lenis-stopped');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  // Handle Enable/Disable State
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    if (enabled) {
      lenis.start();
      // Force remove any lock styles that might remain
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.classList.remove('lenis-stopped');
    } else {
      lenis.stop();
      document.documentElement.classList.add('lenis-stopped');
    }
  }, [enabled]);

  return <>{children}</>;
};

export default SmoothScroll;
