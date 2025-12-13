import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/main.jsx"),
      },
      output: {
        // Content scripts must be classic scripts (not ES modules).
        // Emit a single IIFE bundle with inlined dynamic imports so Chrome
        // won't see `export` statements in the injected file.
        format: "iife",
        inlineDynamicImports: true,
        exports: "none",
        name: "JobAssistantContentScript",
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
    // Don't minify for easier debugging in development
    minify: process.env.NODE_ENV === "production",
    // Generate source maps for debugging
    sourcemap: process.env.NODE_ENV !== "production",
  },
  // Resolve configuration
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@components": resolve(__dirname, "./src/components"),
      "@hooks": resolve(__dirname, "./src/hooks"),
      "@services": resolve(__dirname, "./src/services"),
      "@config": resolve(__dirname, "./src/config"),
    },
  },
  // Server configuration for development
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
