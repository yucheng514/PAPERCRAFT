<template>
    <div :style="getStyle">
        <p>{{ props.element.content }}</p>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from "vue";
import { getFont, getZIndex } from "@/assets/util";
import { useStore } from "@/store/store";
import { storeToRefs } from "pinia";
const store = useStore();
const { viewerSize } = storeToRefs(store);
interface Props {
    element: TextInter;
    index: number;
    // currentElement: object;
    // complexElement: object;
}
const props = defineProps<Props>();
// const alignConversion = {
//     left: "flex-start",
//     right: "flex-end",
//     center: "center",
//     top: "flex-start",
//     bottom: "flex-end",
//     middle: "center",
// };

const getStyle = computed(() => {
    let text = props.element;
    let realFont = getFont(text.fontFamily);
    let style = {
        letterSpacing: `${text.letterSpacing}px`,
        lineHeight: text.lineHeight,
        // textAlign: `${text.textAlign ? text.textAlign : "center"}`, 报错
        textAlign: "center",
        fontSize: text.fontSize + "px",
        transform: `scale(${viewerSize.value}) rotate(${text.transform}deg)`,
        transformOrigin: "center",
        fontFamily: `${realFont.name}`,
        position: "absolute",
        left: `${
            text.left * viewerSize.value -
            ((1 - viewerSize.value) * text.width) / 2
        }px`,
        top: `${
            text.top * viewerSize.value -
            ((1 - viewerSize.value) * text.height) / 2
        }px`,
        width: text.width + "px",
        height: text.height + "px",
        opacity: text.opacity,
        color: text.color,
        zIndex: getZIndex(props.index),
        display: "flex",
        // overflow: 'hidden',
        wordBreak: "break-all",
        whiteSpace: "pre-wrap",
        // fontWeight: text.fontWeight ? text.fontWeight : "normal", 报错
        fontWeight: "normal",
        fontStyle: text.fontStyle ? text.fontStyle : "normal",
        writingMode: text.textOrder === "vertical" ? "vertical-rl" : "initial",
        // alignItems: text.verticalAlign
        //     ? alignConversion[text.verticalAlign]
        //     : alignConversion[util.initialAlign.vertical],
        // justifyContent: text.textAlign
        //     ? this.alignConversion[text.textAlign]
        //     : this.alignConversion[util.initialAlign.horizontal],
        alignItems: "center",
        justifyContent: "center",
    } as const;
    return style;
});
</script>
<style scoped></style>
