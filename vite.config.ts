import { fileURLToPath, URL } from "url";

// import { defineConfig } from "vite";
import { defineConfig } from "vitest/config";

import vue from "@vitejs/plugin-vue";
import Unocss from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Unocss({
            // presets: [],
            rules: [["m-1", { margin: "0.25rem" }]],
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    base: "./",
    server: {
        open: true,
    },
    test: {
        // enable jest-like global test APIs
        globals: true,
        // simulate DOM with happy-dom
        // (requires installing happy-dom as a peer dependency)
        environment: "happy-dom",
    },
});
