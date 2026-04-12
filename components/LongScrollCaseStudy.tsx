import React from 'react';
import { ProjectModuleData, ProjectModuleSection } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getMobileImageSource } from '../imageVariants';

interface LongScrollCaseStudyProps {
  module: ProjectModuleData;
}

const fallbackSection = (module: ProjectModuleData): ProjectModuleSection[] => {
  if (module.images?.length) {
    return [
      {
        id: `${module.id}-images`,
        images: module.images,
      },
    ];
  }

  if (module.cover) {
    return [
      {
        id: `${module.id}-cover`,
        images: [module.cover],
      },
    ];
  }

  return [];
};

const LongScrollCaseStudy: React.FC<LongScrollCaseStudyProps> = ({ module }) => {
  const sections = module.sections?.length ? module.sections : fallbackSection(module);
  const usePlainBoard = module.boardFrame === 'plain';

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#d8cfbf] bg-[#f5ecdf] text-[#201b14] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
      <div className="border-b border-[#dfd4c2] bg-[#efe3d2] px-4 py-5 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#796b58]">
              Long-Scroll Case Study
            </div>
            <h5 className="mt-1 text-2xl text-[#1a140d]">{module.title}</h5>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5c5247]">{module.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 md:px-6 md:py-8">
        <div className="space-y-10">
          {sections.map((section) => {
            const isGrid = section.layout === 'grid';
            const isContinuous = !isGrid && section.flow === 'continuous';
            const contentWrapperClassName = isGrid
              ? 'grid gap-4 md:grid-cols-2'
              : isContinuous
                ? usePlainBoard
                  ? 'mx-auto max-w-[980px] overflow-hidden'
                  : 'mx-auto max-w-[980px] overflow-hidden rounded-[22px] border border-[#d7cab7] bg-white/88 p-2 shadow-[0_10px_28px_rgba(44,31,15,0.08)]'
                : 'space-y-4';

            return (
              <section key={section.id} className="space-y-4">
                {(section.title || section.description) && (
                  <div className="mx-auto max-w-[980px]">
                    {section.title && (
                      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7b6d5a]">
                        {section.title}
                      </div>
                    )}
                    {section.description && (
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5c5247]">
                        {section.description}
                      </p>
                    )}
                  </div>
                )}

                <div className={contentWrapperClassName}>
                  {section.images.map((image, index) => (
                    <div
                      key={`${section.id}-${index}`}
                      className={
                        isContinuous
                          ? index === 0
                            ? 'w-full'
                            : '-mt-px w-full'
                          : usePlainBoard
                          ? isGrid
                            ? 'w-full'
                            : 'mx-auto w-fit max-w-[980px]'
                          : `overflow-hidden rounded-[22px] border border-[#d7cab7] bg-white/88 p-2 shadow-[0_10px_28px_rgba(44,31,15,0.08)] ${
                              isGrid ? 'w-full' : 'mx-auto w-fit max-w-[980px]'
                            }`
                      }
                    >
                      <ImageWithFallback
                        src={image}
                        mobileSrc={getMobileImageSource(image)}
                        alt={`${module.title} section ${section.title ?? 'image'} ${index + 1}`}
                        className={`mx-auto block h-auto max-w-full ${
                          isContinuous ? 'w-full' : `w-auto ${usePlainBoard ? '' : 'rounded-[16px]'}`
                        }`}
                        loading="lazy"
                        decoding="async"
                        loadingEffect={module.loadingEffect}
                      />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LongScrollCaseStudy;
