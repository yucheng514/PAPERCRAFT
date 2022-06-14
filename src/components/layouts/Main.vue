<template>
    <!-- mousedown.stop mousemove.prevent 为啥要加这两个修饰符？ -->
    <div
        @mousedown.stop="preCreateBox"
        @mousemove.prevent="beginCreateBox"
        class="h-full w-full text-center flex-grow"
    >
        <!-- 可选中区域 -->
        <div
            id="viewer"
            class="relative w-full h-full flex justify-center items-center"
            ref="viewer"
        >
            <!-- 画布 -->
            <div id="drawing" @mousedown="viewerClick">
                <div v-if="selectBox.isUsing" :style="selectBoxStyle"></div>
                <div class="renderer" :style="rendererStyle">
                    <render
                        :elements="allData"
                        :config="{}"
                    ></render>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Render from "@/components/render/Render.vue";
import { ref, reactive, computed, onMounted } from "vue";
import { useStore } from "@/store/store";
import { storeToRefs } from "pinia";
// import { allData } from "@/assets/mock.js";
const store = useStore();
const { curEl, mainBg, viewerSize } = storeToRefs(store);
const { setViewerSize } = store;
const viewer = ref({});
const allData = [
    {
        content: "大标题",
        fontSize: 68.58,
        fontFamily: "Alibaba PuHuiTi B",
        lineHeight: 2.38889,
        letterSpacing: 3.81,
        transform: 36,
        type: "TEXT",
        width: 402.89278884933833,
        height: 164,
        verticalAlign: "middle",
        textAlign: "center",
        fontWeight: "",
        fontStyle: "italic",
        color: "rgba(255,0,0,1)",
        top: 432.6587301587302,
        left: 294.5238095238095,
        textDecoration: "line-through",
        newData: true,
        locked: false,
        opacity: 0.78,
        textOrder: "horizontal",
        virtualKey: "20220614175750z7hyzapggn",
    },
];
onMounted(() => {
    viewerResize();
    window.addEventListener("resize", viewerResize);
});
function viewerResize() {
    let [dragboxWidth, dragboxHeight] = [800, 800];
    let ele = viewer.value as HTMLDivElement;
    //上下至少 100，左右至少 40
    if (ele) {
        let widthViewer = (ele.clientWidth - 40) / dragboxWidth;
        let heightViewer = (ele.clientHeight - 100) / dragboxHeight;
        setViewerSize(
            Math.min(
                Number(widthViewer.toFixed(2)),
                Number(heightViewer.toFixed(2)),
                1
            )
        );
    }
}
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
function emptySelectBox() {
    Object.assign(selectBox, {
        isUsing: false,
    });
}
function preCreateBox(e: MouseEvent) {
    // 记录鼠标按下的开始坐标
    let value = viewer.value as HTMLDivElement;
    let viewerLeft = value.offsetLeft;
    let viewerTop = value.offsetTop;
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
    // 不在 @mouseup 里监听是因为一旦鼠标移动到 main 范围以外就会有 bug
    // 但是什么时候 remove 比较好呢？
    window.addEventListener("mouseup", emptySelectBox);
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

const rendererStyle = computed(() => {
    return {
        width: 800 * viewerSize.value + "px",
        height: 800 * viewerSize.value + "px",
        // ...mainBg,
    } as const;
});
</script>
<style>
#viewer {
    background-color: #eff2f7;
}
.renderer {
    display: flex;
    position: relative;
    background-size: 16px 16px;
    box-shadow: 1px 1px 15px rgba(0, 0, 0, 0.2);
    background-color: #fff;
    background-position: 0 0, 8px 8px;
    background-image: linear-gradient(
            to top right,
            #ccc 25%,
            transparent 25%,
            transparent 75%,
            #ccc 75%,
            #ccc
        ),
        linear-gradient(
            to top right,
            #ccc 25%,
            transparent 25%,
            transparent 75%,
            #ccc 75%,
            #ccc
        );
    width: 800px;
    height: 800px;
    opacity: 1;
}
</style>
