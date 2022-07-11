<script setup lang="ts">
// import { Top, Left, Right, Main } from "@/components/layouts"; 报错
import { Top, Left, Right, Main } from "../layouts";
// import { useStore } from "@/store/store";
// import { storeToRefs } from "pinia";
// import { defineComponent } from "vue";

// const store = useStore();
// const { curEl, mainBg, count } = storeToRefs(store);
</script>

<template>
    <div class="flex flex-col justify-between h-full">
        <div class="flex-grow-0">
            <Top></Top>
        </div>
        <div class="flex justify-between flex-grow">
            <Left class=""></Left>

            <Main class=""></Main>
            <Right class=""></Right>
        </div>
        <div class="bg-[#f7faf7] p2 flex-grow-0 text-center text-sm color-#555">
            luozha © 2022
        </div>
    </div>
</template>

<style></style>
