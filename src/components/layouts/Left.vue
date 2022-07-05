<template>
    <div class="bg-[#f7faf7] flex-grow-0 w400px h-full p15px">
        添加文字元素：
        <!-- <div id="text-button" class="text-30px font-bold" @click="createText(1)">大标题</div>
        <div id="text-button" class="text-24px font-medium" @click="createText(2)">副标题</div> -->
        <div id="text-button" class="text-18px" @click="createText(3)">
            正文
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { genarateKey } from "@/assets/util";
import { useStore } from "@/store/store";
import { storeToRefs } from "pinia";
import currentElement from "./computed/currentElement";
const store = useStore();
const { currentElementKey, allData } = storeToRefs(store);
const { addText } = store;

function createText(type: number) {
    let text: TextInter = {
        content: "输入正文",
        fontSize: 24,
        lineHeight: 1,
        letterSpacing: 0,
        transform: 0,
        type: "TEXT",
        fontFamily: "",
        width: 150,
        height: 50,
        verticalAlign: "",
        textAlign: "",
        fontWeight: "",
        fontStyle: "",
        color: "",
        top: 50,
        left: 50,
        textDecoration: "",
        opacity: 1,
        textOrder: "",
        virtualKey: "",
    };
    text.virtualKey = genarateKey();
    text.top = currentElementKey.value
        ? currentElement.value.top + 20
        : 400 - text.height / 2;
    text.left = currentElementKey.value
        ? currentElement.value.left + 40
        : 400 - text.width / 2;
    addText(text);
}
</script>
<style>
#text-button {
    width: 150px;
    height: 50px;
    border: 1px solid #777;
    border-radius: 2px;
    cursor: pointer;
    text-align: center;
    line-height: 50px;
    margin-top: 15px;
}
</style>
