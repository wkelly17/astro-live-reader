import {defineConfig} from "astro/config";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import solidJs from "@astrojs/solid-js";
import {manifest} from "./manifest";
import {VitePWA} from "vite-plugin-pwa";

// https://astro.build/config
import cloudflare from "@astrojs/cloudflare";
console.log(import.meta.env.MODE);

// https://astro.build/config

// https://astro.build/config
console.log(import.meta.env.MODE);
export default defineConfig({
  output: "server",
  adapter: cloudflare({mode: "directory"}),
  integrations: [tailwind(), solidJs()],
  vite: {
    // define: {
    //   'process.env.MY_SECRET': JSON.stringify(process.env.MY_SECRET),
    // },
    plugins: [
      VitePWA({
        base: "/",
        scope: "/",
        srcDir: "src",
        filename: "sw.js",
        mode: import.meta.env.MODE,
        strategies: "injectManifest",
        injectManifest: {
          // swDest: "dist/client/sw.js",
          // globDirectory: "dist/client",
          globPatterns: ["**/*.{css,js,html,svg,png,ico,txt}"],
          // sourcemap: true,
        },

        devOptions: {
          enabled: import.meta.env.DEV,
          type: "module",
        },
        registerType: "prompt",
        manifest: {
          name: "Astro PWA",
          short_name: "Astro PWA",
          theme_color: "#30E130",
          icons: [
            {
              src: "/favicons/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/favicons/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "/favicons/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
      }),
    ],
  },
});
