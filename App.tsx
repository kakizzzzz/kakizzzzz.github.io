import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SmoothScroll from './components/SmoothScroll';
import Preloader from './components/Preloader';
import Journey from './components/Journey';
import ConsoleRoom from './components/ConsoleRoom';
import Navigation from './components/Navigation';
import { PageState, ProjectCategory } from './types';
import { PROJECTS } from './constants';
import MobileOptimizer from './components/MobileOptimizer';
import { AppRoute, parsePath, pathForRoute, toAppPathname } from './routing';
import { getOptimizedImageSource } from './imageAsset';

const IMAGE_ASSET_PATTERN = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i;
const loadProjectDetail = () => import('./components/ProjectDetail');
const loadContact = () => import('./components/Contact');
const ProjectDetail = lazy(loadProjectDetail);
const Contact = lazy(loadContact);

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    if (typeof window === 'undefined' || !src) {
      resolve();
      return;
    }

    const preferredSrc = getOptimizedImageSource(src) ?? src;
    const image = new window.Image();
    let triedOriginalSource = false;
    const complete = () => resolve();

    image.decoding = 'async';
    image.onload = complete;
    image.onerror = () => {
      if (!triedOriginalSource && preferredSrc !== src) {
        triedOriginalSource = true;
        image.src = src;
        return;
      }

      complete();
    };
    image.src = preferredSrc;

    if (image.complete) {
      resolve();
    }
  });

const preloadFile = (src: string) => {
  if (IMAGE_ASSET_PATTERN.test(src)) {
    return preloadImage(src);
  }

  if (typeof window === 'undefined' || !src) {
    return Promise.resolve();
  }

  return fetch(src, { credentials: 'same-origin' })
    .then(() => undefined)
    .catch(() => undefined);
};

const preloadAssets = async (sources: string[]) => {
  const queue = [...sources];
  const hasLimitedConnection =
    typeof navigator !== 'undefined' &&
    'connection' in navigator &&
    ((navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection?.saveData ||
      ['slow-2g', '2g', '3g'].includes(
        (navigator as Navigator & {
          connection?: { saveData?: boolean; effectiveType?: string };
        }).connection?.effectiveType ?? '',
      ));
  const useConservativePreload = typeof window !== 'undefined' && (window.innerWidth < 768 || hasLimitedConnection);
  const workerCount = Math.min(useConservativePreload ? 1 : 4, queue.length);

  await Promise.allSettled(
    Array.from({ length: workerCount }, async () => {
      while (queue.length) {
        const src = queue.shift();
        if (!src) return;
        await preloadFile(src);
      }
    }),
  );
};

const getProjectPreloadSources = (category: ProjectCategory) => {
  const project = PROJECTS[category];
  if (!project) return [];

  const primarySources = [project.heroImage];
  const secondarySources = project.modules?.map((module) => module.cover) ?? [];
  const isMobilePreload =
    typeof window !== 'undefined' &&
    (window.innerWidth < 768 ||
      ((navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }).connection?.saveData ?? false));
  const sources = isMobilePreload ? [...primarySources, secondarySources[0]] : [...primarySources, ...secondarySources];

  return [...new Set(sources.filter((src): src is string => Boolean(src)))];
};

const RouteFallback: React.FC<{ label: string; fixed?: boolean }> = ({ label, fixed = false }) => (
  <div className={`${fixed ? 'fixed inset-0' : 'min-h-screen'} flex items-center justify-center bg-black`}>
    <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/38">{label}</div>
  </div>
);

const App: React.FC = () => {
  const initialRoute = useMemo<AppRoute>(() => {
    if (typeof window === 'undefined') return { view: 'journey' };
    return parsePath(window.location.pathname);
  }, []);

  const shouldShowLoaderOnBoot = useMemo(
    () => typeof window !== 'undefined' && toAppPathname(window.location.pathname) === '/',
    [],
  );

  const [pageState, setPageState] = useState<PageState>(
    shouldShowLoaderOnBoot ? 'loader' : initialRoute.view,
  );
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | null>(
    initialRoute.view === 'project' ? initialRoute.category : null,
  );
  const [scrollEnabled, setScrollEnabled] = useState(
    shouldShowLoaderOnBoot ? false : initialRoute.view === 'journey' || initialRoute.view === 'project',
  );
  const [isNavOpen, setIsNavOpen] = useState(false);
  const transitionTimeoutsRef = useRef<number[]>([]);
  const transitionRequestRef = useRef(0);

  const clearTransitionTimeouts = useCallback(() => {
    transitionRequestRef.current += 1;
    transitionTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    transitionTimeoutsRef.current = [];
  }, []);

  const createTransitionDelay = useCallback((ms: number) => {
    return new Promise<void>((resolve) => {
      const timeoutId = window.setTimeout(resolve, ms);
      transitionTimeoutsRef.current.push(timeoutId);
    });
  }, []);

  const scrollToJourneyTop = useCallback(() => {
    if (typeof window === 'undefined') return;

    const jumpToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    jumpToTop();
    window.requestAnimationFrame(jumpToTop);
    window.setTimeout(jumpToTop, 60);
  }, []);

  const syncStateToRoute = useCallback((route: AppRoute) => {
    setPageState(route.view);
    if (route.view === 'project') {
      setActiveCategory(route.category);
      setScrollEnabled(true);
      return;
    }

    setActiveCategory(null);
    setScrollEnabled(route.view === 'journey' || route.view === 'contact');
  }, []);

  const navigateToRoute = useCallback(
    (route: AppRoute, options?: { replace?: boolean }) => {
      if (typeof window !== 'undefined') {
        const targetPath = pathForRoute(route);
        if (window.location.pathname !== targetPath) {
          if (options?.replace) {
            window.history.replaceState({}, '', targetPath);
          } else {
            window.history.pushState({}, '', targetPath);
          }
        }
      }

      syncStateToRoute(route);
    },
    [syncStateToRoute],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!shouldShowLoaderOnBoot) {
      const canonicalPath = pathForRoute(initialRoute);
      if (window.location.pathname !== canonicalPath) {
        window.history.replaceState({}, '', canonicalPath);
      }
    }
  }, [initialRoute, shouldShowLoaderOnBoot]);

  useEffect(() => {
    const handlePopState = () => {
      clearTransitionTimeouts();
      setIsNavOpen(false);
      const route = parsePath(window.location.pathname);
      syncStateToRoute(route);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [clearTransitionTimeouts, syncStateToRoute]);

  useEffect(() => {
    return () => {
      clearTransitionTimeouts();
    };
  }, [clearTransitionTimeouts]);

  // 1. Loader -> Journey
  const handlePreloaderComplete = () => {
    navigateToRoute({ view: 'journey' }, { replace: true });
  };

  // 2. Journey/Console -> Project
  const handleCategorySelect = (category: ProjectCategory) => {
    clearTransitionTimeouts();
    setScrollEnabled(false);
    const requestId = transitionRequestRef.current;
    void loadProjectDetail();
    void preloadAssets(getProjectPreloadSources(category));

    createTransitionDelay(140).then(() => {
      if (transitionRequestRef.current !== requestId) return;
      navigateToRoute({ view: 'project', category }, { replace: true });
    });
  };

  // 4. Back to Console/Home
  const handleBack = () => {
    clearTransitionTimeouts();
    navigateToRoute({ view: 'console' }, { replace: true });
  };

  // Global Navigation Handler
  const handleNavigation = (view: 'journey' | 'console' | 'project' | 'contact', category?: ProjectCategory) => {
    clearTransitionTimeouts();
    if (view === 'journey') {
        navigateToRoute({ view: 'journey' });
    } else if (view === 'console') {
        navigateToRoute({ view: 'console' });
    } else if (view === 'contact') {
        void loadContact();
        navigateToRoute({ view: 'contact' });
    } else if (view === 'project' && category) {
        void loadProjectDetail();
        navigateToRoute({ view: 'project', category }, { replace: true });
    }
  };

  const handleHome = () => {
      clearTransitionTimeouts();
      setIsNavOpen(false);
      navigateToRoute({ view: 'journey' });
      scrollToJourneyTop();
  };

  return (
    <MobileOptimizer>
      {/* Added overflow-x-hidden here as a safe alternative to body overflow settings */}
      <div className="relative min-h-screen bg-black text-paper font-sans selection:bg-console-accent selection:text-white overflow-x-hidden">
        
        {/* Home Logo - Top Left */}
        {pageState !== 'loader' && (
          <motion.button
            className="fixed top-[calc(env(safe-area-inset-top)+2rem)] left-[calc(env(safe-area-inset-left)+2rem)] z-50 text-white font-serif font-black tracking-tighter text-2xl hover:opacity-70 transition-opacity"
            onClick={handleHome}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            KAKI
          </motion.button>
        )}

        {/* Global Nav available everywhere except loader */}
        {pageState !== 'loader' && (
            <Navigation onNavigate={handleNavigation} onOpenChange={setIsNavOpen} />
        )}

        <SmoothScroll enabled={scrollEnabled && !isNavOpen}>
            <AnimatePresence mode="wait">
            
            {/* 1. Loader */}
            {pageState === 'loader' && (
                <Preloader key="loader" onComplete={handlePreloaderComplete} />
            )}

            {/* 2. Scroll Journey */}
            {pageState === 'journey' && (
                <motion.div
                    key="journey"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Journey onSelectCategory={handleCategorySelect} />
                </motion.div>
            )}

            {/* 3. Console Room (Fixed Position, No Scroll) */}
            {pageState === 'console' && (
                <motion.div
                    key="console"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="fixed inset-0 z-30"
                >
                    <ConsoleRoom onSelectCategory={handleCategorySelect} />
                </motion.div>
            )}

            {/* 4. Project Details */}
            {pageState === 'project' && activeCategory && (
                <motion.div
                    key="project"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-40 bg-black"
                >
                    <Suspense fallback={<RouteFallback label="Loading Case Study" />}>
                        <ProjectDetail 
                            project={PROJECTS[activeCategory]} 
                            onBack={handleBack}
                        />
                    </Suspense>
                </motion.div>
            )}

            {/* 5. Contact Page */}
            {pageState === 'contact' && (
                <motion.div
                    key="contact"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-40 bg-black"
                >
                    <Suspense fallback={<RouteFallback label="Loading Contact" fixed />}>
                        <Contact onBack={handleBack} />
                    </Suspense>
                </motion.div>
            )}

            </AnimatePresence>
        </SmoothScroll>

      </div>
    </MobileOptimizer>
  );
};

export default App;
