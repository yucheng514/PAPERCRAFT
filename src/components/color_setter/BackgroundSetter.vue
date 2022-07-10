<template>
    <div class="side-set-color">
        <div class="color-block mt-0">
            <div class="color-title">当前背景色</div>
            <!-- <div class="color-item picker" @click="changeColorPickerShow">
                <ColorPicker
                        :color="value"
                        @input="colorInput"
                        v-if="show.colorPicker">
                </ColorPicker>
            </div> -->

            <ColorPickerRender
                :currentElement="currentElement"
                :isBackgroundColor="true"
            ></ColorPickerRender>
        </div>

        <div class="color-block">
            <div class="color-title">常用纯色背景</div>
            <div class="purity-colors">
                <div
                    class="color-item"
                    :class="{
                        transparent: color === 'transparent',
                        white: color === '#ffffff',
                        picker: color === 'picker',
                    }"
                    :style="{ backgroundColor: color }"
                    @click="colorSelect(color, false)"
                    v-for="color in commonlyUsedColors.purity"
                    :key="color"
                ></div>
            </div>
        </div>

        <div class="color-block">
            <div class="color-title">常用渐变背景</div>
            <div class="gradient-colors">
                <div
                    v-for="(color, lineIndex) in commonlyUsedColors.gradient"
                    class="color-item"
                    :style="getGradientStyle(color)"
                    @click="colorSelect(color, true)"
                    :key="lineIndex"
                ></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
// import { ColorPicker, ColorPickerRender } from "./";
import ColorPickerRender from "./ColorPickerRender.vue";
import { commonlyUsedColors } from "@/assets/backgroundColors";
import { copy } from "@/assets/util";
import currentElement from "../computed/currentElement";
const presetColors = reactive([]);
const moreColors = reactive([]);
const show = reactive({
    colorPicker: false,
});
const listener = ref(null);
interface Props {
    value: string;
    gradient: string;
}
const props = defineProps<Props>();

function setNewOrigin() {}
function newOriginChange() {}
function changeColorPickerShow() {
    //这里return是为了统一到eventListener中处理
    if (show.colorPicker) return;
    show.colorPicker = true;
    setTimeout(() => {
        startListen();
    }, 100);
}
function listenCallback() {
    show.colorPicker = false;
    // $emit("endInput");
    endListen();
}
function startListen() {
    // $emit("startInput");
    document.documentElement.addEventListener("click", listenCallback);
}
function endListen() {
    document.documentElement.removeEventListener("click", listenCallback);
}
function colorInput(e: any) {
    if (!e || !e.rgba) return "";
    let rgbaObj = e.rgba;
    let color = `rgba(${rgbaObj.r},${rgbaObj.g},${rgbaObj.b},${rgbaObj.a})`;
    // $emit("input", color);
}
function colorSelect(color: any, isGradient: any) {
    // $emit("change", copy(color), isGradient);
}
function setMoreColors() {
    let origin = [180, 0, 0];
    let pure = "red";
    let lighter = function (color) {
        let lighterColor = [];
        color.map((value) => {
            let el = value + 25;
            if (el > 255) {
                el = 255;
            }
            lighterColor.push(el);
        });
        return lighterColor;
    };
    let newColor = function (originColor) {
        let color = originColor.slice(0);
        let max = 180;
        switch (pure) {
            case "red":
                color[1] += 60;
                if (color[1] >= max) {
                    color[1] = max;
                    pure = "yellow";
                }
                break;
            case "yellow":
                color[0] -= 60;
                if (color[0] <= 0) {
                    color[0] = 0;
                    pure = "green";
                }
                break;
            case "green":
                color[2] += 60;
                if (color[2] >= max) {
                    color[2] = max;
                    pure = "sky";
                }
                break;
            case "sky":
                color[1] -= 60;
                if (color[1] <= 0) {
                    color[1] = 0;
                    pure = "blue";
                }
                break;
            case "blue":
                color[0] += 60;
                if (color[0] >= max) {
                    color[0] = max;
                    pure = "purple";
                }
                break;
            case "purple":
                color[2] -= 60;
                if (color[2] <= 0) {
                    color[2] = 0;
                    pure = "red";
                }
                break;
        }
        return color;
    };
    for (let i = 0; i < 18; ++i) {
        moreColors.push([origin]);
        origin = newColor(origin);
        for (let j = 0; j < 5; j++) {
            moreColors[i].push(lighter(moreColors[i][j]));
        }
    }
    moreColors.forEach((colorLine) => {
        colorLine.forEach((color, index) => {
            colorLine[index] = `rgb(${color[0]},${color[1]},${color[2]})`;
        });
    });
}
setMoreColors();
const getGradientStyle = computed(() => {
    return (color: any) => {
        let linearGradient = `linear-gradient(${
            color.degree
        }deg, ${color.colorPercent
            .map((data: any) => `${data.color} ${data.percent * 100 + "%"}`)
            .join(",")})`;
        return {
            "background-image": linearGradient,
        };
    };
});
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.side-set-color {
    width: 100%;
    max-height: 100%;
    padding: 23px 25px 0 25px;
    color: #333;
    font-size: 14px;
    .color-title {
        font-size: 14px;
        color: #333333;
        line-height: 14px;
        margin-bottom: 16px;
    }
    .color-block {
        margin-top: 30px;
        &.mt-0 {
            margin-top: 0;
        }
        .color-item {
            width: 30px;
            height: 30px;
            cursor: pointer;
            position: relative;
            margin-right: 8px;
            border-radius: 2px;
            box-sizing: border-box;

            &.picker {
                position: relative;
                background: url(https://res.cxb123.com/lottery/img/editor/left-tool-icon.png?t=20190909) -58px -32px/257px
                    112px no-repeat;
            }
            &.transparent {
                background-size: 6px 6px;
                background-position: 0 0, 3px 3px;
                background-image: linear-gradient(
                        to right top,
                        #cccccc 25%,
                        transparent 25%,
                        transparent 75%,
                        #cccccc 75%,
                        #cccccc
                    ),
                    linear-gradient(
                        to right top,
                        #cccccc 25%,
                        transparent 25%,
                        transparent 75%,
                        #cccccc 75%,
                        #cccccc
                    );
            }
            &.white {
                border: 1px solid #e5e5e5;
            }
            &.selected::after {
                content: "";
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 11px;
                height: 8px;
                background-repeat: no-repeat;
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAIBAMAAADdFhi7AAAAJFBMVEUAAAD///////////////////////////////////////////+0CY3pAAAAC3RSTlMA4wzDIs+uqZCISG52M/AAAAAwSURBVAjXYwABtwUgkkW6AUQ5blZgmOrAIm3EwFAtAuIwKG8EcRiYrIEcIFAUAhIA4McHxzajgDcAAAAASUVORK5CYII=);
            }
            &.selected.transparent::after,
            &.selected.white::after {
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAIBAMAAADdFhi7AAAAIVBMVEUAAABmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmYs5FxxAAAACnRSTlMA4wzDIozPrqlIHjmMiQAAADBJREFUCNdjAAH3CSCSRSoARDkuVmAIc2CRMmJg6BIBcRiUF4I4DExWQA4QKAoBCQDI6AcU6FHqWgAAAABJRU5ErkJggg==");
            }
        }
        .purity-colors {
            display: flex;
            flex-wrap: wrap;
            .color-item {
                &:nth-child(6n) {
                    margin-right: 0;
                }
                &:nth-child(n + 7) {
                    margin-top: 10px;
                }
            }
        }
        .gradient-colors {
            display: flex;
            flex-wrap: wrap;
            .color-item {
                width: 50px;
                height: 50px;
                margin-right: 6.666px;

                &:nth-child(4n) {
                    margin-right: 0;
                }
                &:nth-child(n + 5) {
                    margin-top: 10px;
                }
            }
        }
    }
    .title {
        font-weight: 400;
        line-height: 16px;
        justify-content: space-between;
        display: flex;
        .delete {
            cursor: pointer;
        }
        .delete-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            vertical-align: middle;
            margin-right: 6px;
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAWlBMVEUAAACTlp6Xl5+TlZ2SlZ6Wl6CQm5yTlZ6Slp6TlZ2TlZ6Vn6Cjo6STlZ+Tlp2Slp6Tlp6Slp+TlZ6SlZ6SlZ6Slp+Tlp6Tlp2SlZ6Tlp6TlZ2SmJ2SlZ2Tlp46rgHFAAAAHXRSTlMAYRKAnRsW19/b0gwGb2jFv3fPyvZbsZJMQeIr6P+TmkUAAAMeSURBVHja7dgLTttQFIRhk8SJQwKh1HkAPfvfZj1VhYDE92FX5czo/Dv4NNe2fJsoiqIoYuhteeis35yOu4a5y5Mh1J/bhraVfax/aTjbn+xLx4ax/ZNdddfwBYeCBA4FCRwKEjgUJHAoSOBQkMChIIFDQQKHggQOBQkcChI4FCRwKEjgUJDAoSDZH8wUJHAoSOBQkMChIIFDQQKHggQOBQkcChI4FCRwKEjgUJDAoSCBQ0ECh4JkNzgUJLufZgoSOBQkcJiA5K+DXvLuIJd8cFBLPjmIJV8ctJIrB6nkhoNSctNBKBlx0ElGHWSShINKknQQSTIOGsnu2dKRSAocFJIiB4Gk0OFeUuxwLqlwuJZUORxLKh1uJdUOp5LvdwwSEccgEXEMEhHHIBFxzJSszFFzJIt7c1RIQvJeSEISknzfKGkfriSOvvBmx1JHZz9cb9K/lTrMueR1V+hwL1mWOfxL+jbnWA8OBsky59iaUUie8g4OSZd1kEj6pGNjRiNJOBaDg0byK+3gkTwnHUSSVcpRLNnYt3dJOJgk28T/BpXkMu6gkqzGHVSSw/425GBGJblf3HacraQHN5Ixx4sZlWTM0WyMSgLH2CBMklFHczYmCRwjHYxIknA0r8YjSTkas3mS9XzJfAfqzUg2STpwtEgkcKQ6GYcEjmSPRiGBI11rDBI4cp0IJHBka3v3kg0c+Y7mXAJHUedJksR96z92rJvSVp4l2ENBAoeCBA4FCRwKEjj+j+QxI5nvUJDAoSCBQ0ECh4IEDgUJHAoSOBQk28GhINmum0ZBAoeCBA4FCRwKEjgUJHAoSOBQkPxxOJV09Q6fkrard5BLPjioJZ8cxJIvDlrJlcOF5C4vyTsoJd0tB6Gka5tb0UlGHWSShINKknQQSTIOGknWQSIpcFBIihwEkkKHe0mxw7mkwuFaUuVwLKl0uJVUO5xKDvUOl5LlrF78SGxWSz+b+IBMlDiETJQ4hEyTHB1CJkocQiZKHEKmSS4OIVMk9wuPEEhqHR6PFiS1Do8Pe60EDo+v3yiKoiiKoiiKoiiKoiiK5vQbhGSdSNqAp3sAAAAASUVORK5CYII=")
                0 0/16px 16px;
        }
    }
    .color-row {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        margin-top: 12px;
    }
}
</style>
