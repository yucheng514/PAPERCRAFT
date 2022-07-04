import { computed } from "vue";
import { storeToRefs } from "pinia";
import pinia, { useStore } from "@/store/store";
const store = useStore(pinia);
const { currentElementKey, allData } = storeToRefs(store);
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

export default currentElement;
