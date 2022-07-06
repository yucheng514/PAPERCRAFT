import { computed } from "vue";
import { storeToRefs } from "pinia";
import pinia, { useStore } from "@/store/store";
const store = useStore(pinia);
const { currentElementKey, allData } = storeToRefs(store);
import { isText, isImage } from "@/assets/util";
const currentElement = computed(() => {
    let curEl = {} as ElementInter;
    allData.value.some((el) => {
        if (el.virtualKey === currentElementKey.value) {
            // if(isText(el.type)){
            //     curEl as TextInter
            // }else if(isImage(el.type)){
            //     curEl as ImageInter
            // }
            curEl = el;
            return true;
        } else return false;
    });
    return curEl;
});

export default currentElement;
