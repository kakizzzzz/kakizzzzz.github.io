const BASE_PATH = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

const asset = (pathname: string) => `${BASE_PATH}${pathname}`;

const MOBILE_IMAGE_MAP: Record<string, string> = {
  [asset('/assets/graphic/feline-blessing-cover.png')]: asset('/assets/graphic/feline-blessing-cover-mobile.jpg'),
  [asset('/assets/graphic/realm-of-wind-chasers-cover.png')]: asset(
    '/assets/graphic/realm-of-wind-chasers-cover-mobile.jpg',
  ),
  [asset('/assets/graphic/tidal-oath-cover.png')]: asset('/assets/graphic/tidal-oath-cover-mobile.jpg'),
  [asset('/assets/graphic/feline-blessing-long.png')]: asset('/assets/graphic/feline-blessing-long-mobile.jpg'),
  [asset('/assets/graphic/realm-of-wind-chasers-long.png')]: asset(
    '/assets/graphic/realm-of-wind-chasers-long-mobile.jpg',
  ),
  [asset('/assets/graphic/tidal-oath-long.png')]: asset('/assets/graphic/tidal-oath-long-mobile.jpg'),
  [asset('/assets/full-branding/mao-dot-cover.png')]: asset('/assets/full-branding/mao-dot-cover-mobile.jpg'),
  [asset('/assets/full-branding/mao-dot-long.png')]: asset('/assets/full-branding/mao-dot-long-mobile.jpg'),
  [asset('/assets/additional/selected-works-2025/selected-works-long.png')]: asset(
    '/assets/additional/selected-works-2025/selected-works-long-mobile.jpg',
  ),
  [asset('/assets/additional/human-machine-relationship/poster-01.png')]: asset(
    '/assets/additional/human-machine-relationship/poster-01-mobile.jpg',
  ),
  [asset('/assets/additional/human-machine-relationship/poster-02.png')]: asset(
    '/assets/additional/human-machine-relationship/poster-02-mobile.jpg',
  ),
  [asset('/assets/additional/human-machine-relationship/poster-03.png')]: asset(
    '/assets/additional/human-machine-relationship/poster-03-mobile.jpg',
  ),
  [asset('/assets/amazon/dog-collar/detail-long.png')]: asset('/assets/amazon/dog-collar/detail-long-mobile.jpg'),
  [asset('/assets/amazon/storage-bins/detail-long.png')]: asset('/assets/amazon/storage-bins/detail-long-mobile.jpg'),
  [asset('/assets/amazon/storage-bins-2/detail-long.png')]: asset(
    '/assets/amazon/storage-bins-2/detail-long-mobile.jpg',
  ),
};

export const getMobileImageSource = (src?: string | null) => {
  if (!src) return undefined;
  return MOBILE_IMAGE_MAP[src];
};
