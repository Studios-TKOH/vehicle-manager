import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"
import tailwindcss from "@tailwindcss/vite"
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Sistema de Gestión de Flotas SUNAT 2026",
        short_name: "FleetSUNAT",
        description: "Gestión logística y facturación electrónica offline-first",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@constants": path.resolve(__dirname, "./src/constants"),
      "@data": path.resolve(__dirname, "./src/data"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@icons": path.resolve(__dirname, "./src/ui/icons"),
      "@assets": path.resolve(__dirname, "./src/assets")
    }
  },
  server: {
    proxy: {
      '/api-decolecta': {
        target: 'https://api.decolecta.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-decolecta/, '')
      }
    }
  }
})