import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import {VitePWA} from "vite-plugin-pwa";
import * as path from "path";

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            workbox: {
                globPatterns: [
                    "**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp,woff,woff2,mp3,wav,ogg}"
                ],
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
                runtimeCaching: [
                    {
                        urlPattern: /\/api\/branding/,
                        handler: "StaleWhileRevalidate",
                        options: {
                            cacheName: "branding-cache",
                            expiration: {maxEntries: 10, maxAgeSeconds: 86400}
                        }
                    },
                    {
                        urlPattern: /\/api\/practice\/.+/,
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "practice-quiz-cache",
                            expiration: {maxEntries: 50, maxAgeSeconds: 3600},
                            networkTimeoutSeconds: 3
                        }
                    },
                    {
                        urlPattern: /\/api\//,
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "api-cache",
                            expiration: {maxEntries: 100, maxAgeSeconds: 300},
                            networkTimeoutSeconds: 5
                        }
                    }
                ]
            },
            manifest: {
                name: "Quizzle",
                short_name: "Quizzle",
                description: "Interactive quiz platform",
                theme_color: "#ffffff",
                background_color: "#ffffff",
                display: "standalone",
                start_url: "/",
                icons: [
                    {
                        src: "/assets/images/logo.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any"
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    css: {
        preprocessorOptions: {
            sass: {
                api: "modern"
            }
        }
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:6412",
                ws: true,
                changeOrigin: true,
                secure: false
            }
        }
    }
});