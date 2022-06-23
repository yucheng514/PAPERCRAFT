<script setup lang="ts">
import { Top, Left, Right, Main } from "./components/layouts";
// import { useStore } from "@/store/store";
// import { storeToRefs } from "pinia";
// import { defineComponent } from "vue";
import { NButton } from "naive-ui";

// const store = useStore();
// const { curEl, mainBg, count } = storeToRefs(store);
</script>

<template>
    <!-- <n-button>naive-ui</n-button> -->
    <div class="flex flex-col justify-between h-full">
        <div class="flex-grow-0">
            <Top></Top>
        </div>
        <div class="ml2 mr2 flex justify-between flex-grow">
            <Left class=""></Left>

            <Main class=""></Main>
            <Right class=""></Right>
        </div>
        <div class="m2 flex-grow-0 text-center text-sm color-#555">
            luozha © 2022
        </div>
    </div>
</template>

<style>
html,
body,
#app {
    margin: 0;
    height: 100%;
}

* {
    box-sizing: border-box;
}
</style>
