<template>
    <Text
        v-if="props.element.type === 'TEXT'"
        :element="(props.element as TextInter)"
        :index="props.index"
        :config="props.config"
    ></Text>
</template>

<script setup lang="ts">
import Text from "./Text.vue";

interface Props {
    element: ElementInter;
    index: number;
    // currentElement: object;
    // complexElement: object;
    config: {
        isTextEdit?: boolean;
        editModeItem?: any;
        freeText?: boolean;
    };
}
const props = defineProps<Props>();
</script>
<style scoped></style>
