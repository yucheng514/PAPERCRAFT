<template>
    <div :style="getWrapStyle">
        <!--普通图片或svg容器或背景色 -->
        <div
            v-if="element.isBackground"
            style="width: 100%; height: 100%"
            :style="getBackgroundStyle(element)"
        ></div>
        <img
            v-else
            @dragstart.prevent
            :src="element.src"
            :style="getImageStyle"
        />
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, type CSSProperties } from "vue";
// import type { CSSProperties } from 'vue'

import { getZIndex } from "@/assets/util";
import { useStore } from "@/store/store";
import { storeToRefs } from "pinia";
const store = useStore();
const { viewerSize } = storeToRefs(store);
interface Props {
    element: ImageInter;
    index: number;
}
const props = defineProps<Props>();
const getImageStyle = computed(() => {
    let image = props.element;
    let { scaleWidth, scaleHeight, top, left } = image.relative || {
        scaleWidth: 1,
        scaleHeight: 1,
        top: 0,
        left: 0,
    };
    return {
        position: "absolute",
        top: top * 100 + "%",
        left: left * 100 + "%",
        width: image.originWidth * scaleWidth * viewerSize.value + "px",
        height: image.originHeight * scaleHeight * viewerSize.value + "px",
    } as CSSProperties;
});
const getWrapStyle = computed(() => {
    {
        let image = props.element;
        //添加overflow:hidden，服务图片的裁剪
        let style = {
            position: "absolute",
            opacity: image.opacity,
            zIndex: image.isBackground ? 1 : getZIndex(props.index),
            left: image.left * viewerSize.value + "px",
            top: image.top * viewerSize.value + "px",
            width: image.width * viewerSize.value + "px",
            height: image.height * viewerSize.value + "px",
            transform: `rotate(${image.transform}deg) rotateY(${
                image.rotateY ? 180 : 0
            }deg) rotateX(${image.rotateX ? 180 : 0}deg)`,
            overflow: "hidden",
            display: "block",
        };
        return style as CSSProperties;
    }
});
const getBackgroundStyle = computed(() => (element: any) => {
    if (element.backgroundImage) {
        let linearGradient = `linear-gradient(${
            element.backgroundImage.degree
        }deg, ${element.backgroundImage.colorPercent
            .map((data: any) => `${data.color} ${data.percent * 100 + "%"}`)
            .join(",")})`;
        return {
            "background-image": linearGradient,
        };
    } else {
        return {
            "background-color": element.background || "transparent",
        };
    }
});
</script>
