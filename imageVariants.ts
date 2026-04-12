const BASE_PATH = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

const asset = (pathname: string) => `${BASE_PATH}${pathname}`;

const createPartMappings = (basePath: string, count: number) =>
  Object.fromEntries(
    Array.from({ length: count }, (_, index) => {
      const partNumber = String(index + 1).padStart(2, '0');
      return [
        asset(`${basePath}-part-${partNumber}.webp`),
        asset(`${basePath}-part-${partNumber}-mobile.webp`),
      ];
    }),
  );

const MOBILE_IMAGE_MAP: Record<string, string> = {
  [asset('/assets/graphic/feline-blessing-cover.webp')]: asset('/assets/graphic/feline-blessing-cover-mobile.webp'),
  [asset('/assets/graphic/realm-of-wind-chasers-cover.webp')]: asset(
    '/assets/graphic/realm-of-wind-chasers-cover-mobile.webp',
  ),
  [asset('/assets/graphic/tidal-oath-cover.webp')]: asset('/assets/graphic/tidal-oath-cover-mobile.webp'),
  [asset('/assets/full-branding/mao-dot-cover.webp')]: asset('/assets/full-branding/mao-dot-cover-mobile.webp'),
  [asset('/assets/additional/human-machine-relationship/poster-01.webp')]: asset(
    '/assets/additional/human-machine-relationship/poster-01-mobile.webp',
  ),
  [asset('/assets/additional/human-machine-relationship/poster-02.webp')]: asset(
    '/assets/additional/human-machine-relationship/poster-02-mobile.webp',
  ),
  [asset('/assets/additional/human-machine-relationship/poster-03.webp')]: asset(
    '/assets/additional/human-machine-relationship/poster-03-mobile.webp',
  ),
  [asset('/assets/amazon/dog-collar/detail-long.webp')]: asset('/assets/amazon/dog-collar/detail-long-mobile.webp'),
  [asset('/assets/amazon/storage-bins/detail-long.webp')]: asset('/assets/amazon/storage-bins/detail-long-mobile.webp'),
  [asset('/assets/amazon/storage-bins-2/detail-long.webp')]: asset(
    '/assets/amazon/storage-bins-2/detail-long-mobile.webp',
  ),
  ...createPartMappings('/assets/graphic/feline-blessing-long', 3),
  ...createPartMappings('/assets/graphic/realm-of-wind-chasers-long', 4),
  ...createPartMappings('/assets/graphic/tidal-oath-long', 4),
  ...createPartMappings('/assets/full-branding/mao-dot-long', 7),
  ...createPartMappings('/assets/additional/selected-works-2025/selected-works-long', 5),
};

export const getMobileImageSource = (src?: string | null) => {
  if (!src) return undefined;
  return MOBILE_IMAGE_MAP[src];
};
