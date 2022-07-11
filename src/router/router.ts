import Index from "@/components/pages/Index.vue";
import ScreenShot from "@/components/pages/ScreenShot.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    { path: "/", components: { default: Index } },
    {
        path: "/screenshot",
        components: { default: ScreenShot },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
