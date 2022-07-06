import { computed } from "vue";
import currentElement from "./currentElement";

const isText = computed(() => {
    return currentElement.value.type === "TEXT";
});
const isImage = computed(() => {
    return currentElement.value.type === "IMAGE";
});
export { isText, isImage };
