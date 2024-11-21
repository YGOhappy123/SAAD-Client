import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Cho phép truy cập từ tất cả các địa chỉ IP
    port: 3000,      // Đặt port bạn muốn (ví dụ 3000)
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          "font-family": "'Raleway', sans-serif",
          "font-size-base": "16px",
          "line-height-base": "1.5",
          "layout-header-background": "transparent",
          "layout-body-background": "transparent",
          "body-background": "transparent",
          "text-color": "#002329",
        },
        javascriptEnabled: true,
      },
    },
  },
});
