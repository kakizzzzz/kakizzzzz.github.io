import React, { useEffect, useMemo, useState } from 'react';
import { ProjectModuleData } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AmazonProductShowcaseProps {
  module: ProjectModuleData;
}

const AmazonProductShowcase: React.FC<AmazonProductShowcaseProps> = ({ module }) => {
  const amazon = module.amazon;
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [module.id]);

  const activeImage = useMemo(() => {
    if (!amazon) return module.cover ?? '';
    return amazon.galleryImages[activeImageIndex] ?? amazon.galleryImages[0] ?? module.cover ?? '';
  }, [activeImageIndex, amazon, module.cover]);

  if (!amazon) return null;

  const handleInnerWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const stars = `${'★'.repeat(Math.round(Number(amazon.rating)))}${'☆'.repeat(
    Math.max(0, 5 - Math.round(Number(amazon.rating))),
  )}`;

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#d5d9d9] bg-white text-[#0f1111] shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
      <div className="flex items-center justify-between border-b border-[#e3e6e6] bg-[#f8fafb] px-4 py-3 text-[11px] text-[#546068] md:px-6">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="rounded-full border border-[#d5d9d9] bg-white px-4 py-1 font-mono tracking-[0.12em]">
          amazon-portfolio-simulation.local
        </div>
      </div>

      <div className="bg-[#131921] px-4 py-3 text-white md:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xl font-black tracking-tight text-[#ff9900]">amazon</div>
          <div className="h-7 flex-1 rounded-md bg-white/10 px-3 text-[11px] leading-7 text-white/55">
            Search portfolio listing showcase
          </div>
          <div className="rounded-md bg-[#ffd814] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0f1111]">
            Mock PDP
          </div>
        </div>
      </div>

      <div className="border-b border-[#eaeded] bg-[#232f3e] px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-white/68 md:px-6">
        {amazon.breadcrumb?.join(' / ') ?? 'Amazon Product Page'}
      </div>

      <div className="px-4 py-5 md:px-6 md:py-6">
        <div className="grid gap-5 lg:grid-cols-[72px_minmax(0,1fr)_320px]">
          <div className="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-visible">
            {amazon.galleryImages.map((image, index) => (
              <button
                key={`${module.id}-${index}`}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                className={`shrink-0 overflow-hidden rounded-lg border bg-white transition-all ${
                  index === activeImageIndex
                    ? 'border-[#f08804] shadow-[0_0_0_2px_rgba(240,136,4,0.2)]'
                    : 'border-[#d5d9d9] hover:border-[#f08804]'
                }`}
              >
                <ImageWithFallback
                  src={image}
                  alt={`${module.title} gallery ${index + 1}`}
                  className="h-[68px] w-[68px] object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>

          <div className="order-1 lg:order-2">
            <div className="rounded-[22px] border border-[#d5d9d9] bg-[#fbfbfb] p-4">
              <div
                data-lenis-prevent
                onWheelCapture={handleInnerWheel}
                onWheel={handleInnerWheel}
                className="max-h-[620px] overflow-auto rounded-[18px] bg-white p-4"
              >
                <ImageWithFallback
                  src={activeImage}
                  alt={`${module.title} preview ${activeImageIndex + 1}`}
                  className="mx-auto block h-auto w-full max-w-[720px] object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          <div className="order-3 rounded-[22px] border border-[#d5d9d9] bg-white p-5 shadow-[0_10px_24px_rgba(15,17,17,0.06)]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {amazon.badge && (
                  <span className="rounded-full bg-[#e7f4f5] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#007185]">
                    {amazon.badge}
                  </span>
                )}
                {amazon.highlights?.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full border border-[#d5d9d9] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#565959]"
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              <div>
                <h5 className="text-[26px] leading-[1.2] text-[#0f1111]">{amazon.productTitle}</h5>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-[#007185]">
                  <span className="text-[#f3a847]">{stars}</span>
                  <span>{amazon.rating}</span>
                  <span className="text-[#565959]">({amazon.reviewCount} ratings)</span>
                </div>
              </div>

              <div className="rounded-2xl border border-[#d5d9d9] bg-[#fcfcfc] p-4">
                <div className="text-[12px] uppercase tracking-[0.16em] text-[#565959]">Price</div>
                <div className="mt-1 text-[34px] leading-none text-[#b12704]">{amazon.price}</div>
                {amazon.shipping && (
                  <div className="mt-3 text-[14px] text-[#007185]">{amazon.shipping}</div>
                )}
                {amazon.availability && (
                  <div className="mt-1 text-[14px] font-semibold text-[#007600]">{amazon.availability}</div>
                )}
              </div>

              <div>
                <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#565959]">
                  About this listing
                </div>
                <ul className="space-y-2 text-[14px] leading-relaxed text-[#0f1111]">
                  {amazon.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="pt-[6px] text-[8px] text-[#0f1111]">●</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[#d5d9d9] bg-[#f7fafa] p-4 text-[13px] text-[#565959]">
                This right rail is intentionally styled like an Amazon buy box so the portfolio piece reads as a familiar product page, not a flat gallery.
              </div>
            </div>
          </div>
        </div>
      </div>

      {amazon.detailImages.length > 0 && (
        <div className="border-t border-[#eaeded] bg-[#f6f7f7] px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto max-w-[1120px]">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6b7280]">
                  Below The Fold
                </div>
                <h6 className="text-2xl text-[#0f1111]">A+ / Detail Content</h6>
              </div>
              <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#6b7280]">
                {amazon.detailImages.length} detail panels
              </div>
            </div>

            <div className="space-y-4">
              {amazon.detailImages.map((image, index) => (
                <div key={`${module.id}-detail-${index}`} className="overflow-hidden rounded-[24px] border border-[#d5d9d9] bg-white p-2 md:p-3">
                  <ImageWithFallback
                    src={image}
                    alt={`${module.title} detail ${index + 1}`}
                    className="block w-full rounded-[18px] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmazonProductShowcase;
