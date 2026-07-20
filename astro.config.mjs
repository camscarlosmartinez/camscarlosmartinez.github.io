import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://camscarlosmartinez.github.io',
  output: 'static',
  integrations: [sitemap()],
});
