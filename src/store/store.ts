import { defineStore, createPinia } from "pinia";
import { allData } from "@/assets/mock";
// import { mergeObject } from "@/assets/util";
const pinia = createPinia();
export const useStore = defineStore("main", {
    state: () => {
        return {
            viewerSize: 1,
            currentElementKey: "",
            count: 0,
            mouseDownEvent: null,
            allData,
        };
    },
    actions: {
        setViewerSize(num: number) {
            this.viewerSize = num;
        },
        setCurrentElementKey(val: any) {
            this.currentElementKey = val;
        },
        // setElement(val: any) {
        //     let ele = this.allData.find(item => item.virtualKey === this.currentElementKey)
        //     // mergeObject(ele, val)
        // },
        clearCurrentElement() {
            this.currentElementKey = "";
        },
        deleteCurrentElement() {
            this.allData = this.allData.filter(
                (el) => el.virtualKey !== this.currentElementKey
            );
        },
        setMouseDownEvent(val: any) {
            this.mouseDownEvent = val;
        },
        clearMouseDownEvent() {
            this.mouseDownEvent = null;
        },
        // setMouseDownEventCallback(val:any){
        //     if(this.mouseDownEvent){
        //         this.mouseDownEvent.callback(e)
        //     }
        // }
        addText(val: TextInter) {
            this.currentElementKey = val.virtualKey;
            this.allData.push(val);
        },
        addImage(val: ImageInter) {
            this.currentElementKey = val.virtualKey;
            this.allData.push(val);
        },
    },
});

export default pinia;
