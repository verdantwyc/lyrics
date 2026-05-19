import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [mdx(), react()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  }
});
