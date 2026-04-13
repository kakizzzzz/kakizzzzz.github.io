import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

const normalizeBasePath = (value?: string) => {
  if (!value) return '/';

  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
};

export default defineConfig({
  base: normalizeBasePath(process.env.VITE_BASE_PATH),
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        notFound: path.resolve(__dirname, '404.html'),
      },
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('framer-motion')) {
            return 'motion-vendor';
          }

          if (id.includes('gsap') || id.includes('@studio-freight/lenis')) {
            return 'scroll-vendor';
          }

          if (id.includes('lucide-react') || id.includes('clsx')) {
            return 'ui-vendor';
          }

          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/scheduler/')
          ) {
            return 'react-vendor';
          }

          return 'vendor';
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    ViteImageOptimizer({
      test: /\.(png|jpe?g|webp|avif|svg)$/i,
      includePublic: true,
      logStats: true,
      cache: true,
      cacheLocation: path.resolve(__dirname, '.vite-image-cache'),
      // Keep full-length layout boards intact. WebP generation happens in the
      // prebuild script; this plugin then optimizes the emitted assets in-place
      // without tiling or changing layout.
      png: {
        compressionLevel: 9,
        quality: 100,
        effort: 10,
        palette: false,
      },
      jpeg: {
        quality: 100,
        progressive: true,
        mozjpeg: true,
      },
      jpg: {
        quality: 100,
        progressive: true,
        mozjpeg: true,
      },
      webp: {
        quality: 97,
        effort: 6,
        alphaQuality: 100,
        smartSubsample: true,
      },
      avif: {
        lossless: true,
        effort: 9,
      },
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupIds: false,
                convertPathData: false,
                removeViewBox: false,
              },
            },
          },
          'sortAttrs',
          {
            name: 'addAttributesToSVGElement',
            params: {
              attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
