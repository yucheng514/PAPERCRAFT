<template>
    <component
        :is="currentComponent"
        :element="props.element"
        :index="props.index"
    ></component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Text from "./Text.vue";
import Image from "./Image.vue";

interface Props {
    element: ElementInter;
    index: number;
}
const props = defineProps<Props>();

const currentComponent = computed(() => {
    let type = props.element.type;
    let current;
    if (type === "IMAGE") {
        current = Image;
    } else if (type === "TEXT") {
        current = Text;
    }
    return current;
});
</script>
<style scoped></style>
