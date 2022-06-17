let defaultColor = "#fff";
let defaultImage =
    "linear-gradient(to top right, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(to top right, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)";

import { defineStore } from "pinia";
import { allData } from "@/assets/mock";
// import { mergeObject } from "@/assets/util";

export const useStore = defineStore("main", {
    state: () => {
        return {
            viewerSize: 1,
            mainBg: {
                backgroundColor: defaultColor,
                backgroundImage: defaultImage,
                opacity: 1,
            },
            currentElementKey: null,
            count: 0,
            mouseDownEvent: null,
            allData
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
        clearCurrentElement(){
            this.currentElementKey = null;
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
    },
});
