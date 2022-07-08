import { computed } from "vue";
import currentElement from "./currentElement";

const isText = computed(() => {
    return currentElement.value.type === "TEXT";
});
const isImage = computed(() => {
    return currentElement.value.type === "IMAGE";
});
const isBackground = computed(() => {
    return (currentElement.value as ImageInter).isBackground;
});
export { isText, isImage, isBackground };
