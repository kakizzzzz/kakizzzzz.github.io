import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { ProjectData, ProjectModuleData } from '../types';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUp,
  Coffee,
  FileText,
  PawPrint,
  Smartphone,
  Store,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getMobileImageSource } from '../imageVariants';

gsap.registerPlugin(ScrollTrigger);

const loadUiExhibitionViewer = () => import('./UiExhibitionViewer');
const loadAmazonProductShowcase = () => import('./AmazonProductShowcase');
const loadLongScrollCaseStudy = () => import('./LongScrollCaseStudy');
const loadPosterGalleryShowcase = () => import('./PosterGalleryShowcase');

const UiExhibitionViewer = lazy(loadUiExhibitionViewer);
const AmazonProductShowcase = lazy(loadAmazonProductShowcase);
const LongScrollCaseStudy = lazy(loadLongScrollCaseStudy);
const PosterGalleryShowcase = lazy(loadPosterGalleryShowcase);

interface ProjectDetailProps {
  project: ProjectData;
  onBack: () => void;
}

const getModuleStatusLabel = (module: ProjectModuleData) => {
  switch (module.display) {
    case 'ui':
      return `${module.images?.length ?? 0} Screens`;
    case 'amazon':
      return `${module.amazon?.galleryImages.length ?? 0} Main Images`;
    case 'long-scroll': {
      const count =
        module.sections?.reduce((total, section) => total + section.images.length, 0) ??
        module.images?.length ??
        0;
      return `${count} Boards`;
    }
    case 'gallery':
      return `${module.images?.length ?? 0} Posters`;
    default:
      return 'Showcase';
  }
};

const renderModuleStage = (module: ProjectModuleData) => {
  switch (module.display) {
    case 'ui':
      return module.images?.length ? (
        <UiExhibitionViewer moduleId={module.id} title={module.title} images={module.images} />
      ) : null;
    case 'amazon':
      return <AmazonProductShowcase module={module} />;
    case 'long-scroll':
      return <LongScrollCaseStudy module={module} />;
    case 'gallery':
      return <PosterGalleryShowcase module={module} />;
    default:
      return null;
  }
};

const moduleUsesInnerHeader = (module: ProjectModuleData) =>
  module.display === 'long-scroll' ||
  module.display === 'gallery';

const StageLoadingCard: React.FC<{ label: string; detail: string }> = ({ label, detail }) => (
  <div className="rounded-[28px] border border-white/10 bg-[#0b1019] px-6 py-16 text-center">
    <div className="mx-auto max-w-xl">
      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/35">{label}</div>
      <p className="mt-4 text-sm leading-relaxed text-white/55">{detail}</p>
    </div>
  </div>
);

const THINKING_STEPS = [
  { title: 'Discovery', desc: 'Understanding the project context and the viewing flow that best suits the work.' },
  { title: 'Structure', desc: 'Defining a readable sequence, from opening frame to supporting material and process.' },
  { title: 'Refining', desc: 'Balancing typography, framing, and rhythm so each work reads clearly inside the portfolio.' },
  { title: 'Delivery', desc: 'Packaging the final showcase into a clean, navigable presentation format.' },
];

const TIMELINE_NODE_SIZE = 9;
const TIMELINE_NODE_TOP_OFFSET = 1.5;
const TIMELINE_NODE_CENTER_OFFSET = TIMELINE_NODE_TOP_OFFSET + TIMELINE_NODE_SIZE / 2;
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const moduleSectionRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const backTapRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const modules = project.modules ?? [];
  const [activeModuleId, setActiveModuleId] = useState<string | null>(modules[0]?.id ?? null);
  const [moduleStageReady, setModuleStageReady] = useState(modules.length === 0);
  const [timelineNodeOffsets, setTimelineNodeOffsets] = useState<number[]>([]);
  const processScrollProgress = useMotionValue(0);

  const activeModule = useMemo(
    () => modules.find((module) => module.id === activeModuleId) ?? modules[0],
    [modules, activeModuleId],
  );

  useEffect(() => {
    if (!activeModule) return;

    switch (activeModule.display) {
      case 'ui':
        void loadUiExhibitionViewer();
        break;
      case 'amazon':
        void loadAmazonProductShowcase();
        break;
      case 'long-scroll':
        void loadLongScrollCaseStudy();
        break;
      case 'gallery':
        void loadPosterGalleryShowcase();
        break;
      default:
        break;
    }
  }, [activeModule]);

  useEffect(() => {
    if (!heroRef.current) return;
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.from('.hero-title', {
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: 'power2.out',
      });

      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.2,
        ease: 'power2.out',
      });
    });

    const refreshTimeout = window.setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      window.clearTimeout(refreshTimeout);
      ctx.revert();
    };
  }, [project.id]);

  useEffect(() => {
    setActiveModuleId(modules[0]?.id ?? null);
  }, [project.id, modules]);

  useEffect(() => {
    setModuleStageReady(modules.length === 0);
  }, [project.id, modules.length]);

  useEffect(() => {
    if (!modules.length) return;

    const target = moduleSectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setModuleStageReady(true);
        observer.disconnect();
      },
      { rootMargin: '560px 0px 560px 0px', threshold: 0.01 },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [project.id, modules.length]);

  useEffect(() => {
    const updateTimelineNodeOffsets = () => {
      if (!processRef.current) return;

      const nextOffsets = stepRefs.current.slice(0, THINKING_STEPS.length).map((stepNode) => {
        if (!stepNode) return 0;
        return stepNode.offsetTop + 8;
      });

      setTimelineNodeOffsets((currentOffsets) => {
        if (
          currentOffsets.length === nextOffsets.length &&
          currentOffsets.every((offset, index) => Math.abs(offset - nextOffsets[index]) < 0.5)
        ) {
          return currentOffsets;
        }

        return nextOffsets;
      });
    };

    const updateProcessProgress = () => {
      if (!processRef.current) return;

      const processRect = processRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + processRect.top;
      const sectionBottom = sectionTop + processRect.height;
      const start = sectionTop - window.innerHeight * 0.8;
      const desiredEnd = sectionBottom - window.innerHeight * 0.88;
      const maxScrollTop = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
      const effectiveEnd = Math.max(start + 1, Math.min(desiredEnd, maxScrollTop));
      const nextProgress = clamp((window.scrollY - start) / (effectiveEnd - start), 0, 1);

      processScrollProgress.set(nextProgress);
    };

    const updateTimelineMetrics = () => {
      updateTimelineNodeOffsets();
      updateProcessProgress();
    };

    const animationFrame = window.requestAnimationFrame(updateTimelineMetrics);
    window.addEventListener('scroll', updateProcessProgress, { passive: true });
    window.addEventListener('resize', updateTimelineMetrics);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateTimelineMetrics());
      if (processRef.current) {
        resizeObserver.observe(processRef.current);
      }
      stepRefs.current.forEach((stepNode) => {
        if (stepNode) resizeObserver?.observe(stepNode);
      });
      if (document.body) {
        resizeObserver.observe(document.body);
      }
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', updateProcessProgress);
      window.removeEventListener('resize', updateTimelineMetrics);
      resizeObserver?.disconnect();
    };
  }, [project.id, processScrollProgress]);

  const renderModuleIcon = (module: ProjectModuleData) => {
    if (module.display === 'amazon') {
      return <Store size={18} className="text-[#f2c36e]" />;
    }

    if (
      module.display === 'long-scroll' ||
      module.display === 'gallery'
    ) {
      return <FileText size={18} className="text-[#bfd6ff]" />;
    }

    if (module.id.includes('pet')) return <PawPrint size={18} className="text-[#9ec7ff]" />;
    if (module.id.includes('milk')) return <Coffee size={18} className="text-[#ffd58a]" />;
    return <Smartphone size={18} className="text-[#99f0eb]" />;
  };

  const timelineScaleY = useSpring(processScrollProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const timelineTrackTop =
    timelineNodeOffsets.length > 0 ? timelineNodeOffsets[0] + TIMELINE_NODE_CENTER_OFFSET : 0;
  const timelineTrackHeight =
    timelineNodeOffsets.length > 1
      ? timelineNodeOffsets[timelineNodeOffsets.length - 1] - timelineNodeOffsets[0]
      : undefined;
  const handleJumpToModules = () => {
    moduleSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const handleBackPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    backTapRef.current = { x: event.clientX, y: event.clientY, active: true };
  };
  const handleBackPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!backTapRef.current.active) return;
    const deltaX = event.clientX - backTapRef.current.x;
    const deltaY = event.clientY - backTapRef.current.y;
    if (Math.hypot(deltaX, deltaY) > 8) {
      backTapRef.current.active = false;
    }
  };
  const handleBackPointerCancel = () => {
    backTapRef.current.active = false;
  };
  const handleBackPointerUp = () => {
    if (!backTapRef.current.active) return;
    backTapRef.current.active = false;
    onBack();
  };
  const handleBackKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      <button
        type="button"
        aria-label="Return"
        title="Return"
        className="fixed z-[45] flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
        style={{
          top: 'calc(env(safe-area-inset-top) + 6.5rem)',
          left: 'calc(env(safe-area-inset-left) + 2rem)',
        }}
        onPointerDown={handleBackPointerDown}
        onPointerMove={handleBackPointerMove}
        onPointerCancel={handleBackPointerCancel}
        onPointerUp={handleBackPointerUp}
        onKeyDown={handleBackKeyDown}
      >
        <ArrowLeft size={16} />
      </button>

      {modules.length > 0 && (
        <button
          type="button"
          onClick={handleJumpToModules}
          aria-label="Jump to module selection"
          title="Jump to module selection"
          className="fixed z-[45] flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
          style={{
            right: 'calc(env(safe-area-inset-right) + 2rem)',
            bottom: 'calc(env(safe-area-inset-bottom) + 1.25rem)',
          }}
        >
          <ArrowUp size={16} />
        </button>
      )}

      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-20">
          <ImageWithFallback
            src={project.heroImage}
            mobileSrc={getMobileImageSource(project.heroImage)}
            alt={`${project.title} hero`}
            className="w-full h-full object-cover opacity-25"
            loading="eager"
            decoding="async"
            loadingEffect="none"
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#222_0%,#000_80%)] -z-10" />

        <div className="text-center z-10 px-6 max-w-6xl">
          <motion.div className="hero-subtitle text-xs md:text-sm uppercase tracking-[0.3em] text-white/40 mb-8 font-mono">
            {project.category}
          </motion.div>

          <motion.h1 className="hero-title text-5xl md:text-7xl font-serif font-light tracking-tight leading-tight mb-12 text-white/90">
            {project.title}
          </motion.h1>

          <motion.div className="hero-subtitle flex flex-wrap justify-center gap-8 text-[10px] md:text-xs font-mono text-white/40 uppercase tracking-widest">
            <span className="border-b border-white/10 pb-1">Client: {project.client}</span>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-20">
        <div className="max-w-6xl mx-auto space-y-40">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start border-t border-white/10 pt-16">
            <div className="md:col-span-4">
              <h2 className="text-2xl font-serif font-light text-white/90">The Challenge</h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-lg md:text-xl text-white/60 leading-relaxed font-light">{project.challenge}</p>
            </div>
          </div>

          {modules.length > 0 ? (
            <div ref={moduleSectionRef} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {modules.map((module, index) => {
                  const isActive = module.id === activeModule?.id;
                  const hasImageCover = module.display !== 'ui' && Boolean(module.cover);

                  return (
                    <button
                      key={module.id}
                      type="button"
                      onClick={() => setActiveModuleId(module.id)}
                      className={`group relative overflow-hidden rounded-xl border transition-all ${
                        isActive
                          ? 'border-[#7ea5e6] bg-[#111b2f]'
                          : 'border-white/10 bg-[#080d18] hover:border-white/30'
                      }`}
                    >
                      {hasImageCover ? (
                        <div className="h-[148px] w-full overflow-hidden bg-[#0d1524]">
                          <ImageWithFallback
                            src={module.cover ?? ''}
                            mobileSrc={getMobileImageSource(module.cover)}
                            alt={module.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                            loadingEffect={module.loadingEffect}
                          />
                        </div>
                      ) : module.display === 'ui' ? (
                        <div className="px-4 pt-4">
                          <div
                            className={`mb-2 flex h-[76px] w-full items-center justify-between rounded-xl border px-4 ${
                              isActive ? 'border-[#8db3ef]' : 'border-white/15'
                            }`}
                            style={{ backgroundColor: module.coverColor ?? '#1B2A45' }}
                          >
                            {renderModuleIcon(module)}
                            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/70">
                              ENTRY 0{index + 1}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="px-4 pt-4">
                          <div
                            className={`mb-2 flex h-[76px] w-full items-center justify-between rounded-xl border border-dashed px-4 ${
                              isActive ? 'border-[#8db3ef] bg-[#182233]' : 'border-white/12 bg-[#101723]'
                            }`}
                          >
                            {renderModuleIcon(module)}
                            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/45">
                              Reserved
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="px-4 py-4 text-left">
                        <div className="mb-1 text-[10px] font-mono uppercase tracking-[0.18em] text-white/40">
                          ENTRY 0{index + 1}
                        </div>
                        <h3 className="text-sm md:text-base font-serif text-white/90">{module.title}</h3>
                        <p className="mt-1 text-[11px] text-white/55">{module.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {activeModule && (
                <motion.div
                  key={`${activeModule.id}-${activeModule.display}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className={`rounded-2xl border border-white/10 bg-[#070c16] ${
                    moduleUsesInnerHeader(activeModule) ? 'p-2 md:p-3' : 'p-3 md:p-5'
                  }`}
                >
                  {moduleUsesInnerHeader(activeModule) ? (
                    <div className="mb-2 flex items-center justify-between gap-3 px-1.5 pt-1">
                      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
                        Exhibition View
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/30">
                        {getModuleStatusLabel(activeModule)}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 flex items-end justify-between gap-3">
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/35">
                          Exhibition View
                        </div>
                        <h4 className="text-lg md:text-2xl font-serif text-white/90">{activeModule.title}</h4>
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/35">
                        {getModuleStatusLabel(activeModule)}
                      </div>
                    </div>
                  )}

                  {moduleStageReady ? (
                    <Suspense
                      fallback={
                        <StageLoadingCard
                          label="Loading Exhibition View"
                          detail="Preparing the selected module so the case study opens without pulling every viewer into the first project chunk."
                        />
                      }
                    >
                      {renderModuleStage(activeModule)}
                    </Suspense>
                  ) : (
                    <StageLoadingCard
                      label="Preparing Exhibition View"
                      detail="Heavy long-scroll boards load when this section is close to the viewport so the page enters more smoothly."
                    />
                  )}
                </motion.div>
              )}
            </div>
          ) : (
            <div className="space-y-32">
              {project.images.map((image, imageIndex) => (
                <motion.div
                  key={imageIndex}
                  className={`relative ${imageIndex % 2 !== 0 ? 'md:ml-auto md:w-[85%]' : 'md:w-[95%]'}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.8 }}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${project.title} shot ${imageIndex + 1}`}
                    className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out opacity-90 hover:opacity-100"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="mt-4 text-[10px] font-mono text-white/20 uppercase tracking-widest text-right">
                    Ref_0{imageIndex + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start border-t border-white/10 pt-16">
            <div className="md:col-span-4">
              <h2 className="text-2xl font-serif font-light text-white/90">The Solution</h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-lg md:text-xl text-white/60 leading-relaxed font-light">{project.solution}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-40 px-6 bg-[#080808]">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="text-3xl font-serif font-light mb-32 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Process
          </motion.h2>

          <div ref={processRef} className="relative overflow-hidden">
            <div
              className="absolute left-4 w-px -translate-x-1/2 md:left-1/2"
              style={
                timelineTrackHeight
                  ? { top: `${timelineTrackTop}px`, height: `${timelineTrackHeight}px` }
                  : { top: 0, height: '100%' }
              }
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-white/12" />

                <motion.div
                  className="absolute inset-0 origin-top bg-gradient-to-b from-[#dbeafe] via-[#93c5fd] to-[#60a5fa]"
                  style={{ scaleY: timelineScaleY }}
                />

                <motion.div
                  className="absolute top-0 -left-[2px] w-[5px] h-full origin-top opacity-90 blur-[0.8px]"
                  style={{
                    scaleY: timelineScaleY,
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.92) 40%, rgba(147,197,253,0) 80%)',
                    backgroundSize: '100% 220px',
                  }}
                  animate={{ backgroundPositionY: ['0px', '220px'] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            </div>

            {timelineNodeOffsets.map((offset, index) => (
              <div
                key={`timeline-node-${index}`}
                className="absolute left-4 z-10 -translate-x-1/2 rounded-full bg-white md:left-1/2"
                style={{
                  top: `${offset + TIMELINE_NODE_TOP_OFFSET}px`,
                  width: `${TIMELINE_NODE_SIZE}px`,
                  height: `${TIMELINE_NODE_SIZE}px`,
                }}
              />
            ))}

            <div className="space-y-32">
              {THINKING_STEPS.map((step, index) => (
                <motion.div
                  key={step.title}
                  ref={(node) => {
                    stepRefs.current[index] = node;
                  }}
                  className="relative w-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div
                    className={`pl-12 ${
                      index % 2 === 0
                        ? 'md:w-[calc(50%-4rem)] md:pl-0 md:text-right'
                        : 'md:ml-[calc(50%+4rem)] md:w-[calc(50%-4rem)] md:pl-0'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-white/30 mb-2 block uppercase tracking-widest">
                      Phase 0{index + 1}
                    </span>
                    <h3 className="text-xl mb-2 font-medium text-white/90">{step.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed max-w-xs ml-auto mr-auto md:mx-0">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
