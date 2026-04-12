import React, { useEffect, useState } from "react";

interface MobileOptimizerProps {
  children: React.ReactNode;
}

const MobileOptimizer: React.FC<MobileOptimizerProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const prevOverscrollBehavior = document.body.style.overscrollBehavior;

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
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("resize", setVH);
      document.body.style.overscrollBehavior = prevOverscrollBehavior;
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
