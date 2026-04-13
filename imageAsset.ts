const BASE_PATH = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
const GENERATED_WEBP_ROOT = '/.generated-webp';
const RASTER_IMAGE_PATTERN = /\.(png|jpe?g)$/i;
const EXTERNAL_SOURCE_PATTERN = /^(?:[a-z]+:)?\/\//i;

const splitSource = (value: string) => {
  const hashIndex = value.indexOf('#');
  const queryIndex = value.indexOf('?');
  let cutIndex = value.length;

  if (queryIndex !== -1) {
    cutIndex = Math.min(cutIndex, queryIndex);
  }

  if (hashIndex !== -1) {
    cutIndex = Math.min(cutIndex, hashIndex);
  }

  return {
    pathname: value.slice(0, cutIndex),
    suffix: value.slice(cutIndex),
  };
};

const stripBasePath = (pathname: string) => {
  if (!BASE_PATH) return pathname;
  if (!pathname.startsWith(BASE_PATH)) return pathname;

  const strippedPath = pathname.slice(BASE_PATH.length);
  return strippedPath.startsWith('/') ? strippedPath : `/${strippedPath}`;
};

const isExternalSource = (value: string) =>
  value.startsWith('data:') || value.startsWith('blob:') || EXTERNAL_SOURCE_PATTERN.test(value);

export const asset = (pathname: string) => `${BASE_PATH}${pathname}`;

export const hasGeneratedWebpCandidate = (src?: string | null) => {
  if (!src) return false;
  if (isExternalSource(src)) return false;

  const { pathname } = splitSource(src);
  return pathname.startsWith('/') && pathname.includes('/assets/') && RASTER_IMAGE_PATTERN.test(pathname);
};

export const getOptimizedImageSource = (src?: string | null) => {
  if (!src || !hasGeneratedWebpCandidate(src)) return src ?? undefined;

  const { pathname, suffix } = splitSource(src);
  const normalizedPath = stripBasePath(pathname);
  const optimizedPath = `${GENERATED_WEBP_ROOT}${normalizedPath.replace(RASTER_IMAGE_PATTERN, '.webp')}`;

  return `${BASE_PATH}${optimizedPath}${suffix}`;
};
