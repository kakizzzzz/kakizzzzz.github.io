import React, { useEffect, useState } from "react";

interface MobileOptimizerProps {
  children: React.ReactNode;
}

const MobileOptimizer: React.FC<MobileOptimizerProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const prevOverscrollBehavior = document.body.style.overscrollBehavior;
    const visualViewport = window.visualViewport;
    let rafId = 0;

    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Prevent pull-to-refresh on mobile
    document.body.style.overscrollBehavior = "none";

    // Optimize viewport height for mobile browsers
    const setVH = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }

      rafId = window.requestAnimationFrame(() => {
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const vh = viewportHeight * 0.01;

        document.documentElement.style.setProperty("--vh", `${vh}px`);
        document.documentElement.style.setProperty("--app-height", `${Math.round(viewportHeight)}px`);
      });
    };

    setVH();
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", setVH);
    visualViewport?.addEventListener("resize", setVH);
    visualViewport?.addEventListener("scroll", setVH);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
      visualViewport?.removeEventListener("resize", setVH);
      visualViewport?.removeEventListener("scroll", setVH);
      document.body.style.overscrollBehavior = prevOverscrollBehavior;
      document.documentElement.style.removeProperty("--vh");
      document.documentElement.style.removeProperty("--app-height");
    };
  }, []);

  return (
    <>
      {isMobile && (
        <style>{`
          /* Mobile-specific optimizations */
          html {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          /* Use calculated viewport height */
          .h-screen {
            height: 100vh;
            height: calc(var(--vh, 1vh) * 100);
          }

          .min-h-screen {
            min-height: 100vh;
            min-height: calc(var(--vh, 1vh) * 100);
          }

          /* Disable text selection on interactive elements */
          button,
          .cursor-pointer {
            -webkit-tap-highlight-color: transparent;
            user-select: none;
          }
        `}</style>
      )}
      {children}
    </>
  );
}

export default MobileOptimizer;
