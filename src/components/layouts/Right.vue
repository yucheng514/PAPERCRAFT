<template>
    <div class="bg-[#f7faf7] w400px h-full flex-grow-0 p15px overflow-hidden">
        工具栏
        <div id="text-tool" v-if="currentElementKey">
            <section v-if="isText">
                <el-input
                    v-model="(currentElement as TextInter).content"
                    size="large"
                    placeholder="Please input"
                />
                <div>
                    行间距
                    <el-slider
                        v-model="(currentElement as TextInter).lineHeight"
                        size="small"
                        :min="0"
                        :max="50"
                    />
                </div>
                <div>
                    字间距
                    <el-slider
                        v-model="(currentElement as TextInter).letterSpacing"
                        size="small"
                        :min="-50"
                        :max="50"
                    />
                </div>
            </section>
            <section v-if="isText || (isImage && !isBackground)">
                <div>
                    透明度:{{ opacity.toFixed(0) }}%
                    <el-slider
                        v-model="opacity"
                        size="small"
                        :show-tooltip="false"
                    />
                </div>
                <div>
                    角度:{{ currentElement.transform }}°
                    <el-slider
                        v-model="currentElement.transform"
                        size="small"
                        :min="0"
                        :max="360"
                        :show-tooltip="false"
                    />
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useStore } from "@/store/store";
import { storeToRefs } from "pinia";
import { ElSlider, ElInput } from "element-plus";
import currentElement from "@/components/computed/currentElement";
import { isText, isImage, isBackground } from "@/components/computed/tools";
const store = useStore();
const { viewerSize, currentElementKey, mouseDownEvent, allData } =
    storeToRefs(store);
const {
    setViewerSize,
    setCurrentElementKey,
    setMouseDownEvent,
    clearMouseDownEvent,
    clearCurrentElement,
    // setElement,
} = store;

const opacity = computed<number>({
    get() {
        return currentElement.value.opacity * 100;
    },
    set(val: number) {
        currentElement.value.opacity = val / 100;
    },
});
</script>
<style>
#text-tool > div {
    padding-top: 10px;
}
</style>
