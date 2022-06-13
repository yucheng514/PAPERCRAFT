let defaultColor = '#fff';
let defaultImage = 'linear-gradient(to top right, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(to top right, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)'

import { defineStore } from 'pinia'




export const useStore = defineStore('main', {
    state: () => {
        return {
            mainBg: {
                backgroundColor: defaultColor,
                backgroundImage: defaultImage,
                opacity: 1,
            },
            curEl: {
                lineHeight: 1,
                letterSpacing: 0,
                zIndex: 50,
                digit: {
                    integral: {
                        place: 3,
                        size: 24
                    },
                    decimal: {
                        place: 2,
                        size: 24
                    }
                }
            },
            count: 0
        }
    },
    actions: {
        inc(){this.count++}
    }
})