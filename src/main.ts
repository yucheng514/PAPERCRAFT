import { createApp } from "vue";
import App from "./App.vue";
import "uno.css";
// import { createPinia } from "pinia";
import pinia from "@/store/store";
// import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

const app = createApp(App);
// app.use(ElementPlus);
app.use(pinia);
app.mount("#app");
