import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
