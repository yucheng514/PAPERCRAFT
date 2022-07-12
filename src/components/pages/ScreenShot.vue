<template>
    <!-- http://127.0.0.1:3000/screenshot -->
    <ElementRender
        v-for="(el, index) in data"
        :key="el.virtualKey"
        :element="el"
        :index="index"
    ></ElementRender>
</template>

<script setup lang="ts">
import { ElementRender } from "@/components/render";
import { useStore } from "@/store/store";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const store = useStore();
const { allData } = storeToRefs(store);
let data = ref(allData.value);
let localData = localStorage.getItem("screenshot");
if (localData) {
    data.value = JSON.parse(localData);
}
</script>
<style scoped></style>
