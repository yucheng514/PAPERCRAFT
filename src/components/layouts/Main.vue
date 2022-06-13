<template>
    <div
        class="h-full w-full text-center flex-grow"
        @mousedown="preCreateBox"
        @mousemove="beginCreateBox"
    >
        <!-- 可选中区域 -->
        <div id="viewer" class="relative w-full h-full" ref="viewer">
            <!-- 画布 -->
            <div id="drawing" @mousedown="viewerClick">
                <div v-if="selectBox.isUsing" :style="selectBoxStyle"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useStore } from "@/store/store";
import { storeToRefs } from "pinia";
const store = useStore();
const { curEl, mainBg, count, viewerSize } = storeToRefs(store);

const viewer = ref({});

const selectBox = reactive({
    isUsing: false,
    left: 0,
    top: 0,
    width: 0,
    height: 0,
});
const originBox = reactive({
    left: 0,
    top: 0,
    startX: 0,
    startY: 0,
});
function preCreateBox(e: MouseEvent) {
    // 记录鼠标按下的开始坐标
    let value = viewer.value as HTMLDivElement;
    let viewerLeft = value.offsetLeft;
    let viewerTop = value.offsetTop;
    console.log(viewerLeft, viewerTop);
    Object.assign(selectBox, {
        isUsing: true,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
    });
    Object.assign(originBox, {
        left: (e.pageX - viewerLeft) / viewerSize.value,
        top: (e.pageY - viewerTop) / viewerSize.value,
        startX: e.pageX,
        startY: e.pageY,
    });

    // vue 里有好的绑定事件方法吗？
    window.addEventListener("mouseup", () => {
        Object.assign(selectBox, {
            isUsing: false,
        });
    });
}

function beginCreateBox(e: MouseEvent) {
    if (selectBox.isUsing) {
        let xChange = (e.pageX - originBox.startX) / viewerSize.value;
        let yChange = (e.pageY - originBox.startY) / viewerSize.value;
        selectBox.left = originBox.left + (xChange < 0 ? xChange : 0);
        selectBox.top = originBox.top + (yChange < 0 ? yChange : 0);

        selectBox.width = Math.abs(xChange);
        selectBox.height = Math.abs(yChange);
    }
}

function viewerClick() {}

const selectBoxStyle = computed(() => {
    return {
        position: "absolute",
        opacity: 0.5,
        zIndex: 4000, //比左边栏和图片低，高于遮罩998
        backgroundColor: "rgb(197,228,232)",
        border: (selectBox.width !== 0 ? 1 : 0) + "px solid rgb(0,196,204)",
        width: selectBox.width * viewerSize.value + "px",
        height: selectBox.height * viewerSize.value + "px",
        top: selectBox.top * viewerSize.value + "px",
        left: selectBox.left * viewerSize.value + "px",
    } as const;
});
</script>
<style>
#viewer {
    background-color: #eff2f7;
}
</style>
