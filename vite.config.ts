import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Unocss from "unocss/vite";
import presetIcons from "@unocss/preset-icons";
import { presetUno } from "unocss";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Unocss({
            presets: [
                presetIcons({
                    prefix: "i-",
                    extraProperties: {
                        display: "inline-block",
                    },
                }),
                presetUno(),
            ],
            // rules: [["m-1", { margin: "0.25rem" }]],
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    base: "./",
    server: {
        host: "127.0.0.1",
        open: true,
    },
});
