// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  output: "server",
  adapter: vercel({
    analytics: true,
    // Habilitar estos ajustes podría ayudar con el manejo de rutas
    // includeFiles: ['./dist/**/*'],
    // functionPerRoute: false
  }),
});
