<template>
    <div
        class="component-color-picker"
        v-if="inited"
        @click.stop="linearFastShow = false"
        :style="pickerStyle"
    >
        <!--渐变改色选择区-->
        <header>
            <p class="title" v-if="!isBackgroundColor && isLinear">渐变</p>
            <div class="title-box" v-if="isBackgroundColor">
                <div class="title-change">
                    <div
                        @click="changeType('purity')"
                        class="title-item"
                        :class="{ active: !isLinear }"
                    >
                        纯色
                    </div>
                    <div
                        @click="changeType('gradient')"
                        class="title-item"
                        :class="{ active: isLinear }"
                    >
                        渐变
                    </div>
                </div>
            </div>
            <div class="linear-row" v-if="isLinear">
                <div class="linear-operate" :style="linearStyle">
                    <div
                        class="scroll-wrapper"
                        ref="scroll-wrapper"
                        @mousedown="addLinearItem"
                    >
                        <div
                            class="operate-item"
                            :class="{
                                selected: linearItem === currentLinearItem,
                            }"
                            :style="{
                                backgroundColor: linearItem.color,
                                left: linearItem.percent * 100 + '%',
                            }"
                            @mousedown.stop="
                                startLinearListen($event, 'linear', linearItem)
                            "
                            v-for="(linearItem, index) in isBackgroundColor
                                ? backgroundImage.colorPercent
                                : level.colorPercent"
                            :key="index"
                        ></div>
                    </div>
                </div>
                <button
                    class="fast-linear"
                    @click.stop="linearFastShow = !linearFastShow"
                ></button>
            </div>
        </header>

        <!--颜色选择区域-->
        <main class="inner-picker-wrap">
            <chrome-picker
                ref="chromePicker"
                :value="
                    isLinear
                        ? currentLinearItem.color
                        : isBackgroundColor
                        ? backgroundColor
                        : color
                "
                @input="updateValue"
            ></chrome-picker>
            <div
                class="linear-fast-wrap"
                v-if="isLinear"
                v-show="linearFastShow"
            >
                <i
                    class="fast-item"
                    :style="{
                        backgroundImage: getLinear(fastLinear.colorPercent),
                    }"
                    @click="setCurrentLinear(fastLinear)"
                    v-for="(fastLinear, index) in presetFastLinears"
                    :key="index"
                ></i>
            </div>
            <aside class="fast-color-pick">
                <div
                    class="color-block"
                    v-for="(color, index) in fastColorBlock"
                    :style="{ background: color }"
                    :key="index"
                    @click="fastPick(color)"
                ></div>
            </aside>
        </main>

        <!--渐变角度调整区-->
        <footer class="footer" v-if="isLinear">
            <p>渐变角度</p>
            <div class="degree-shown">
                <input
                    v-if="!isBackgroundColor"
                    type="text"
                    v-model="level.degree"
                    @input="dealDegreeInput"
                    @focus="$event.target.select()"
                    class="degree-input"
                />
                <input
                    v-else
                    type="text"
                    v-model="backgroundImage.degree"
                    @input="dealDegreeInput"
                    @focus="$event.target.select()"
                    class="degree-input"
                />
                <span class="right-adjust">
                    <span @click="handleDegree('plus')"></span>
                    <span @click="handleDegree('subtract')"></span>
                </span>
            </div>
            <div
                class="degree-disk"
                @mousedown="
                    startLinearListen($event, 'degree');
                    dealMouseMove($event);
                "
            >
                <i
                    class="degree-line"
                    id="degree-line"
                    @mousedown.stop="startLinearListen($event, 'degree')"
                    :style="{
                        transform: `rotate(${
                            (isBackgroundColor
                                ? backgroundImage.degree
                                : level.degree) - 90
                        }deg)`,
                    }"
                ></i>
            </div>
        </footer>
    </div>
</template>

<script>
//阻止click防止触发全屏关闭选择器事件,外部用v-if保证随时触发重新赋初始值
import { Chrome } from "vue-color";
import { getAngle, copy } from "common/util";
import bus from "common/bus";
export default {
    components: {
        "chrome-picker": Chrome,
    },
    props: {
        left: {
            default: "0px",
        },
        top: {
            default: "calc(100% + 4px)",
        },
        color: {
            default: "#194d33",
        },
        alpha: {
            default: 1,
        },
        level: {
            type: Object,
            default: null,
        },
        //是否是背景
        isBackgroundColor: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            colors: {
                hex: this.color,
                a: this.alpha,
            },
            fastColorBlock: [
                "#000000",
                "#ffffff",
                "#FF0000",
                "#FFDE00",
                "#105EF5",
            ],
            currentLinearItem: null,
            moveData: null,
            inited: false,
            linearFastShow: false,
            presetFastLinears: [
                {
                    degree: 90,
                    colorPercent: [
                        {
                            color: "rgb(255, 111, 216)",
                            percent: 0,
                        },
                        {
                            color: "rgb(56, 19, 194)",
                            percent: 1,
                        },
                    ],
                },
                {
                    degree: 90,
                    colorPercent: [
                        {
                            color: "rgb(255, 236, 210)",
                            percent: 0,
                        },
                        {
                            color: "rgb(255, 111, 171)",
                            percent: 1,
                        },
                    ],
                },
                {
                    degree: 90,
                    colorPercent: [
                        {
                            color: "rgb(255, 248, 134)",
                            percent: 0,
                        },
                        {
                            color: "rgb(240, 114, 182)",
                            percent: 1,
                        },
                    ],
                },
                {
                    degree: 90,
                    colorPercent: [
                        {
                            color: "rgb(82, 229, 231)",
                            percent: 0,
                        },
                        {
                            color: "rgb(19, 12, 183)",
                            percent: 1,
                        },
                    ],
                },
                {
                    degree: 90,
                    colorPercent: [
                        {
                            color: "rgb(146, 255, 192)",
                            percent: 0,
                        },
                        {
                            color: "rgb(0, 38, 97)",
                            percent: 1,
                        },
                    ],
                },
                {
                    degree: 90,
                    colorPercent: [
                        {
                            color: "rgb(37, 117, 252)",
                            percent: 0,
                        },
                        {
                            color: "rgb(106, 17, 203)",
                            percent: 1,
                        },
                    ],
                },
                {
                    degree: 90,
                    colorPercent: [
                        {
                            color: "rgb(255, 0, 0)",
                            percent: 0,
                        },
                        {
                            color: "rgb(16, 94, 245)",
                            percent: 1,
                        },
                    ],
                },
                {
                    degree: 90,
                    colorPercent: [
                        {
                            color: "rgb(255, 255, 255)",
                            percent: 0,
                        },
                        {
                            color: "rgb(0, 0, 0)",
                            percent: 1,
                        },
                    ],
                },
                {
                    degree: 90,
                    colorPercent: [
                        {
                            color: "rgb(67, 203, 255)",
                            percent: 0,
                        },
                        {
                            color: "rgb(151, 8, 204)",
                            percent: 1,
                        },
                    ],
                },
                {
                    degree: 90,
                    colorPercent: [
                        {
                            color: "rgb(0, 255, 218)",
                            percent: 0,
                        },
                        {
                            color: "rgb(16, 94, 245)",
                            percent: 1,
                        },
                    ],
                },
                {
                    degree: 90,
                    colorPercent: [
                        {
                            color: "rgb(248, 237, 212)",
                            percent: 0,
                        },
                        {
                            color: "rgb(15, 57, 61)",
                            percent: 1,
                        },
                    ],
                },
                {
                    degree: 90,
                    colorPercent: [
                        {
                            color: "rgb(0, 250, 255)",
                            percent: 0,
                        },
                        {
                            color: "rgb(245, 16, 137)",
                            percent: 1,
                        },
                    ],
                },
                {
                    degree: 90,
                    colorPercent: [
                        {
                            color: "rgb(255, 239, 239)",
                            percent: 0,
                        },
                        {
                            color: "rgb(245, 16, 137)",
                            percent: 1,
                        },
                    ],
                },
                {
                    degree: 90,
                    colorPercent: [
                        {
                            color: "rgb(255, 251, 239)",
                            percent: 0,
                        },
                        {
                            color: "rgb(245, 166, 16)",
                            percent: 1,
                        },
                    ],
                },
                {
                    degree: 90,
                    colorPercent: [
                        {
                            color: "rgb(239, 255, 250)",
                            percent: 0,
                        },
                        {
                            color: "rgb(16, 245, 199)",
                            percent: 1,
                        },
                    ],
                },
                {
                    degree: 90,
                    colorPercent: [
                        {
                            color: "rgb(239, 240, 255)",
                            percent: 0,
                        },
                        {
                            color: "rgb(16, 101, 245)",
                            percent: 1,
                        },
                    ],
                },
                {
                    degree: 90,
                    colorPercent: [
                        {
                            color: "rgb(255, 239, 251)",
                            percent: 0,
                        },
                        {
                            color: "rgb(245, 16, 68)",
                            percent: 1,
                        },
                    ],
                },
                {
                    degree: 90,
                    colorPercent: [
                        {
                            color: "rgb(255, 239, 251)",
                            percent: 0,
                        },
                        {
                            color: "rgb(255, 156, 163)",
                            percent: 1,
                        },
                    ],
                },
                {
                    degree: 90,
                    colorPercent: [
                        {
                            color: "rgb(255, 251, 239)",
                            percent: 0,
                        },
                        {
                            color: "rgb(255, 177, 156)",
                            percent: 1,
                        },
                    ],
                },
                {
                    degree: 90,
                    colorPercent: [
                        {
                            color: "rgb(239, 255, 241)",
                            percent: 0,
                        },
                        {
                            color: "rgb(190, 156, 255)",
                            percent: 1,
                        },
                    ],
                },
            ],
            backgroundColor: "",
            backgroundImage: null,
        };
    },
    mounted() {
        setTimeout(() => {
            let inputElement = document.querySelector("input.vc-input__input");
            if (inputElement) {
                inputElement.select();
                // 添加事件，使之点击选中全部
                inputElement.addEventListener("click", () => {
                    inputElement.select();
                });
            }
        }, 100);
        if (this.isBackgroundColor) {
            this.backgroundColor = copy(this.color);
            this.backgroundImage = copy(this.level);
        }
        //初始化 currentLinearItem
        if (this.isLinear) {
            this.currentLinearItem = this.isBackgroundColor
                ? this.backgroundImage.colorPercent[0]
                : this.level.colorPercent[0];
            this.openDeleteListener();
        }
        this.inited = true;
    },
    beforeDestroy() {
        this.removeListener();
        document.body.removeEventListener("keydown", this.dealKeyDown);
        bus.$emit("openBackspaceListener");
    },
    methods: {
        hexToRgba(hex) {
            let reg = /^(rgba|RGBA|rgb|RGB)/;
            if (reg.test(hex)) {
                return hex;
            }
            return (
                "rgba(" +
                parseInt("0x" + hex.slice(1, 3)) +
                "," +
                parseInt("0x" + hex.slice(3, 5)) +
                "," +
                parseInt("0x" + hex.slice(5, 7)) +
                "," +
                1 +
                ")"
            );
        },
        // 处理渐变第二个色值
        handleGradienColor(rgba) {
            //处理出来还是蛮难看的 暂时不用
            let result = rgba.split("(")[1].split(")")[0].split(",");

            result[0] = Math.abs(255 - result[0]);
            result[1] = Math.abs(0 - result[1]);
            result[2] = Math.abs(120 - result[2]);

            return `rgba(${result[0]}, ${result[1]}, ${result[2]}, 1)`;
        },
        changeType(type) {
            if (type === "gradient") {
                this.backgroundImage = {
                    degree: 90,
                    colorPercent: [
                        {
                            color: this.backgroundColor || "transparent",
                            percent: 0,
                        },
                        {
                            color: "rgba(10, 207, 254, 1)", //暂时还不知道第二个颜色渐变的规则 先固定一个
                            percent: 1,
                        },
                    ],
                };

                this.currentLinearItem = this.isBackgroundColor
                    ? this.backgroundImage.colorPercent[0]
                    : this.level.colorPercent[0];

                this.backgroundColor = "";
                this.$emit("onChangeType", type, this.backgroundImage);
            } else {
                this.backgroundColor =
                    this.backgroundImage.colorPercent[0].color;
                this.backgroundImage = null;
                this.$emit("onChangeType", type, this.backgroundColor);
            }
        },
        openDeleteListener() {
            bus.$emit("clearBackspaceListener");
            document.body.addEventListener("keydown", this.dealKeyDown);
        },
        dealKeyDown(e) {
            e.stopPropagation();
            if (e.target.tagName === "INPUT" || e.target.tagName === "AREA") {
                return;
            }
            if (this.isBackgroundColor) {
                if (
                    (e.keyCode === 46 || e.keyCode === 8) &&
                    this.backgroundImage &&
                    this.backgroundImage.colorPercent.length > 2
                ) {
                    let index = this.backgroundImage.colorPercent.indexOf(
                        this.currentLinearItem
                    );
                    this.backgroundImage.colorPercent.splice(index, 1);
                    this.currentLinearItem =
                        this.backgroundImage.colorPercent[0];
                }
            } else {
                if (
                    (e.keyCode === 46 || e.keyCode === 8) &&
                    this.level &&
                    this.level.colorPercent.length > 2
                ) {
                    let index = this.level.colorPercent.indexOf(
                        this.currentLinearItem
                    );
                    this.level.colorPercent.splice(index, 1);
                    this.currentLinearItem = this.level.colorPercent[0];
                }
            }
        },
        fastPick(hex) {
            this.colors.hex = hex;
            this.$refs.chromePicker.childChange(this.colors);
        },
        updateValue: function (e) {
            if (!e || !e.rgba) return "";
            let rgbaObj = e.rgba;
            let color = `rgba(${rgbaObj.r},${rgbaObj.g},${rgbaObj.b},${rgbaObj.a})`;
            //内部直接改渐变值
            if (this.isLinear) {
                this.currentLinearItem.color = color;
                let level = {
                    colorPercent: this.isBackgroundColor
                        ? this.backgroundImage.colorPercent
                        : this.level.colorPercent,
                };
                if (this.isBackgroundColor) {
                    Object.assign(this.backgroundImage, level);
                }
                this.$emit("linearInput", { level });
            }
            if (this.isBackgroundColor) {
                this.backgroundColor = color;
            }
            this.$emit("input", e);
        },
        //添加渐变节点
        addLinearItem(e) {
            let colorPercent = this.isBackgroundColor
                ? this.backgroundImage.colorPercent
                : this.level.colorPercent;

            let wrapperBounding =
                this.$refs["scroll-wrapper"].getBoundingClientRect();
            let offset = e.clientX - wrapperBounding.left;
            let percent = +(offset / wrapperBounding.width).toFixed(2);
            //插入要点：色值需要初始化为当前百分比在该渐变中的色值
            let newLinearItem = {
                color: "",
                percent,
            };
            colorPercent.push(newLinearItem);
            colorPercent.sort(
                (linearItem1, linearItem2) =>
                    linearItem1.percent - linearItem2.percent
            );
            let index = colorPercent.indexOf(newLinearItem);
            let newColor = "";
            if (index === 0) {
                newColor = colorPercent[index + 1].color;
            } else if (index === colorPercent.length - 1) {
                newColor = colorPercent[colorPercent.length - 1].color;
            } else {
                let start = this.getRGA(colorPercent[index - 1].color);
                let end = this.getRGA(colorPercent[index + 1].color);
                newColor = `rgb(${start.r + (end.r - start.r) * percent},${
                    start.g + (end.g - start.g) * percent
                },${start.b + (end.b - start.b) * percent})`;
            }
            colorPercent[index].color = newColor;
            this.currentLinearItem = colorPercent[index];
        },
        getRGA(color) {
            let result = { r: 0, g: 0, b: 0 };
            let match = color.match(
                /([0-9\.]+)\s*,\s*([0-9\.]+)\s*,\s*([0-9\.]+)/
            );
            if (match) {
                result.r = +match[1];
                result.g = +match[2];
                result.b = +match[3];
            }
            return result;
        },
        //调整角度时没有 linearItem
        startLinearListen(e, type, linearItem) {
            linearItem && (this.currentLinearItem = linearItem);
            this.moveData = {
                type: type,
                event: e,
                percent: linearItem && linearItem.percent,
            };
            document.addEventListener("mousemove", this.dealMouseMove);
            document.addEventListener("mouseup", this.dealMouseUp);
        },
        dealMouseMove(e) {
            if (!this.moveData) return;
            if (this.moveData.type === "linear") {
                //调整单个位置的百分比
                let originEvent = this.moveData.event;
                let parentWidth = originEvent.target.parentNode.clientWidth;
                let originPercent = this.moveData.percent;
                let newPercent =
                    originPercent +
                    (e.clientX - originEvent.clientX) / parentWidth;
                this.currentLinearItem.percent =
                    newPercent > 1 ? 1 : newPercent < 0 ? 0 : newPercent;
                let string = this.isBackgroundColor
                    ? "backgroundImage"
                    : "level";
                let level = {
                    colorPercent: this[string].colorPercent.sort(
                        (linearItem1, linearItem2) =>
                            linearItem1.percent - linearItem2.percent
                    ),
                };
                if (this.isBackgroundColor) {
                    Object.assign(this.backgroundImage, level);
                }
                this.$emit("linearInput", { level });
            } else if (this.moveData.type === "degree") {
                this.computeDegree(e);
            }
        },
        dealMouseUp() {
            this.moveData = null;
            this.removeListener();
        },
        //当前点击位置与disk中心点位置比对，获取旋转角度
        computeDegree(e) {
            //调整整个level的degree(渐变方向)
            let centerNode = document.querySelector("#degree-line");
            if (!centerNode) {
                console.error("未找到旋转中心点");
                return;
            }
            let bounding = centerNode.getBoundingClientRect();
            //transform是 ： level.degree - 90
            let string = this.isBackgroundColor ? "backgroundImage" : "level";
            let remain = (this[string].degree - 90) % 360;
            remain < 0 && (remain += 360);
            let center = {
                x: bounding.left,
                y: bounding.top,
            };
            if (remain >= 270) {
                center.y = bounding.top + bounding.height;
            } else if (remain >= 180) {
                center.x = bounding.left + bounding.width;
                center.y = bounding.top + bounding.height;
            } else if (remain >= 90) {
                center.x = bounding.left + bounding.width;
            }

            let newPoint = {
                x: e.clientX,
                y: e.clientY,
            };
            //result是对的，但是需要处理成0-360；
            let result = getAngle(center, newPoint) + 180;

            result = result % 360;
            result <= 0 && (result += 359);
            //原本是以向下为0，改成以向右为0
            if (this.isBackgroundColor) {
                Object.assign(this.backgroundImage, {
                    degree: parseInt(result),
                });
            }
            this.$emit("linearInput", { level: { degree: parseInt(result) } });
        },
        removeListener() {
            document.removeEventListener("mousemove", this.dealMouseMove);
            document.removeEventListener("mouseup", this.dealMouseUp);
        },
        getLinear(colorPercent, degree = 90) {
            return `linear-gradient(${degree}deg, ${colorPercent
                .map((data) => `${data.color} ${data.percent * 100 + "%"}`)
                .join(",")})`;
        },
        setCurrentLinear(linear) {
            if (this.isBackgroundColor) {
                Object.assign(this.backgroundImage, linear);
            }
            this.$emit("linearInput", { level: linear });
        },
        handleDegree(type) {
            let value = this.isBackgroundColor
                ? this.backgroundImage.degree
                : this.level.degree;
            if (type === "plus") {
                value++;
            } else {
                value--;
            }
            if (value > 360) value = value % 360;
            if (value < 0) value = 360 + value;
            if (this.isBackgroundColor) {
                Object.assign(this.backgroundImage, { degree: value });
            } else {
                this.level.degree = value;
            }

            this.$emit("linearInput", { level: { degree: value } });
        },
        dealDegreeInput(e) {
            let value = parseInt(e.target.value);
            if (Number.isNaN(value)) value = 0;
            if (value > 360) value = value % 360;
            if (value < -360) value = value % -360;

            if (this.isBackgroundColor) {
                Object.assign(this.backgroundImage, { degree: value });
            }
            this.$emit("linearInput", { level: { degree: value } });
        },
    },
    computed: {
        pickerStyle: function () {
            return {
                left: this.left,
                top: this.top,
            };
        },
        isLinear() {
            return this.isBackgroundColor
                ? this.backgroundImage && this.backgroundImage.colorPercent
                : this.level && this.level.colorPercent;
        },
        linearStyle() {
            let style = {};
            let string = this.isBackgroundColor ? "backgroundImage" : "level";
            try {
                style["background-image"] = `linear-gradient(90deg, ${this[
                    string
                ].colorPercent
                    .map((data) => `${data.color} ${data.percent * 100 + "%"}`)
                    .join(",")})`;
            } catch (e) {
                console.error("捕获到当前渐变文本内容缺失：", this[string]);
            }
            return style;
        },
    },
};
</script>

<style rel="stylesheet/scss" lang="scss">
@mixin flex-center {
    display: flex;
    align-items: center;
    justify-items: center;
}
@mixin transparent-back {
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
.component-color-picker {
    position: absolute;
    z-index: 999;
    font-size: 14px;
    color: #333;
    border-radius: 2px;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.3);
    background-color: #fff;
    width: 240px;
    .vc-chrome {
        border-radius: 0;
        box-shadow: unset;
        margin-left: auto;
        margin-right: auto;
        margin-top: 5px;
        width: 220px;
    }
    .title-box {
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #e5e5e5;
    }
    .title-change {
        width: 220px;
        height: 36px;
        background: #eff2f7;
        border-radius: 4px;
        display: flex;
        .title-item {
            width: 110px;
            height: 36px;
            background: #eff2f7;
            border-radius: 4px;
            cursor: pointer;
            line-height: 36px;
            color: #666;
            text-align: center;
            &.active {
                color: #fff;
                background: #007eff;
            }
        }
    }
    .title {
        padding: 3px 12px;
        border-bottom: 1px solid #e5e5e5;
    }
    .linear-row {
        display: flex;
        padding: 20px 12px;
        border-bottom: 1px solid #e5e5e5;
        .linear-operate {
            width: 180px;
            height: 24px;
            border-radius: 4px;
            border: 1px solid #e0e5ea;
            position: relative;
            &::before {
                @include transparent-back;
            }
            .scroll-wrapper {
                cursor: pointer;
                position: relative;
                margin: 0 16px 0 4px;
                height: 100%;
            }
            .operate-item {
                width: 12px;
                height: 18px;
                border-radius: 2px;
                padding: 2px;
                position: absolute;
                border: 2px solid #fff;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.6);
                &.selected {
                    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.6),
                        inset 0 0 0 1px rgba(0, 0, 0, 0.5);
                }
            }
        }
        .fast-linear {
            width: 30px;
            height: 26px;
            border: 1px solid #e0e5ea;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 6px;
            background-color: #fff;
            position: relative;
            &:hover {
                border-color: #bec3c9;
            }
            &::after {
                content: "";
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border-width: 5px 4px 0;
                border-color: #444950 transparent transparent;
                border-style: solid;
                display: block;
            }
        }
    }
    .inner-picker-wrap {
        position: relative;
        .linear-fast-wrap {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 300px;
            display: flex;
            flex-wrap: wrap;
            background-color: #fff;
            z-index: 1000;
            .fast-item {
                display: block;
                width: 54px;
                height: 50px;
                margin-left: 4px;
                margin-top: 4px;
                background-color: rgb(255, 255, 255);
                cursor: pointer;
            }
            .fast-item:nth-child(4n - 3) {
            }
            .fast-item:nth-child(-n + 4) {
                margin-top: 0;
            }
        }
    }
    .footer {
        padding: 12px 10px;
        display: flex;
        align-items: center;
        border-top: 1px solid #e5e5e5;
        display: flex;
        justify-content: space-between;
        .degree-shown {
            border: 1px solid #e8e8e8;
            width: 76px;
            height: 36px;
            border-radius: 4px;
            position: relative;
            .degree-input {
                width: 52px;
                border-radius: 4px;
                border: 0;
                outline: 0;
                text-align: left;
                padding-left: 10px;
                color: #333;
                &:focus {
                    border: 0;
                }
            }
            .right-adjust {
                position: absolute;
                top: 0;
                right: 0;
                width: 24px;
                height: 36px;
                box-sizing: border-box;
                border-radius: 0 4px 4px 0;
                border-left: 1px solid #e8e8e8;
                display: flex;
                flex-direction: column;
                span {
                    width: 100%;
                    height: 50%;
                    box-sizing: border-box;
                    cursor: pointer;
                    position: relative;
                    user-select: none;

                    &::after {
                        content: "";
                        width: 6px;
                        height: 6px;
                        border-top: 1px solid #a9a9a9;
                        border-left: 1px solid #a9a9a9;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -90%) rotate(225deg);
                    }
                }
                span:nth-child(1) {
                    border-bottom: 1px solid #e8e8e8;
                    &::after {
                        transform: translate(-50%, -10%) rotate(45deg);
                    }
                }
            }
        }
        .degree-disk {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background-color: #e2e2e2;
            position: relative;
            flex-shrink: 0;
            margin-left: 20px;
            cursor: pointer;
            .degree-line {
                position: absolute;
                left: 50%;
                top: 50%;
                height: 1px;
                background-color: transparent;
                width: 50%;
                transform-origin: left top;
                &::before {
                    position: absolute;
                    top: -5px;
                    right: 0;
                    content: "";
                    width: 10px;
                    height: 10px;
                    background: #33383e;
                    border-radius: 50%;
                }
            }
        }
    }
}

.component-color-picker .vc-input__label {
    display: none !important;
}

.component-color-picker .vc-chrome-fields .vc-input__input {
    border: 1px solid #e0e5ea !important;
    border-radius: 4px !important;
    margin-right: 5px !important;
    width: 68px !important;
    font-size: 12px !important;
    height: 25px !important;
    box-shadow: unset;
}

.component-color-picker .vc-chrome-toggle-btn {
    display: none;
}

.component-color-picker .fast-color-pick {
    display: flex;
    width: 140px;
    justify-content: space-between;
    position: absolute;
    bottom: 18px;
    right: 10px;
}

.component-color-picker .vc-chrome-fields-wrap {
    cursor: auto !important;
}

.component-color-picker .fast-color-pick .color-block {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
    border: 0.5px solid #d3d8dd;
}

.component-color-picker .vc-chrome-body {
    padding: 16px 0px 12px;
}
</style>
