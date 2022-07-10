<template>
    <div
        class="color-picker-wrap"
        :class="{ 'is-background-color': isBackgroundColor }"
        @click.stop
        @mousedown.stop
        v-if="currentElement"
    >
        <!--普通文字设置颜色-->
        <div
            class="current-picker-colors"
            v-if="
                (!isBackgroundColor && !currentElement.textStyle) ||
                (isBackgroundColor && !currentElement.backgroundImage)
            "
        >
            <i
                class="current-picker-color"
                @click="openColorPicker()"
                :style="{ 'background-color': bgColor }"
            ></i>
        </div>
        <!--炫彩字体-偏移设置颜色-->
        <div v-else>
            <div class="current-picker-colors" v-if="!isBackgroundColor">
                <i
                    class="current-picker-color multi"
                    v-for="(target, index) in colorTargets"
                    :key="index"
                    @click="openColorPicker(target)"
                    :style="colorRender(target, colorTargets.length)"
                ></i>
            </div>
            <div class="current-picker-colors" v-else>
                <i
                    class="current-picker-color multi"
                    @click="openColorPicker(currentElement.backgroundImage)"
                    :style="gradientStyle(currentElement.backgroundImage)"
                ></i>
            </div>
        </div>

        <!--单、多层点击圆圈设置颜色时：多层时就设置第一层的-->
        <i
            class="color-picker-icon bcImage"
            v-if="
                (!isBackgroundColor && !currentElement.textStyle) ||
                (isBackgroundColor && !currentElement.backgroundImage)
            "
            @click="openColorPicker()"
        ></i>
        <i
            class="color-picker-icon bcImage"
            v-else
            @click="
                openColorPicker(
                    !isBackgroundColor
                        ? colorTargets[0]
                        : currentElement.backgroundImage
                )
            "
        ></i>

        <!--颜色选择器-->
        <template v-if="show.colorPicker">
            <!--普通文本取色-->
            <ColorPicker
                :color="renderColor"
                :alpha="isBackgroundColor ? 1 : currentPickerObj.opacity"
                :level="
                    isBackgroundColor
                        ? currentPickerObj.backgroundImage
                        : currentPickerObj
                "
                :isBackgroundColor="isBackgroundColor"
                left="-10px"
                @linearInput="linearInput"
                @onChangeType="onChangeType"
                @input="colorInput"
            >
            </ColorPicker>
        </template>
    </div>
</template>

<script>
//sidebar常规colorPicker的渲染；
import  ColorPicker  from "./ColorPicker.vue";
import { getLinearFromLevel,svgChangeColor} from "@/assets/util";
import textStyles from "@/assets/textStyles";
import { svgChangeColor } from "common/util";
export default {
    name: "ColorPickerRender",
    props: {
        currentElement: Object,
        isBackgroundColor: Boolean,
        isBorderColor: Boolean,
        isShadowColor: Boolean,
    },
    data() {
        return {
            show: {
                colorPicker: false,
            },
            listener: null,
            currentPickerObj: null,
            currentPickerKey: "color",
            currentTarget: null,
        };
    },
    components: {
        ColorPicker,
    },
    methods: {
        onChangeType(type, data) {
            console.log(data);
            if (type === "gradient") {
                this.$set(this.currentElement, "backgroundImage", data);
                this.$set(this.currentElement, "background", "");
                this.currentTarget = this.currentElement.backgroundImage;
            } else {
                this.$set(this.currentElement, "backgroundImage", null);
                this.$set(this.currentElement, "background", data);
                this.currentTarget = null;
            }
        },
        openColorPicker(target) {
            if (this.show.colorPicker) {
                this.show.colorPicker = false;
                if (!target || target === this.currentTarget) return;
            }

            if (this.isBackgroundColor) {
                this.handleBacktound(target);
                return;
            }

            this.$nextTick(() => {
                this.show.colorPicker = true;
                this.currentPickerObj = this.currentElement;
                this.currentPickerKey = "color";
                this.currentTarget = null;
                //有color说明是多层设置
                if (target) {
                    //必然是有targetArr的；[{key: ~, index: ~}]
                    if (!target.length) {
                        return console.error(
                            "出错了，未找到对应的层级: ",
                            this.targetToColor
                        );
                    }
                    //以第 0个作为绑定值，target.key可能是 fillColor或者 strokeColor
                    this.currentPickerObj =
                        this.currentElement.textStyle.levels[target[0].index];
                    this.currentPickerKey = target[0].key;
                    this.currentTarget = target;
                }
                setTimeout(() => {
                    this.startListen();
                }, 100);
            });
        },
        handleBacktound(target) {
            this.$nextTick(() => {
                this.show.colorPicker = true;
                this.currentPickerObj = this.currentElement;
                this.currentTarget = null;
                if (target) {
                    this.currentTarget = target;
                }
                setTimeout(() => {
                    this.startListen();
                }, 100);
            });
        },
        listenCallback() {
            this.show.colorPicker = false;
            this.currentPickerObj = null;
            this.currentPickerKey = "color";
            this.currentTarget = null;
            this.$emit("endInput");
            this.endListen();
        },
        startListen() {
            this.$emit("startInput");
            document.documentElement.addEventListener(
                "mousedown",
                this.listenCallback
            );
        },
        endListen() {
            document.documentElement.removeEventListener(
                "mousedown",
                this.listenCallback
            );
        },
        linearInput(e) {
            if (this.currentTarget) {
                if (this.isBackgroundColor) {
                    Object.assign(
                        this.currentElement.backgroundImage,
                        e.level || {}
                    );
                    this.$set(this.currentElement, "background", "");
                    return;
                }

                this.currentTarget.forEach((target) => {
                    Object.assign(
                        this.currentElement.textStyle.levels[target.index],
                        e.level || {}
                    );
                });
            }
        },
        setElBackground(e) {
            let color = "";
            if (!e) return "";
            if (e.rgba) {
                let rgbaObj = e.rgba;
                color = `rgba(${rgbaObj.r},${rgbaObj.g},${rgbaObj.b},${rgbaObj.a})`;
            } else {
                color = e._color;
            }
            if (!this.currentTarget) {
                this.$set(this.currentElement, "background", color);
                this.$set(this.currentElement, "backgroundImage", null);
            }
        },
        colorInput(e) {
            if (this.isBackgroundColor) {
                this.setElBackground(e);
                return;
            }
            if (!e || !e.rgba) return "";
            let rgbaObj = e.rgba;
            let color = `rgba(${rgbaObj.r},${rgbaObj.g},${rgbaObj.b},${rgbaObj.a})`;

            let type = this.currentPickerObj.type;
            if (this.currentTarget) {
                //层级元素变色；
                let targetArr = this.currentTarget;
                if (!targetArr.length) {
                    return console.error(
                        "出错了，未找到对应的层级：",
                        this.targetToColor
                    );
                }
                targetArr.forEach((target) => {
                    target.index === -1
                        ? (this.currentElement.color = color)
                        : (this.currentElement.textStyle.levels[target.index][
                              target.key
                          ] = color);
                });
            } else {
                //普通元素变色；
                if (this.isBorderColor) {
                    this.currentPickerObj.border.color = color;
                } else if (this.isShadowColor) {
                    this.currentPickerObj.boxShadow.color = color;
                } else {
                    this.currentPickerObj[this.currentPickerKey] = color;
                }
            }

            //改的是svg,那么单独改svg;
            if (!this.isBorderColor && !this.isShadowColor) {
                type &&
                    type.toLowerCase() === "svg" &&
                    svgChangeColor(this.currentElement, color);
            }
            this.$emit("input", color);
        },
        colorRender(target, size) {
            let style = {};
            let color = this.targetToColor.get(target);
            if (!color) return;
            if (color.indexOf("linear") !== -1) {
                style.backgroundImage = color;
            } else {
                style.backgroundColor = color;
            }
            style.marginLeft = (10 / size) * 2 + "px";
            return style;
        },
        changeImageTextStyle(color, index) {
            let textStyle = this.currentElement.textStyle;
            let originTextStyle = this.textStylesMap.get(textStyle.name);
            this.currentElement.color = color;
            this.currentElement.textStyle.levels[0].backgroundImage =
                originTextStyle.images[index];
        },
    },
    computed: {
        renderColor() {
            if (this.isBackgroundColor) {
                return this.currentPickerObj.background;
            } else if (this.isBorderColor) {
                return this.currentPickerObj.border.color;
            } else if (this.isShadowColor) {
                return this.currentPickerObj.boxShadow.color;
            } else {
                return this.currentPickerObj[this.currentPickerKey];
            }
        },
        bgColor() {
            if (this.isBackgroundColor) {
                return this.currentElement.background;
            } else if (this.isBorderColor) {
                return this.currentElement.border.color;
            }
            if (this.isShadowColor) {
                return this.currentElement.boxShadow.color;
            } else {
                return this.currentElement.color;
            }
        },
        //enum {normal || null, image, offset }
        textStyleType: function () {
            let currentElement = this.currentElement;
            return (
                currentElement &&
                currentElement.textStyle &&
                currentElement.textStyle.type
            );
        },
        textStylesMap: function () {
            let map = new Map();
            if (!textStyles) return map;

            textStyles.forEach((style) => {
                map.set(style.name, style);
            });
            return map;
        },
        //原始 color -> targetArray 的映射，其中，targetArray是 [{index, key}, {index2, key2}] 类似的数组，内部对象是层级位置与属性；
        systemColorToTarget() {
            if (!this.currentElement.textStyle) return new Map();
            let textStyle = this.textStylesMap.get(
                this.currentElement.textStyle.name
            );
            let levels = textStyle.levels;
            let colorToTarget = new Map();
            levels.forEach((level, index) => {
                level.strokeColor &&
                    pushColor(level.strokeColor, index, "strokeColor");
                level.fillColor &&
                    pushColor(level.fillColor, index, "fillColor");
                level.colorPercent &&
                    pushColor(getLinearFromLevel(level), index, "linear");
            });
            //元素颜色以 index === -1 标识，因为不是任何一个层级的；
            pushColor(textStyle.color, -1, "color");
            function pushColor(color, index, key) {
                if (!colorToTarget.get(color)) colorToTarget.set(color, []);
                colorToTarget.get(color).push({ index, key });
            }
            return colorToTarget;
        },
        /*
         * @return {Object} 类似 { '#f23030' : [ {index: 0, key: 'strokeColor'} ] },currentElement内所有层颜色与位置、属性的对应；
         *
         * //实时 targetArray -> color 的映射,其中targetArray是从系统中来的，是固定的，而color是会随着层级调整而改变的；
         * */
        targetToColor() {
            if (!this.currentElement.textStyle) return new Map();
            let currentMap = new Map();
            let levels = this.currentElement.textStyle.levels;
            let systemMap = this.systemColorToTarget;
            for (let entries of systemMap) {
                let [color, targetArr] = entries;
                let { index, key } = targetArr[0];
                let currentColor =
                    index === -1
                        ? this.currentElement.color
                        : targetArr[0].key === "linear"
                        ? getLinearFromLevel(levels[index])
                        : levels[index][key];
                currentMap.set(targetArr, currentColor);
            }
            return currentMap;
        },
        /*
         * 从 targetToColor 中取出 target作为数组，用于渲染选择器；
         * */
        colorTargets() {
            let colorTargets = [];
            for (let entries of this.targetToColor) {
                let targetArray = entries[0];
                //如果某个颜色层里只有color，不列入可调整范围（换句话说，currentElement.color只能随着其他变量的调整而跟随调整）
                if (targetArray.length === 1 && targetArray[0].index === -1)
                    continue;
                colorTargets.push(targetArray);
            }
            console.log(colorTargets);
            return colorTargets;
        },
        //显示的样式
        renderStyle() {
            let style = {};
            try {
                let ceng = this.currentElement.textStyle.levels[0];
                style[
                    "background-image"
                ] = `linear-gradient(90deg, ${ceng.colorPercent
                    .map((data) => `${data.color} ${data.percent * 100 + "%"}`)
                    .join(",")})`;
            } catch (e) {
                console.error("捕获到当前渐变文本内容缺失：", ceng);
            }
            return style;
        },
        gradientStyle() {
            return (color) => {
                let linearGradient = `linear-gradient(${
                    color.degree
                }deg, ${color.colorPercent
                    .map((data) => `${data.color} ${data.percent * 100 + "%"}`)
                    .join(",")})`;
                return {
                    "background-image": linearGradient,
                };
            };
        },
    },
    watch: {
        //这里更好的行为应该是管理全局mousedown，不要随便用 stopPropagation
        currentElement(newEle, originEle) {
            if (newEle !== originEle) {
                this.show.colorPicker = false;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.color-picker-wrap {
    position: relative;
    width: 210px;
    height: 36px;
    line-height: 36px;
    border-radius: 2px;
    border: solid 1px #dfe3ed;
    display: flex;
    align-items: center;
    padding-left: 10px;

    margin: 30px auto 0;
    &.is-background-color {
        margin-top: 0px;
    }
    .current-picker-colors {
        width: 160px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
    }
    .current-picker-color {
        width: 160px;
        height: 20px;
        /*background-color: #000;*/
        cursor: pointer;
        border: solid 1px #dfe3ed;
        border-radius: 4px;
        position: relative;
        &:first-child {
            margin-left: 0 !important;
        }
        &::before {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -1;
            background-image: linear-gradient(
                    to top right,
                    #ccc 25%,
                    transparent 0,
                    transparent 75%,
                    #ccc 0,
                    #ccc
                ),
                linear-gradient(
                    to top right,
                    #ccc 25%,
                    transparent 0,
                    transparent 75%,
                    #ccc 0,
                    #ccc
                );
            background-size: 12px 12px;
            background-position: 0 0, 6px 6px;
        }
    }
    .color-picker-icon {
        width: 20px;
        height: 20px;
        background-position: -408px -16px;
        margin-left: 10px;
        cursor: pointer;
    }
    .image-text-style-wrap {
        position: absolute;
        right: -10px;
        top: calc(100% + 10px);
        background: #fff;
        z-index: 10;
        padding: 10px;
        border-radius: 2px;
        box-shadow: 10px 0 14px rgba(53, 100, 175, 0.15);
        min-height: 100px;
        min-width: 220px;
        display: flex;
        flex-wrap: wrap;
        .image-text-style-child {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin: 0 8px;
            cursor: pointer;
            &.selected {
                border: 1px solid #005cf9;
            }
        }
    }
}
</style>
