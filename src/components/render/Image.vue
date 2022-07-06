<template>
    <div class="absolute" :style="getWrapStyle">
        <!--普通图片或svg容器或背景色 -->
        <!-- <div
            style="width: 100%; height: 100%"
            :style="backgroundStyle(element)"
            v-if="element.subType === 'background' && !element.src"
        ></div> -->
        <img @dragstart.prevent :src="element.src" :style="getImageStyle" />
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from "vue";

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
    // let { scaleWidth, scaleHeight, top, left } = image.relative || {
    //     scaleWidth: 1,
    //     scaleHeight: 1,
    //     top: 0,
    //     left: 0,
    // };
    let { scaleWidth, scaleHeight, top, left } = {
        scaleWidth: 1,
        scaleHeight: 1,
        top: 0,
        left: 0,
    };
    return {
        width: image.originWidth * scaleWidth * viewerSize.value + "px",
        height: image.originHeight * scaleHeight * viewerSize.value + "px",
        top: top * 100 + "%",
        left: left * 100 + "%",
        position: "absolute",
    } as const;
});
const getWrapStyle = computed(() => {
    {
        let image = props.element;
        //添加overflow:hidden，服务图片的裁剪
        let style = {
            opacity: image.opacity,
            // zIndex:
            //     image.subType && image.subType.toLowerCase() === "background"
            //         ? 1
            //         : util.getZIndex(this.index),
            zIndex: getZIndex(props.index),
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
        return style;
    }
});
</script>