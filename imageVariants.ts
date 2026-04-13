import { asset } from './imageAsset';

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
  [asset('/assets/graphic/feline-blessing-long.png')]: asset('/assets/graphic/feline-blessing-long-mobile.webp'),
  [asset('/assets/graphic/realm-of-wind-chasers-long.png')]: asset(
    '/assets/graphic/realm-of-wind-chasers-long-mobile.webp',
  ),
  [asset('/assets/graphic/tidal-oath-long.png')]: asset('/assets/graphic/tidal-oath-long-mobile.webp'),
  [asset('/assets/full-branding/mao-dot-long.png')]: asset('/assets/full-branding/mao-dot-long-mobile.webp'),
  [asset('/assets/additional/selected-works-2025/selected-works-long.png')]: asset(
    '/assets/additional/selected-works-2025/selected-works-long-mobile.webp',
  ),
};

export const getMobileImageSource = (src?: string | null) => {
  if (!src) return undefined;
  return MOBILE_IMAGE_MAP[src];
};
