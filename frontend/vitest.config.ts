import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "next/navigation": path.resolve(
        __dirname,
        "src/test/mocks/next-navigation.ts",
      ),
      "next/link": path.resolve(__dirname, "src/test/mocks/next-link.tsx"),
      "next/image": path.resolve(__dirname, "src/test/mocks/next-image.tsx"),
    },
  },
});
