import React, { useEffect, useRef, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface UiExhibitionViewerProps {
  moduleId: string;
  title: string;
  images: string[];
}

const UiExhibitionViewer: React.FC<UiExhibitionViewerProps> = ({ moduleId, title, images }) => {
  const basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const viewportRef = useRef<HTMLDivElement>(null);
  const phoneShellRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    active: false,
    pointerId: -1,
    startY: 0,
    startScrollTop: 0,
  });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [panelHeight, setPanelHeight] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [moduleId]);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = 0;
    }
  }, [moduleId, activeImageIndex]);

  useEffect(() => {
    const shell = phoneShellRef.current;
    if (!shell) return;

    const updateHeight = () => setPanelHeight(shell.clientHeight);
    updateHeight();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(updateHeight);
    observer.observe(shell);
    return () => observer.disconnect();
  }, [moduleId]);

  const activeUiImage = images[activeImageIndex] ?? '';
  const imageAdjustments: Record<string, { scale: number; shiftXPercent?: number }> = {
    [`${basePath}/assets/ui/scarf-board-1.png`]: { scale: 1 },
  };
  const activeImageAdjustment = imageAdjustments[activeUiImage] ?? { scale: 1 };
  const uiScalePercent = Math.max(activeImageAdjustment.scale * 100, 100);
  const uiShiftXPercent =
    activeImageAdjustment.shiftXPercent ?? -((activeImageAdjustment.scale - 1) * 50);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startY: event.clientY,
      startScrollTop: viewport.scrollTop,
    };
    viewport.setPointerCapture(event.pointerId);
    viewport.style.cursor = 'grabbing';
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    const dragState = dragRef.current;
    if (!viewport || !dragState.active || dragState.pointerId !== event.pointerId) return;

    const deltaY = event.clientY - dragState.startY;
    viewport.scrollTop = dragState.startScrollTop - deltaY;
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    const dragState = dragRef.current;
    if (!viewport || !dragState.active || dragState.pointerId !== event.pointerId) return;

    dragState.active = false;
    dragState.pointerId = -1;
    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
    viewport.style.cursor = 'grab';
  };

  const handleInnerWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#1c2b49] bg-[linear-gradient(180deg,#050d1d_0%,#040814_100%)] p-3 md:p-5">
        <div className="mx-auto w-full max-w-[1120px]">
          <div
            data-lenis-prevent
            className="grid grid-cols-1 items-start gap-5 md:grid-cols-[clamp(250px,26vw,330px)_minmax(0,1fr)] md:gap-10"
          >
            <div className="order-2 md:order-1 md:justify-self-start">
              <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/45">
                Screen Selector
              </div>
              <div className="rounded-xl border border-white/12 bg-[#0b1426] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div
                  data-lenis-prevent
                  onWheelCapture={handleInnerWheel}
                  onWheel={handleInnerWheel}
                  className="no-scrollbar space-y-2 overflow-y-auto pr-1 overscroll-contain"
                  style={
                    {
                      height: panelHeight > 0 ? `${panelHeight}px` : 'clamp(420px,66vh,620px)',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                    } as React.CSSProperties
                  }
                >
                  {images.map((image, index) => (
                    <button
                      key={`${moduleId}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={`w-full rounded-lg border p-1.5 text-left transition-colors ${
                        index === activeImageIndex
                          ? 'border-[#7ea5e6] bg-[#182846] shadow-[0_0_0_1px_rgba(126,165,230,0.25)]'
                          : 'border-white/10 bg-[#0f1a30] hover:border-white/35'
                      }`}
                      aria-label={`Preview ${index + 1}`}
                    >
                      <div className="flex min-h-[92px] items-center gap-2.5">
                        <ImageWithFallback
                          src={image}
                          alt={`${title} thumb ${index + 1}`}
                          className="h-[78px] w-[52px] rounded object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-white/75">
                          SCREEN {String(index + 1).padStart(2, '0')}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 flex justify-center md:justify-center">
              <div
                ref={phoneShellRef}
                className="rounded-[34px] border border-white/20 bg-[#070f20] p-2.5 shadow-[0_20px_48px_rgba(0,0,0,0.55)]"
                style={{ width: 'clamp(235px,22vw,300px)' }}
              >
                <div className="mx-auto mb-3 h-[5px] w-20 rounded-full bg-white/25" />
                <div
                  ref={viewportRef}
                  data-lenis-prevent
                  onWheelCapture={handleInnerWheel}
                  onWheel={handleInnerWheel}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerEnd}
                  onPointerCancel={handlePointerEnd}
                  onPointerLeave={handlePointerEnd}
                  className="mx-auto aspect-[9/19.5] w-full select-none overflow-y-auto rounded-[26px] bg-[#0b1222] no-scrollbar touch-pan-y cursor-grab overscroll-contain"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
                >
                  <ImageWithFallback
                    src={activeUiImage}
                    alt={`${title} screen ${activeImageIndex + 1}`}
                    className="pointer-events-none block h-auto w-full"
                    style={{
                      width: `${uiScalePercent}%`,
                      minWidth: `${uiScalePercent}%`,
                      maxWidth: 'none',
                      height: 'auto',
                      marginLeft: `${uiShiftXPercent}%`,
                    }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UiExhibitionViewer;
