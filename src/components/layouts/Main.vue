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
            @mousedown="viewerClick"
        >
            <!-- 盒子：用于选中一个或者多个元素 -->
            <div v-if="selectBox.isUsing" :style="getSelectBoxStyle"></div>

            <!-- 画布 -->
            <div id="drawing" class="relative" ref="drawing">
                <!-- 渲染全部元素、吸附线和框体 -->
                <div class="renderer" :style="rendererStyle">
                    <!-- left 吸附线 -->
                    <div
                        class="h-full w0px border border-dashed border-#999 absolute left-0px top-0px z-999"
                        v-show="assistance.showLeft"
                        :style="{ left: assistance.left * viewerSize + 'px' }"
                    ></div>

                    <!-- top 吸附线 -->
                    <div
                        class="w-full h0px border border-dashed border-#999 absolute left-0px top-0px z-999"
                        v-show="assistance.showTop"
                        :style="{ left: assistance.top * viewerSize + 'px' }"
                    ></div>

                    <!-- 渲染元素 -->
                    <render :elements="allData" :config="{}"></render>

                    <!-- 渲染元素的框体 -->
                    <div
                        v-for="(element, index) in allData"
                        class="absolute border border-#000 border-dashed z-998"
                        :style="getHoverBoxStyle(element)"
                        @mousedown.stop="dealHoverBoxDown($event, element)"
                        @mouseenter="dealEleEnter(element.virtualKey)"
                        @mouseleave="dealEleLeave"
                    ></div>
                </div>
                <!-- 当前选中的渲染元素 -->
                <div
                    v-if="currentElement"
                    @mousedown.stop="curBoxDown($event)"
                    @mouseup="curBoxUp($event)"
                    :style="getDragBoxStyle"
                ></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Render from "@/components/render/Render.vue";
import { ref, reactive, computed, onMounted } from "vue";
import { useStore } from "@/store/store";
import { storeToRefs } from "pinia";
import { allData } from "@/assets/mock";
import { copy } from "@/assets/util";
import { useMouse } from "@vueuse/core";
const store = useStore();
const { viewerSize, currentElement, mouseDownEvent } = storeToRefs(store);
const {
    setViewerSize,
    setCurrentElement,
    setMouseDownEvent,
    clearMouseDownEvent,
    clearCurrentElement,
} = store;
const viewer = ref({});
const drawing = ref({});
const { x, y } = useMouse();
const assistance = reactive({
    left: 0,
    top: 0,
    showLeft: false,
    showTop: false,
});
let currentHoverKey = ref("");

onMounted(() => {
    viewerResize();
    window.addEventListener("resize", viewerResize);
    window.addEventListener("mousemove", (e: any) => {
        let value = viewer.value as HTMLDivElement;
        // console.log(value.offsetLeft)
        if (value) {
            e.positionX = e.clientX - value.offsetLeft;
            e.positionY = e.clientY - value.offsetTop;
            if (
                mouseDownEvent.value !== null &&
                typeof mouseDownEvent.value === "object"
            ) {
                console.log('2')
                mouseDownEvent.value.cb(e);
            }
        }
    });
    window.addEventListener("mouseup", (e: MouseEvent) => {
        let originData = mouseDownEvent.value.originData;
        let newData = copy(currentElement.value);
        mergeObject(currentElement.value, newData);
        clearMouseDownEvent();
    });
});
function dealEleEnter(key: string) {
    // 暂时用 index 来判断当前选中元素，后续可能会改用 virtualKey (已改用)
    currentHoverKey.value = key;
}
function dealEleLeave() {
    currentHoverKey.value = "";
}
function dealHoverBoxDown(event: MouseEvent, element: any) {
    // dealMouseDown(element, event);
    setCurrentElement(element);
}
function dealMouseDown(element: any, event: any) {
    setCurrentElement(element);
}
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
function curBoxDown(event: MouseEvent) {
    let eventStartPosition = {
        x: event.clientX,
        y: event.clientY,
    };
    let originData = JSON.parse(JSON.stringify(currentElement.value));
    let pack = {
        target: currentElement.value,
        event: event,
        // originData,
        cb: function (moveEvent: MouseEvent) {
            let viewerWidth = 800;
            let viewerHeight = 800;

            //获取位移信息
            let left =
                (moveEvent.clientX - eventStartPosition.x) / viewerSize.value +
                originData.left;
            let top =
                (moveEvent.clientY - eventStartPosition.y) / viewerSize.value +
                originData.top;

            //赋值
            currentElement.value.left = left;
            currentElement.value.top = top;
            setCurrentElement(currentElement)
        },
    };
    console.log('1')
    setMouseDownEvent(pack);
}
function mergeObject(newObj: any, obj: any) {
    //注意，此方法不支持含有函数的对象复制
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (typeof obj[key] === "object" && obj[key] !== null) {
            let defaultObj = obj[key] instanceof Array ? [] : {};
            newObj[key] = newObj[key] || defaultObj;
            mergeObject(newObj[key], obj[key]);
        } else {
            newObj[key] = obj[key];
        }
    }
}

function curBoxUp(event: MouseEvent) {
    let currentPosition = {
        x: event.clientX,
        y: event.clientY,
    };
    setTimeout(() => {
        let drawingDom = drawing.value as HTMLDivElement;
        let drawingPoint = drawingDom.getBoundingClientRect();
        let touchPoint = {
            x: (currentPosition.x - drawingPoint.left) / viewerSize.value,
            y: (currentPosition.y - drawingPoint.top) / viewerSize.value,
        };
    }, 200);
}
const getDragBoxStyle = computed(() => {
    let style = Object.assign({}, getBoxPosition(currentElement.value), {
        zIndex: 998,
        cursor: "move",
        transform: `rotate(${currentElement.value.transform}deg)`,
        border: "1px dashed #000",
        position: "absolute",
    });
    return style;
});
const getHoverBoxStyle = computed(() => (element: any) => {
    if (element) {
        let style: { [key: string]: any } = Object.assign(
            {},
            {
                opacity:
                    (!currentElement ||
                        currentElement.virtualKey !== element.virtualKey) &&
                    currentHoverKey.value !== "" &&
                    currentHoverKey.value === element.virtualKey
                        ? 1
                        : 0,

                cursor: "pointer",
                overflow: "visible",
                zIndex: 50 + allData.indexOf(element),
            },
            getBoxPosition(element)
        );
        if (element.transform) {
            style.transform = "rotate(" + element.transform + "deg)";
        }
        return style;
    } else return {};
});
function getBoxPosition(box: {
    left: number;
    top: number;
    width: number;
    height: number;
}) {
    return {
        left: box.left * viewerSize.value + "px",
        top: box.top * viewerSize.value + "px",
        width: box.width * viewerSize.value + "px",
        height: box.height * viewerSize.value + "px",
    };
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

function viewerClick() {
    if (currentElement.value) {
        clearCurrentElement();
    }
}

const getSelectBoxStyle = computed(() => {
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
    return {};
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
