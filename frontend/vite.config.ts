import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.IS_PREACT": JSON.stringify("false"),
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
    include: [
      "@codemirror/state",
      "@codemirror/view",
      "@codemirror/commands",
      "@codemirror/language",
      "@codemirror/lang-sql",
      "@codemirror/autocomplete",
      "@codemirror/search",
      "@codemirror/theme-one-dark",
    ],
    esbuildOptions: {
      target: "es2022",
    },
  },
  resolve: {
    dedupe: ["@codemirror/state", "@codemirror/view"],
  },
  build: {
    target: "es2022",
  },
});
