let defaultColor = "#fff";
let defaultImage =
    "linear-gradient(to top right, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(to top right, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)";

import { defineStore } from "pinia";

export const useStore = defineStore("main", {
    state: () => {
        return {
            viewerSize: 1,
            mainBg: {
                backgroundColor: defaultColor,
                backgroundImage: defaultImage,
                opacity: 1,
            },
            currentElement: null,
            count: 0,
            mouseDownEvent: null,
        };
    },
    actions: {
        setViewerSize(num: number) {
            this.viewerSize = num;
        },
        setCurrentElement(val: any) {
            this.currentElement = val;
        },
        clearCurrentElement(){
            this.currentElement = null;
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
