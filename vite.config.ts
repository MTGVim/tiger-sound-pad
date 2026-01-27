import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  base: "tiger-sound-pad",
  server: {
    port: 3000,
  },
});
