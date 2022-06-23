<template>
    <element-render
        v-for="(el, index) in props.elements"
        :key="el.virtualKey"
        :element="el"
        :index="index"
        :config="props.config"
    ></element-render>
</template>

<script setup lang="ts">
import ElementRender from "./Element.vue";
interface Props {
    elements: TextInter[];
    config: {
        isTextEdit?: boolean;
        editModeItem?: any;
        freeText?: boolean;
    };
}
const props = defineProps<Props>();
</script>
<style scoped></style>
