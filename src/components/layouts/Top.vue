<template>
    <div
        id="TopBar"
        class="h50px flex justify-between bg-[#f7faf7] p10px items-center"
    >
        <div>PAPERCRAFT</div>
        <!-- <el-link href="https://github.com/daluozha/PAPERCRAFT" target="_blank"
            >github</el-link
        > -->

        <!-- <div>
            <el-button @click="open"> 截图预览 </el-button>
            <el-button class="ml5px!" @click="save">Yuubee 截图</el-button>
            <el-link class="ml5px" href="https://github.com/daluozha/Yuubee"
                >Yuubee 是什么？</el-link
            >
        </div> -->

        <a
            href="https://github.com/daluozha/PAPERCRAFT"
            target="_blank"
            title="GitHub"
        >
            <div class="i-uil-github-alt color-#828891 text-6"></div>
        </a>


        <!-- <div>撤销，重做</div> -->
        <!-- <div>保存</div> -->
    </div>
</template>

<script setup lang="ts">
import { ElLink, ElButton } from "element-plus";
import axios from "axios";
import { useStore } from "@/store/store";
import { storeToRefs } from "pinia";
const store = useStore();
const { allData } = storeToRefs(store);
const url = "http://127.0.0.1:8800/screen-shot";
function open() {
    localStorage.setItem("screenshot", JSON.stringify(allData.value));
    window.open("http://127.0.0.1:3000/screenshot",'_blank')
}
function save() {
    localStorage.setItem("screenshot", JSON.stringify(allData.value));
    axios.defaults.headers.post["Content-Type"] =
        "application/x-www-form-urlencoded";

    axios
        .post(url, {
            viewport: {
                width: 800,
                height: 800,
            },
            screenshot: {
                selector: "body",
                type: "png",
                quality: 100,
                urlTimeout: 10000,
                maxPage: 10,
            },
            browserTimeout: 0,
            userAgent:
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
            url: "http://127.0.0.1:3000/screenshot",
            resultType: "URL",
        })
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.warn(err);
        });
}
</script>
<style>
/* #TopBar > a {
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    transition: opacity 0.2s ease;
    opacity: 0.6;
    outline: none;
} */
</style>
