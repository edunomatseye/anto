// app.config.ts
import { defineConfig } from '@tanstack/start/config';

export default defineConfig({
  vite: {
    //base: '/apps',
  },
  tsr: {
    apiBase: '/apps',
  },
});
