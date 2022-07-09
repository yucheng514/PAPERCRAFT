<template>
    <div class="bg-[#f7faf7] flex-grow-0 w400px h-full p15px">
        <div>
            添加文字元素：
            <!-- <div id="text-button" class="text-30px font-bold" @click="createText(1)">大标题</div>
        <div id="text-button" class="text-24px font-medium" @click="createText(2)">副标题</div> -->
            <div id="text-button" class="text-18px" @click="createText(3)">
                正文
            </div>
        </div>

        <div class="mt10px">
            添加图片元素：
            <div id="text-button" class="text-18px" @click="openImageUpload">
                上传图片
            </div>
            <el-dialog
                v-model="show.imageUpload"
                :show-close="false"
                title="上传图片"
                :close-on-press-escape="false"
                :close-on-click-modal="false"
            >
                <!-- 暂时不做上传，只做输入 url -->
                <!-- <el-upload
                    class="upload-demo"
                    drag
                    :limit="1"
                    accept="image/*"
                    :show-file-list="true"
                    :onChange="aa"
                >
                    <div class="el-upload__text">
                        Drop a picture here or <em>click to upload</em>
                    </div>
                    <template #tip>
                        <div class="el-upload__tip">
                            jpg/png files with a size less than 500kb
                        </div>
                    </template>
                </el-upload> -->

                <!-- autofocus 会失效，暂不知道是否 element 的原因 -->
                <el-input
                    v-model="imageUploadUrl"
                    clearable
                    placeholder="Please input"
                    ref="imageUploadInput"
                >
                    <!-- <template #prepend>Https://</template> -->
                </el-input>
                <template #footer>
                    <el-button @click="imageUploadConfirm">确定</el-button>
                    <el-button @click="imageUploadClose">关闭</el-button>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { genarateKey, getImgRawSize } from "@/assets/util";
import { useStore } from "@/store/store";
import { storeToRefs } from "pinia";
import currentElement from "@/components/computed/currentElement";
import { ElUpload, ElDialog, ElButton, ElInput } from "element-plus";
// import type { UploadProps, UploadUserFile } from "element-plus";
const store = useStore();
const { currentElementKey, allData } = storeToRefs(store);
const { addText, addImage } = store;
const show = reactive({ imageUpload: false });
// const fileList = ref<UploadUserFile[]>([]);

// let imageUploadUrl = ref("");
let imageUploadUrl = ref(
    "https://avatars.githubusercontent.com/u/35727398?v=3"
);
// const imageUploadInput = ref({});

function openImageUpload() {
    show.imageUpload = true;
    // nextTick(() => {
    //     console.log(imageUploadInput.value);
    //     (imageUploadInput.value as HTMLInputElement).focus();
    // });
}
function imageUploadConfirm() {
    const url = imageUploadUrl.value;
    if (url) {
        // let {tmpWidth,tmpHeight} = await getImgRawSize(url);
        getImgRawSize(url).then((value) => {
            let { width, height } = value as { width: number; height: number };
            let image: ImageInter = {
                type: "IMAGE",
                isBackground: false,
                width: width || 100,
                height: height || 100,
                left: 1,
                top: 1,
                // zIndex: 55,
                opacity: 1,
                transform: 0,
                rotateX: false,
                rotateY: false,
                src: url,
                originWidth: width || 100,
                originHeight: height || 100,
                relative: { left: 0, top: 0, scaleHeight: 1, scaleWidth: 1 },
                virtualKey: "",
            };
            image.virtualKey = genarateKey();
            image.top = currentElementKey.value
                ? currentElement.value.top + 20
                : 400 - image.height / 2;
            image.left = currentElementKey.value
                ? currentElement.value.left + 40
                : 400 - image.width / 2;
            addImage(image);
        });
    }

    show.imageUpload = false;
}
function imageUploadClose() {
    show.imageUpload = false;
}
// function aa(uploadFile, uploadFiles) {
//     console.log(uploadFile, uploadFiles);
//     console.log(fileList);
// }
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
