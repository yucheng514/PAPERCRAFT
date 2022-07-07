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
            class="bg-[#fdfffd] relative w-full h-full flex justify-center items-center"
            ref="viewer"
            @mousedown="viewerClick"
        >
            <!-- 盒子：用于选中一个或者多个元素 -->
            <div v-if="selectBox.isUsing" :style="getSelectBoxStyle"></div>

            <!-- 画布 -->
            <div id="drawing" class="relative" ref="drawing">
                <!-- 渲染全部元素、吸附线和框体 -->
                <div class="renderer" :style="getRendererStyle">
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
                        :style="{ top: assistance.top * viewerSize + 'px' }"
                    ></div>

                    <!-- 渲染元素 -->
                    <!-- 使用 render 来渲染的话，部署之后添加新元素会失败 -->
                    <!-- <render :elements="allData" :config="{}"></render> -->
                    <ElementRender
                        v-for="(el, index) in allData"
                        :key="el.virtualKey"
                        :element="el"
                        :index="index"
                    ></ElementRender>

                    <!-- 渲染元素的框体 -->
                    <div
                        v-for="(element, index) in allData"
                        class="absolute border border-#000 border-dashed z-998"
                        :style="getHoverBoxStyle(element)"
                        @mousedown.stop="
                            dealHoverBoxDown($event, element.virtualKey)
                        "
                        @mouseenter="dealEleEnter(element.virtualKey)"
                        @mouseleave="dealEleLeave"
                    ></div>
                </div>
                <!-- 当前选中的渲染元素 -->
                <div
                    class="absolute"
                    v-if="currentElementKey"
                    @mousedown.stop="curBoxDown($event)"
                    @mouseup="curBoxUp($event)"
                    :style="getDragBoxStyle"
                >
                    <!-- 八个点 + 旋转，用来对元素进行各个方位的缩放 -->
                    <div @mousedown.stop="dotMouseDown($event)">
                        <em
                            v-for="dot in dots"
                            :id="dot"
                            :style="getDotStyle(dot)"
                        ></em>

                        <!-- 暂时移除旋转操作，在工具栏内改动 -->
                        <!-- <em id="rotate"></em> -->
                    </div>
                    <p
                        class="absolute left-1/2 bottom--75px text-center w50px h18px bg-#ccc rounded-9px border border-#fff text-12px color-#444"
                        :style="{
                            transform:
                                'translateX(-50%) rotate(-' +
                                currentElement.transform +
                                'deg)',
                        }"
                        v-show="rotateShow"
                    >
                        {{ currentElement.transform + "°" }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElementRender } from "@/components/render";
import {
    ref,
    reactive,
    computed,
    watch,
    onMounted,
    type CSSProperties,
} from "vue";
import { useStore } from "@/store/store";
import { storeToRefs } from "pinia";
import { copy, mergeObject, isText } from "@/assets/util";
import { useEventListener, onKeyStroke } from "@vueuse/core";
import { dots, dotStyle, cursorObject, assertCursor } from "@/assets/dots";
import currentElement from "@/components/computed/currentElement";

const store = useStore();
const { viewerSize, currentElementKey, mouseDownEvent, allData } =
    storeToRefs(store);
const {
    setViewerSize,
    setCurrentElementKey,
    setMouseDownEvent,
    clearMouseDownEvent,
    clearCurrentElement,
    deleteCurrentElement,
    // setElement,
} = store;
const viewer = ref({});
const drawing = ref({});
const assistance = reactive({
    left: 0,
    top: 0,
    showLeft: false,
    showTop: false,
});
let currentHoverKey = ref("");

const getDotStyle = computed(() => (dot: string) => {
    let style = {
        position: "absolute",
        display: "inline-block",
        background: "#fff",
        width: "8px",
        height: "8px",
        border: "1px solid #666",
        zIndex: 1,
        // @ts-ignore
        ...dotStyle[dot],
        // @ts-ignore
        cursor: cursorObject[dot],
    };
    return style;
});
watch(
    () => currentElement.value.transform,
    () => {
        setTimeout(() => {
            dots.forEach((dot) => {
                // @ts-ignore
                cursorObject[dot] = assertCursor(
                    currentElement.value,
                    viewerSize.value,
                    dot
                );
                // console.log(cursorObject);
            });
        }, 0);
    }
);
let rotateShow = ref(false);
function dotMouseDown(event: MouseEvent) {
    let eventStartPosition = {
        x: event.clientX,
        y: event.clientY,
    };
    let originData = copy(currentElement.value);
    originData.initialWidth = originData.width / (originData.scaleX || 1);
    originData.initialHeight = originData.height / (originData.scaleY || 1);
    let dotDom = event.target;
    let pack: { [k: string]: any } = {
        target: currentElement.value,
        event: event,
        originData,
    };
    // @ts-ignore
    let dotIdName = dotDom.id;
    if (dotIdName && dots.includes(dotIdName)) {
        pack.callback = function (moveEvent: any) {
            let flag = 1;
            let testRotate = (currentElement.value.transform * Math.PI) / 180;
            let k = Math.tan(Math.PI / 2 - testRotate);
            if (["mt", "mb"].includes(dotIdName)) {
                k = Math.tan(-testRotate);
            }
            //coordinateX、Y为x/y坐标实际增加的量（/that.viewerSize就可以加到数据上）
            let coordinateX = moveEvent.clientX - eventStartPosition.x;
            let coordinateY = eventStartPosition.y - moveEvent.clientY;
            //原来length1还除以了 / Math.sin(that.kDia),导致高度增加而宽度不变时 此值无限接近0，拖动mb/bt时高度飞速变化
            let length1 =
                Math.abs(k * coordinateX - coordinateY) /
                Math.sqrt(Math.pow(k, 2) + 1) /
                viewerSize.value;
            let testY = k * (moveEvent.clientX - eventStartPosition.x);
            if (["mb", "mt"].includes(dotIdName)) {
                flag =
                    eventStartPosition.y - moveEvent.clientY < testY
                        ? flag
                        : -flag;
                flag = Math.cos(testRotate) < 0 ? -flag : flag;
                flag = ["mt"].includes(dotIdName) ? -flag : flag;
            } else {
                flag =
                    eventStartPosition.y - moveEvent.clientY < testY
                        ? flag
                        : -flag;
                flag = testRotate > Math.PI ? -flag : flag;
                flag = ["lt", "lb", "lm"].includes(dotIdName) ? -flag : flag;
            }
            //新增一行kDia的处理，如果kDia不存在，就用 bound记录的原始kDia
            let kDia = Math.atan(originData.width / originData.height);
            //在这里加一个判断，如果是斜轴拖放，kDia永远是 bound中记录的值
            if (["rt", "rb", "lt", "lb"].includes(dotIdName)) {
                kDia = Math.atan(originData.width / originData.height);
            }
            let offsetX = Math.sin(kDia) * length1 * flag;
            let offsetY = Math.cos(kDia) * length1 * flag;

            //以下几行代码自定义了 宽度拖放和高度拖放的行为，所以他们可以随意改变kDia
            if (["rm", "lm"].includes(dotIdName)) {
                offsetY = 0;
                offsetX = length1 * flag;
                if (offsetX + originData.width <= 1)
                    offsetX = -originData.width + 1;
            } else if (["mt", "mb"].includes(dotIdName)) {
                offsetX = 0;
                offsetY = length1 * flag;
                if (offsetY + originData.height <= 1)
                    offsetY = -originData.height + 1;
            } else {
                //这里是斜轴拖放，某轴小于1，就把该轴置为1，另一轴等比
                if (offsetX + originData.width <= 1) {
                    offsetX = -originData.width + 1;
                    offsetY = offsetX / Math.tan(kDia);
                } else if (offsetY + originData.height <= 1) {
                    offsetY = -originData.height + 1;
                    offsetX = offsetY * Math.tan(kDia);
                }
            }
            //宽高变化，直接加上宽高（文字、价签需调整字体）
            currentElement.value.width = originData.width + offsetX;
            currentElement.value.height = originData.height + offsetY;
            let operateType = currentElement.value.type.toLowerCase();
            // let operateSubType =
            //     currentElement.value.subType &&
            //     currentElement.value.subType.toLowerCase();
            let operateSubType = "";
            //scalable拖动不再改字体、间距，直接改 scale
            if (isText(operateType)) {
                //斜向拖动text改字体和间距
                let oblique = ["rb", "rt", "lb", "lt"].includes(dotIdName);
                if (isText(operateType) && oblique) {
                    (currentElement.value as TextInter).fontSize = +(
                        ((originData.height + offsetY) / originData.height) *
                        originData.fontSize
                    ).toFixed(2);
                    (currentElement.value as TextInter).letterSpacing = +(
                        ((originData.height + offsetY) / originData.height) *
                        originData.letterSpacing
                    ).toFixed(2);
                }
                //斜向拖动价格改字体和间距
                // else if (isPrice(operateType) && oblique) {
                //   //digit.integral.size,text.digit.decimal.size
                //   currentElement.value.digit.integral.size = +(
                //     ((originData.height + offsetY) / originData.height) *
                //     originData.digit.integral.size
                //   ).toFixed(2);
                //   currentElement.value.digit.decimal.size = +(
                //     ((originData.height + offsetY) / originData.height) *
                //     originData.digit.decimal.size
                //   ).toFixed(2);
                //   currentElement.value.letterSpacing = +(
                //     ((originData.height + offsetY) / originData.height) *
                //     originData.letterSpacing
                //   ).toFixed(2);
                //   //如果有前后缀，那么相应的改前后缀
                //   ["prefix", "suffix"].forEach((affixName) => {
                //     if (currentElement.value[affixName]) {
                //       currentElement.value[affixName].fontSize = +(
                //         ((originData.height + offsetY) / originData.height) *
                //         originData[affixName].fontSize
                //       ).toFixed(2);
                //     }
                //   });
                // }
            }

            //如果不是编辑模式才需要同步调整图片本身的缩小比例
            //   if (!that.isImageEdit) {
            //     that.adjustImageScale(originData, currentElement.value);
            //   }

            //scalable时去除自动调节行为
            //   if (operateSubType !== "scalable") {
            //     //text水平拖拉，盒子高度由挤压后的文字高度定
            //     let currentDom = document.querySelector(
            //       "#" + "text" + allData.value.indexOf(currentElement.value)
            //     );
            //     if (
            //       ($this.hasClass("rm") || $this.hasClass("lm")) &&
            //       isText(operateType)
            //     ) {
            //       currentElement.value.height = currentDom.scrollHeight;
            //     }
            //     if (
            //       ($this.hasClass("mt") || $this.hasClass("mb")) &&
            //       isText(operateType)
            //     ) {
            //       currentElement.value.width = currentDom.scrollWidth;
            //     }
            //   }

            if (
                currentElement.value.width < 0 ||
                currentElement.value.height < 0
            )
                return;

            if (["rm", "lm", "mt", "mb"].includes(dotIdName)) {
                //这里的top/left区域的改变 还要修改
                let testR1 = Math.sqrt(
                    Math.pow(originData.width, 2) +
                        Math.pow(originData.height, 2)
                );
                let testR2 = Math.sqrt(
                    Math.pow(originData.width + offsetX, 2) +
                        Math.pow(originData.height + offsetY, 2)
                );
                let testZ1 =
                    Math.atan(originData.width / originData.height) -
                    testRotate / 2;
                let testZ2 =
                    Math.atan(
                        currentElement.value.width / currentElement.value.height
                    ) -
                    testRotate / 2;
                let testL1 = (2 * Math.sin(testRotate / 2) * testR1) / 2;
                let testL2 = (2 * Math.sin(testRotate / 2) * testR2) / 2;
                let xOffset =
                    testL2 * Math.cos(testZ2) - testL1 * Math.cos(testZ1);
                let yOffset =
                    testL2 * Math.sin(testZ2) - testL1 * Math.sin(testZ1);
                currentElement.value.left = originData.left - xOffset;
                currentElement.value.top = originData.top + yOffset;
                if (["lm"].includes(dotIdName)) {
                    currentElement.value.left -= offsetX * Math.cos(testRotate);
                    currentElement.value.top -= offsetX * Math.sin(testRotate);
                } else if (["mt"].includes(dotIdName)) {
                    currentElement.value.left += offsetY * Math.sin(testRotate);
                    currentElement.value.top -= offsetY * Math.cos(testRotate);
                }
            } else if (["rb", "rt", "lb", "lt"].includes(dotIdName)) {
                let testR1 = Math.sqrt(
                    Math.pow(currentElement.value.width, 2) +
                        Math.pow(currentElement.value.height, 2)
                );
                let testR2 = testR1 + length1 * flag;
                let xOffset1 =
                    testR1 *
                    Math.sin(testRotate / 2) *
                    Math.cos(kDia - testRotate / 2);
                let xOffset2 =
                    testR2 *
                    Math.sin(testRotate / 2) *
                    Math.cos(kDia - testRotate / 2);
                let yOffset1 =
                    testR1 *
                    Math.sin(testRotate / 2) *
                    Math.sin(kDia - testRotate / 2);
                let yOffset2 =
                    testR2 *
                    Math.sin(testRotate / 2) *
                    Math.sin(kDia - testRotate / 2);
                currentElement.value.left =
                    originData.left - (xOffset2 - xOffset1);
                currentElement.value.top =
                    originData.top + (yOffset2 - yOffset1);
                if (["lb"].includes(dotIdName)) {
                    currentElement.value.left -= offsetX * Math.cos(testRotate);
                    currentElement.value.top -= offsetX * Math.sin(testRotate);
                } else if (["rt"].includes(dotIdName)) {
                    currentElement.value.left += offsetY * Math.sin(testRotate);
                    currentElement.value.top -= offsetY * Math.cos(testRotate);
                } else if (["lt"].includes(dotIdName)) {
                    currentElement.value.left -=
                        length1 *
                        flag *
                        Math.cos(testRotate + Math.PI / 2 - kDia);
                    currentElement.value.top -=
                        length1 *
                        flag *
                        Math.sin(testRotate + Math.PI / 2 - kDia);
                }
            }
        };
    } else if (dotIdName === "rotate") {
        //                    let circle = {x: bound.x + bound.width / 2, y: bound.y + bound.height / 2}
        rotateShow.value = true;
        pack.hideRotateText = function () {
            rotateShow.value = false;
        };
        let circle = {
            x:
                currentElement.value.left * viewerSize.value +
                (currentElement.value.width * viewerSize.value) / 2,
            y:
                currentElement.value.top * viewerSize.value +
                (currentElement.value.height * viewerSize.value) / 2,
        };
        pack.callback = function (moveEvent: any) {
            let length1 = Math.sqrt(
                Math.pow(moveEvent.positionX - circle.x, 2) +
                    Math.pow(moveEvent.positionY - circle.y, 2)
            );
            let length2 = Math.abs(moveEvent.positionX - circle.x);
            let angle = (Math.asin(length2 / length1) * 180) / Math.PI;

            if (
                moveEvent.positionY < circle.y &&
                moveEvent.positionX <= circle.x
            ) {
                angle = 180 - angle;
            } else if (moveEvent.positionX > circle.x) {
                if (moveEvent.positionY <= circle.y) {
                    angle = 180 + angle;
                } else {
                    angle = 360 - angle;
                }
            }
            let integer = Math.round(angle / 30);
            if (Math.abs(angle - integer * 30) <= 2) angle = integer * 30;

            //需要目标对象、初始数据、旋转角度
            currentElement.value.transform = parseInt(angle.toFixed(2));
        };
    }
    setMouseDownEvent(pack);
    // event.stopPropagation();
}

useEventListener(window, "mousemove", (e: any) => {
    let value = viewer.value as HTMLDivElement;
    // console.log(value.offsetLeft)
    if (value) {
        e.positionX = e.clientX - value.offsetLeft;
        e.positionY = e.clientY - value.offsetTop;
        if (
            mouseDownEvent.value !== null &&
            typeof mouseDownEvent.value === "object"
        ) {
            // @ts-ignore
            mouseDownEvent.value.callback(e);
        }
    }
});
useEventListener(window, "mouseup", (e: MouseEvent) => {
    // let originData = mouseDownEvent.value.originData;
    // let newData = copy(currentElement.value);
    // mergeObject(currentElement.value, newData);
    // @ts-ignore
    if (mouseDownEvent.value && mouseDownEvent.value.hideRotateText) {
        // @ts-ignore
        mouseDownEvent.value.hideRotateText();
    }

    assistance.showLeft = false;
    assistance.showTop = false;

    clearMouseDownEvent();
});

onKeyStroke("Delete", (e: KeyboardEvent) => {
    e.preventDefault();
    if (currentElementKey) {
        deleteCurrentElement();
        clearCurrentElement();
    }
});
function dealEleEnter(key: string) {
    // 暂时用 index 来判断当前选中元素，后续可能会改用 virtualKey (已改用)
    currentHoverKey.value = key;
}
function dealEleLeave() {
    currentHoverKey.value = "";
}
function dealHoverBoxDown(event: MouseEvent, key: string) {
    // dealMouseDown(element, event);
    setCurrentElementKey(key);
}
function dealMouseDown(element: any, event: any) {
    setCurrentElementKey(element);
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

useEventListener(window, "resize", viewerResize);

// 先执行一次但好像没有生效(update：用生命周期包裹一下)
onMounted(() => {
    viewerResize();
});
const allLeftTop = computed(() => {
    let leftArr = [];
    let topArr = [];

    for (let i = 0; i < allData.value.length; i++) {
        if (allData.value[i].virtualKey !== currentElementKey.value) {
            leftArr.push(allData.value[i].left);
            leftArr.push(allData.value[i].left + allData.value[i].width / 2);
            leftArr.push(allData.value[i].left + allData.value[i].width);
            topArr.push(allData.value[i].top);
            topArr.push(allData.value[i].top + allData.value[i].height / 2);
            topArr.push(allData.value[i].top + allData.value[i].height);
        }
    }
    return { leftArr, topArr };
});

function curBoxDown(event: MouseEvent) {
    let range = 8;
    let linkVal = 1;
    let eventStartPosition = {
        x: event.clientX,
        y: event.clientY,
    };
    let originData = JSON.parse(JSON.stringify(currentElement.value));
    let pack = {
        target: currentElement.value,
        event: event,
        // originData,
        callback: function (moveEvent: MouseEvent) {
            let viewerWidth = 800;
            let viewerHeight = 800;

            //获取位移信息
            let left =
                (moveEvent.clientX - eventStartPosition.x) / viewerSize.value +
                originData.left;
            let top =
                (moveEvent.clientY - eventStartPosition.y) / viewerSize.value +
                originData.top;
            //这一步是做 左右吸边
            let maxLeft = viewerWidth - originData.width;
            let maxHeight = viewerHeight - originData.height;
            if (left <= range && left >= -(range * 1.5)) {
                left = 0;
            }
            if (top <= range && top >= -(range * 1.5)) {
                top = 0;
            }
            //右吸边、下吸边用天花板函数，避免缩小的情况下看起来仍有空隙
            if (maxLeft - left <= range && maxLeft - left >= -(range * 1.5)) {
                left = Math.ceil(maxLeft);
            }
            if (maxHeight - top <= range && maxHeight - top >= -(range * 1.5)) {
                top = Math.ceil(maxHeight);
            }

            //这一步是 对齐线
            let leftArr = allLeftTop.value.leftArr;
            let topArr = allLeftTop.value.topArr;
            if (leftArr && leftArr.length > 0) {
                let showLeftAssistance = false;
                let assistanceLeft = 0;
                for (let i = 0; i < leftArr.length; i++) {
                    if (Math.abs(leftArr[i] - left) <= linkVal) {
                        //如果水平方向靠近某条线
                        left = leftArr[i];
                        showLeftAssistance = true;
                        assistanceLeft = leftArr[i];
                        break;
                    } else if (
                        Math.abs(
                            leftArr[i] - (left + currentElement.value.width / 2)
                        ) <= linkVal
                    ) {
                        left = leftArr[i] - currentElement.value.width / 2;
                        showLeftAssistance = true;
                        assistanceLeft = leftArr[i];
                        break;
                    } else if (
                        Math.abs(
                            leftArr[i] - (left + currentElement.value.width)
                        ) <= linkVal
                    ) {
                        left = leftArr[i] - currentElement.value.width;
                        showLeftAssistance = true;
                        assistanceLeft = leftArr[i];
                        break;
                    }
                }
                assistance.showLeft = showLeftAssistance;
                assistance.left = assistanceLeft;
            }
            if (topArr && topArr.length > 0) {
                let showTopAssistance = false;
                let assistanceTop = 0;
                for (let i = 0; i < topArr.length; i++) {
                    if (Math.abs(topArr[i] - top) <= linkVal) {
                        top = topArr[i];
                        showTopAssistance = true;
                        assistanceTop = topArr[i];
                        break;
                    } else if (
                        Math.abs(
                            topArr[i] - (top + currentElement.value.height / 2)
                        ) <= linkVal
                    ) {
                        top = topArr[i] - currentElement.value.height / 2;
                        showTopAssistance = true;
                        assistanceTop = topArr[i];
                        break;
                    } else if (
                        Math.abs(
                            topArr[i] - (top + currentElement.value.height)
                        ) <= linkVal
                    ) {
                        top = topArr[i] - currentElement.value.height;
                        showTopAssistance = true;
                        assistanceTop = topArr[i];
                        break;
                    }
                }
                assistance.showTop = showTopAssistance;
                assistance.top = assistanceTop;
            }
            //赋值
            currentElement.value.left = left;
            currentElement.value.top = top;
        },
    };
    setMouseDownEvent(pack);
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
    });
    return style;
});
const getHoverBoxStyle = computed(() => (element: any) => {
    if (element) {
        let style: { [key: string]: any } = Object.assign(
            {},
            {
                opacity:
                    (!currentElement.value ||
                        currentElement.value.virtualKey !==
                            element.virtualKey) &&
                    currentHoverKey.value !== "" &&
                    currentHoverKey.value === element.virtualKey
                        ? 1
                        : 0,

                cursor: "pointer",
                overflow: "visible",
                zIndex: 50 + allData.value.indexOf(element),
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
    // 先 return，等要做 complex 元素的时候再用
    return;
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
    return;
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
    } as CSSProperties;
});

const getRendererStyle = computed(() => {
    return {
        width: 800 * viewerSize.value + "px",
        height: 800 * viewerSize.value + "px",
    } as CSSProperties;
});
</script>
<style>
/* #viewer {
    background-color: #eff2f7;
} */
.renderer {
    display: flex;
    position: relative;
    background-size: 16px 16px;
    box-shadow: 1px 1px 15px rgba(0, 0, 0, 0.2);
    background-color: #fff;
    background-position: 0 0, 8px 8px;
    /* background-image: linear-gradient(
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
        ); */
    width: 800px;
    height: 800px;
    opacity: 1;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QwZDBkMCIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDBkMGQwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=");
}

#rotate {
    position: absolute;
    display: inline-block;
    border: 1px solid #666;
    background: #fff;
    width: 8px;
    height: 8px;
    background: url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18' fill='%23757575'><circle fill='%23fff' cx='9' cy='9' r='8'/><path d='M13.864 3.82a.22.22 0 0 0-.24.048L12.5 4.992a5.26 5.26 0 0 0-3.432-1.268 5.25 5.25 0 0 0-3.731 1.545A5.25 5.25 0 0 0 3.792 9a5.25 5.25 0 0 0 1.545 3.731 5.25 5.25 0 0 0 3.731 1.545 5.25 5.25 0 0 0 3.731-1.545.794.794 0 0 0-1.123-1.123 3.663 3.663 0 0 1-2.608 1.08C7.035 12.688 5.38 11.034 5.38 9s1.654-3.688 3.688-3.688c.848 0 1.652.284 2.304.808l-1.057 1.057a.22.22 0 0 0 .156.376h3.309a.22.22 0 0 0 .22-.221V4.024a.221.221 0 0 0-.136-.204z'/></svg>");
    bottom: 0;
    left: 50%;
    margin-bottom: -40px;
    background-size: 100%;
    width: 18px;
    height: 18px;
    cursor: pointer;
    border: none;
    margin-left: -10px;
}
#rotate:before {
    content: " ";
    border-left: 1px dashed #666;
    position: absolute;
    height: 20px;
    margin-top: -18px;
    /* margin-left: 8px; */
}
</style>
