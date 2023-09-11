import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { cesiumPlugin } from "vite-plugin-earth";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    vue(),
    cesiumPlugin({
      useCDN: true,
    }),
  ],
});
