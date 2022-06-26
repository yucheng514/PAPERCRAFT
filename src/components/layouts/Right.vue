<template>
    <div class="bg-white w400px h-full flex-grow-0 p15px">
        工具栏
        <div id="text-tool" v-if="currentElementKey">
            <el-input
                v-model="currentElement.content"
                size="large"
                placeholder="Please input"
            />
            <div>
                行间距
                <el-slider
                    v-model="currentElement.lineHeight"
                    size="small"
                    :min="0"
                    :max="50"
                />
            </div>
            <div>
                字间距
                <el-slider
                    v-model="currentElement.letterSpacing"
                    size="small"
                    :min="-50"
                    :max="50"
                />
            </div>
            <div>
                透明度
                <el-slider v-model="opacity" size="small" />
            </div>
            <div>
                角度
                <el-slider
                    v-model="currentElement.transform"
                    size="small"
                    :min="0"
                    :max="360"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useStore } from "@/store/store";
import { storeToRefs } from "pinia";
import { ElSlider, ElInput } from "element-plus";
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

const currentElement = computed(() => {
    let curEl = {} as TextInter;
    allData.value.some((el) => {
        if (el.virtualKey === currentElementKey.value) {
            curEl = el;
            return true;
        } else return false;
    });
    return curEl;
});

const opacity = computed({
    get() {
        return currentElement.value.opacity * 100;
    },
    set(val) {
        currentElement.value.opacity = val / 100;
    },
});
</script>
<style>
    #text-tool > div{
        padding-top:10px ;
    }
</style>
