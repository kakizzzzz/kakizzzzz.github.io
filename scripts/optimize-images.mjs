import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const generatedPublicDir = 'public/.generated-webp';
const generatedPublicAssetDir = `${generatedPublicDir}/assets`;
const rasterExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const maxWebpDimension = 16383;

const SIMPLE_VARIANTS = [
  {
    input: 'public/assets/graphic/feline-blessing-cover.png',
    desktopOutput: 'public/assets/graphic/feline-blessing-cover.webp',
    mobileOutput: 'public/assets/graphic/feline-blessing-cover-mobile.webp',
    mobileWidth: 960,
  },
  {
    input: 'public/assets/graphic/realm-of-wind-chasers-cover.png',
    desktopOutput: 'public/assets/graphic/realm-of-wind-chasers-cover.webp',
    mobileOutput: 'public/assets/graphic/realm-of-wind-chasers-cover-mobile.webp',
    mobileWidth: 960,
  },
  {
    input: 'public/assets/graphic/tidal-oath-cover.png',
    desktopOutput: 'public/assets/graphic/tidal-oath-cover.webp',
    mobileOutput: 'public/assets/graphic/tidal-oath-cover-mobile.webp',
    mobileWidth: 960,
  },
  {
    input: 'public/assets/full-branding/mao-dot-cover.png',
    desktopOutput: 'public/assets/full-branding/mao-dot-cover.webp',
    mobileOutput: 'public/assets/full-branding/mao-dot-cover-mobile.webp',
    mobileWidth: 960,
  },
  {
    input: 'public/assets/additional/human-machine-relationship/poster-01.png',
    desktopOutput: 'public/assets/additional/human-machine-relationship/poster-01.webp',
    mobileOutput: 'public/assets/additional/human-machine-relationship/poster-01-mobile.webp',
    mobileWidth: 1200,
  },
  {
    input: 'public/assets/additional/human-machine-relationship/poster-02.png',
    desktopOutput: 'public/assets/additional/human-machine-relationship/poster-02.webp',
    mobileOutput: 'public/assets/additional/human-machine-relationship/poster-02-mobile.webp',
    mobileWidth: 1200,
  },
  {
    input: 'public/assets/additional/human-machine-relationship/poster-03.png',
    desktopOutput: 'public/assets/additional/human-machine-relationship/poster-03.webp',
    mobileOutput: 'public/assets/additional/human-machine-relationship/poster-03-mobile.webp',
    mobileWidth: 1200,
  },
  {
    input: 'public/assets/amazon/dog-collar/detail-long.png',
    desktopOutput: 'public/assets/amazon/dog-collar/detail-long.webp',
    mobileOutput: 'public/assets/amazon/dog-collar/detail-long-mobile.webp',
    mobileWidth: 1000,
  },
  {
    input: 'public/assets/amazon/storage-bins/detail-long.png',
    desktopOutput: 'public/assets/amazon/storage-bins/detail-long.webp',
    mobileOutput: 'public/assets/amazon/storage-bins/detail-long-mobile.webp',
    mobileWidth: 1000,
  },
  {
    input: 'public/assets/amazon/storage-bins-2/detail-long.png',
    desktopOutput: 'public/assets/amazon/storage-bins-2/detail-long.webp',
    mobileOutput: 'public/assets/amazon/storage-bins-2/detail-long-mobile.webp',
    mobileWidth: 1000,
  },
];

const LONG_SCROLL_MOBILE_VARIANTS = [
  {
    input: 'public/assets/graphic/feline-blessing-long.png',
    mobileOutput: 'public/assets/graphic/feline-blessing-long-mobile.webp',
    mobileWidth: 1100,
  },
  {
    input: 'public/assets/graphic/realm-of-wind-chasers-long.png',
    mobileOutput: 'public/assets/graphic/realm-of-wind-chasers-long-mobile.webp',
    mobileWidth: 1100,
  },
  {
    input: 'public/assets/graphic/tidal-oath-long.png',
    mobileOutput: 'public/assets/graphic/tidal-oath-long-mobile.webp',
    mobileWidth: 1100,
  },
  {
    input: 'public/assets/full-branding/mao-dot-long.png',
    mobileOutput: 'public/assets/full-branding/mao-dot-long-mobile.webp',
    mobileWidth: 1100,
  },
  {
    input: 'public/assets/additional/selected-works-2025/selected-works-long.png',
    mobileOutput: 'public/assets/additional/selected-works-2025/selected-works-long-mobile.webp',
    mobileWidth: 1100,
  },
];

const resolveFromRoot = (relativePath) => path.resolve(rootDir, relativePath);

const ensureDirectory = async (filePath) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
};

const pathExists = async (targetPath) => {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
};

const isUpToDate = async (inputPath, outputPath) => {
  if (!(await pathExists(outputPath))) return false;

  const [inputStats, outputStats] = await Promise.all([fs.stat(inputPath), fs.stat(outputPath)]);
  return outputStats.mtimeMs >= inputStats.mtimeMs;
};

const walkDirectory = async (directoryPath) => {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDirectory(absolutePath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(absolutePath);
    }
  }

  return files;
};

const getDisplayWebpOptions = (inputPath, variant = 'desktop') => {
  const ext = path.extname(inputPath).toLowerCase();
  const isMobileVariant = variant === 'mobile';

  if (ext === '.png') {
    return {
      quality: isMobileVariant ? 90 : 94,
      alphaQuality: 100,
      effort: 6,
      nearLossless: true,
      smartSubsample: true,
    };
  }

  if (ext === '.webp') {
    return {
      quality: isMobileVariant ? 88 : 92,
      alphaQuality: 100,
      effort: 6,
      smartSubsample: true,
    };
  }

  return {
    quality: isMobileVariant ? 88 : 92,
    effort: 6,
    smartSubsample: true,
  };
};

const writeDisplayWebp = async (pipeline, inputPath, outputPath, variant = 'desktop') => {
  await ensureDirectory(outputPath);
  await pipeline.webp(getDisplayWebpOptions(inputPath, variant)).toFile(outputPath);
};

const writeHighFidelityWebp = async (inputPath, outputPath) => {
  if (await isUpToDate(inputPath, outputPath)) {
    return false;
  }

  const ext = path.extname(inputPath).toLowerCase();
  const metadata = await sharp(inputPath, { limitInputPixels: false }).metadata();
  const webpOptions =
    ext === '.png'
      ? {
          quality: 94,
          alphaQuality: 100,
          effort: 6,
          nearLossless: true,
          smartSubsample: true,
        }
      : {
          quality: ext === '.webp' ? 92 : 92,
          alphaQuality: ext === '.webp' ? 100 : undefined,
          effort: 6,
          smartSubsample: true,
        };

  await ensureDirectory(outputPath);
  let pipeline = sharp(inputPath, { limitInputPixels: false });

  if (metadata.width && metadata.height) {
    const oversizedDimension = Math.max(metadata.width, metadata.height);

    if (oversizedDimension > maxWebpDimension) {
      pipeline = pipeline.resize({
        width: metadata.width >= metadata.height ? maxWebpDimension : undefined,
        height: metadata.height > metadata.width ? maxWebpDimension : undefined,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }
  }

  await pipeline.webp(webpOptions).toFile(outputPath);
  return true;
};

const processSimpleVariant = async (variant) => {
  const inputPath = resolveFromRoot(variant.input);
  const desktopOutputPath = resolveFromRoot(variant.desktopOutput);
  const mobileOutputPath = resolveFromRoot(variant.mobileOutput);

  const metadata = await sharp(inputPath).metadata();
  const mobileWidth = Math.min(variant.mobileWidth, metadata.width ?? variant.mobileWidth);

  await writeDisplayWebp(sharp(inputPath), inputPath, desktopOutputPath, 'desktop');
  await writeDisplayWebp(
    sharp(inputPath).resize({ width: mobileWidth, withoutEnlargement: true }),
    inputPath,
    mobileOutputPath,
    'mobile',
  );

  console.log(`optimized ${variant.input}`);
};

const processLongScrollMobileVariant = async (variant) => {
  const inputPath = resolveFromRoot(variant.input);
  const mobileOutputPath = resolveFromRoot(variant.mobileOutput);
  const metadata = await sharp(inputPath).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(`Could not read dimensions for ${variant.input}`);
  }

  const mobileWidth = Math.min(variant.mobileWidth, metadata.width);
  await writeDisplayWebp(
    sharp(inputPath).resize({ width: mobileWidth, withoutEnlargement: true }),
    inputPath,
    mobileOutputPath,
    'mobile',
  );

  console.log(`optimized long mobile ${variant.input}`);
};

const processGeneratedWebpMirror = async () => {
  const publicAssetsDir = resolveFromRoot('public/assets');
  const generatedAssetsDir = resolveFromRoot(generatedPublicAssetDir);
  const assetFiles = await walkDirectory(publicAssetsDir);
  let optimizedCount = 0;

  await fs.mkdir(generatedAssetsDir, { recursive: true });

  for (const inputPath of assetFiles) {
    const ext = path.extname(inputPath).toLowerCase();
    if (!rasterExtensions.has(ext)) continue;

    const relativeAssetPath = path.relative(publicAssetsDir, inputPath);
    const outputPath = path
      .join(generatedAssetsDir, relativeAssetPath)
      .replace(/\.(png|jpe?g|webp)$/i, '.webp');
    const didOptimize = await writeHighFidelityWebp(inputPath, outputPath);

    if (didOptimize) {
      optimizedCount += 1;
      console.log(`generated webp ${path.join('assets', relativeAssetPath)}`);
    }
  }

  console.log(`generated ${optimizedCount} high-fidelity webp assets`);
};

const main = async () => {
  for (const variant of SIMPLE_VARIANTS) {
    await processSimpleVariant(variant);
  }

  for (const variant of LONG_SCROLL_MOBILE_VARIANTS) {
    await processLongScrollMobileVariant(variant);
  }

  await processGeneratedWebpMirror();
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
