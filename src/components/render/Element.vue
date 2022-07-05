<template>
    <Text
        :element="props.element"
        :index="props.index"
        :config="props.config"
    ></Text>
</template>

<script setup lang="ts">
import Text from "./Text.vue";
interface Props {
    element: TextInter;
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
