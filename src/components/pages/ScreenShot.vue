<template>
    <!-- http://localhost:3000/screenshot -->
    <ElementRender
        v-for="(el, index) in allData"
        :key="el.virtualKey"
        :element="el"
        :index="index"
    ></ElementRender>
</template>

<script setup lang="ts">
import { ElementRender } from "@/components/render";
import { useStore } from "@/store/store";
import { storeToRefs } from "pinia";
const store = useStore();
const { allData } = storeToRefs(store);
</script>
<style scoped></style>
