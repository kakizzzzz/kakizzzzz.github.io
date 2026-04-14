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
  const isNativeTouchScrollRef = useRef(false);
  const viewportWidthRef = useRef(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const isTouchDevice =
      window.matchMedia('(pointer: coarse)').matches || window.navigator.maxTouchPoints > 0;

    isNativeTouchScrollRef.current = isTouchDevice;

    if (isTouchDevice) {
      const refreshTouchScrollTrigger = (force = false) => {
        const nextWidth = window.innerWidth;
        const widthChanged = Math.abs(nextWidth - viewportWidthRef.current) > 2;

        if (!force && !widthChanged) {
          return;
        }

        viewportWidthRef.current = nextWidth;
        ScrollTrigger.refresh();
      };
      const handleResize = () => refreshTouchScrollTrigger();
      const handleOrientationChange = () => refreshTouchScrollTrigger(true);

      if (enabled) {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.documentElement.classList.remove('lenis-stopped');
      } else {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.documentElement.classList.add('lenis-stopped');
      }

      viewportWidthRef.current = window.innerWidth;
      window.addEventListener('resize', handleResize, { passive: true });
      window.addEventListener('orientationchange', handleOrientationChange);
      refreshTouchScrollTrigger(true);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleOrientationChange);
        document.documentElement.classList.remove('lenis-stopped');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      };
    }

    const touchDuration = 0.22;

    // Keep touch scrolling close to native mobile behavior.
    const lenis = new Lenis({
      duration: isTouchDevice ? touchDuration : 0.72,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !isTouchDevice,
      syncTouch: false,
      syncTouchLerp: undefined,
      touchInertiaMultiplier: undefined,
      wheelMultiplier: 0.94,
      touchMultiplier: isTouchDevice ? 1 : 1.1,
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
    if (isNativeTouchScrollRef.current) {
      if (enabled) {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.documentElement.classList.remove('lenis-stopped');
      } else {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.documentElement.classList.add('lenis-stopped');
      }
      return;
    }

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
