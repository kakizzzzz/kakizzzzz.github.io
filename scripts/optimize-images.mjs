import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

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

const writeLosslessWebp = async (pipeline, outputPath) => {
  await ensureDirectory(outputPath);
  await pipeline.webp({ lossless: true, effort: 6 }).toFile(outputPath);
};

const processSimpleVariant = async (variant) => {
  const inputPath = resolveFromRoot(variant.input);
  const desktopOutputPath = resolveFromRoot(variant.desktopOutput);
  const mobileOutputPath = resolveFromRoot(variant.mobileOutput);

  const metadata = await sharp(inputPath).metadata();
  const mobileWidth = Math.min(variant.mobileWidth, metadata.width ?? variant.mobileWidth);

  await writeLosslessWebp(sharp(inputPath), desktopOutputPath);
  await writeLosslessWebp(
    sharp(inputPath).resize({ width: mobileWidth, withoutEnlargement: true }),
    mobileOutputPath,
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
  await writeLosslessWebp(
    sharp(inputPath).resize({ width: mobileWidth, withoutEnlargement: true }),
    mobileOutputPath,
  );

  console.log(`optimized long mobile ${variant.input}`);
};

const main = async () => {
  for (const variant of SIMPLE_VARIANTS) {
    await processSimpleVariant(variant);
  }

  for (const variant of LONG_SCROLL_MOBILE_VARIANTS) {
    await processLongScrollMobileVariant(variant);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
