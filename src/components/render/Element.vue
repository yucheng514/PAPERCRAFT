<template>
    <Text :element="props.element"
    :index="props.index"
    :config="props.config"></Text>
</template>

<script setup lang="ts">
import Text from "./chlid/Text.vue";
interface Props {
    element: {
        content: string;
        fontSize: number;
        fontFamily: string;
        lineHeight: number;
        letterSpacing: number;
        transform: number;
        type: string;
        width: number;
        height: number;
        verticalAlign: string;
        textAlign: string;
        fontWeight: string;
        color: string;
        top: number;
        left: number;
        textDecoration: string;
        opacity: number;
        textOrder: string;
        fontStyle?: string;
        prefix?: { fontFamily?: string };
        suffix?: { fontFamily?: string };
        digit?: object;
        integral?: any;
        decimal?: any;
    };
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
