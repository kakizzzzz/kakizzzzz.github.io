import React, { useEffect, useState } from 'react';
import { ProjectModuleData } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getMobileImageSource } from '../imageVariants';

interface PosterGalleryShowcaseProps {
  module: ProjectModuleData;
}

const PosterGalleryShowcase: React.FC<PosterGalleryShowcaseProps> = ({ module }) => {
  const images = module.images ?? [];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [module.id]);

  const activeImage = images[activeImageIndex] ?? module.cover ?? '';

  return (
    <div className="overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_top,#f4eee5_0%,#e7dfd2_56%,#ddd2c4_100%)] px-4 py-5 text-[#1c1711] shadow-[0_20px_60px_rgba(0,0,0,0.18)] md:px-6 md:py-6">
      <div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#7a6d5d]">
              Poster Gallery
            </div>
            <h5 className="mt-1 text-2xl text-[#1a140d]">{module.title}</h5>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5e5548]">{module.subtitle}</p>
          </div>
          <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#7a6d5d]">
            {images.length} posters
          </div>
        </div>
      </div>

      <div className="grid gap-6 pt-6 lg:grid-cols-[108px_minmax(0,1fr)] lg:pt-8">
        <div className="order-2 flex gap-3 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-visible">
          {images.map((image, index) => (
            <button
              key={`${module.id}-${index}`}
              type="button"
              onClick={() => setActiveImageIndex(index)}
              className={`shrink-0 overflow-hidden rounded-[16px] bg-white/72 p-1.5 transition-all ${
                index === activeImageIndex
                  ? 'shadow-[0_0_0_2px_rgba(30,43,67,0.16)]'
                  : 'hover:bg-white'
              }`}
            >
              <ImageWithFallback
                src={image}
                mobileSrc={getMobileImageSource(image)}
                alt={`${module.title} thumbnail ${index + 1}`}
                className="h-[96px] w-[72px] object-cover"
                loading="lazy"
                decoding="async"
                loadingEffect={module.loadingEffect}
              />
            </button>
          ))}
        </div>

        <div className="order-1 lg:order-2">
          <div className="rounded-[26px] bg-[#f7f2ea] p-4 shadow-[0_18px_42px_rgba(52,35,18,0.12)] md:p-6">
            <ImageWithFallback
              src={activeImage}
              mobileSrc={getMobileImageSource(activeImage)}
              alt={`${module.title} poster ${activeImageIndex + 1}`}
              className="mx-auto block h-auto max-h-[76vh] w-full max-w-[720px] object-contain"
              loading="lazy"
              decoding="async"
              loadingEffect={module.loadingEffect}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterGalleryShowcase;
