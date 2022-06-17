import fonts from "./fonts";

const initialAlign = {
    vertical: "middle", //这里top时输入文字不会位移，否则会(改为middle,否则有更大的问题-主要兼容输入)
    horizontal: "center",
};

export {
    formatDateTime,
    copy,
    // customMap,
    // initialAlign,
    // isText,
    // isPriceText,
    // isPrice,
    // isComplex,
    // isImage,
    // isCustom,
    // getRelative,
    // dealWithAngle,
    getFont,
    // getClipSvgStyle,
    getZIndex,
    // loadFontFamily,
    // fonts,
    // getCustomIds,
    // canCustomAdd,
    // dealCustomAdd,
    // getDocumentFontStatus
};
function formatDateTime() {
    let date = new Date();
    let y = date.getFullYear();
    let m: number | string = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    let d: number | string = date.getDate();
    d = d < 10 ? "0" + d : d;
    let h = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    return y + Number(m) + Number(d) + h + minute + second;
}
function copy(object: object) {
    if (!object) return object;
    return JSON.parse(JSON.stringify(object));
}

// function isComplex(type: any) {
//     if (!type) return;
//     return ['complex'].indexOf(type.toLowerCase()) !== -1
// }
// function isText(type: any) {
//     if (!type) return;
//     return ['text', 'customtext', 'color_tag'].indexOf(type.toLowerCase()) !== -1
// }

// function isPriceText(type: any) {
//     if (!type) return;
//     return ['text', 'autoprice', 'price', 'customprice', 'customtext', 'color_tag', 'daily_price', 'promo_price'].indexOf(type.toLowerCase()) !== -1
// }

// function isPrice(type: any) {
//     if (!type) return;
//     return ['autoprice', 'price', 'customprice', 'daily_price', 'promo_price'].indexOf(type.toLowerCase()) !== -1
// }

// function isImage(type: any) {
//     if (!type) return;
//     return ['image', 'svg'].indexOf(type.toLowerCase()) !== -1
// }

// //渲染的zIndex用基础值 50 加上元素的排序号
function getZIndex(index: number): number {
    return 50 + index;
}

// function getRelative(imageEditBoxObject: any, imageEditImageObject: any) {
//     //从盒子对象、图片对象中获取图片相对盒子的定位
//     let { left: boxLeft, top: boxTop, width: boxWidth, height: boxHeight } = imageEditBoxObject
//     let { left: imageAbsoluteLeft, top: imageAbsoluteTop, width: imageWidth, height: imageHeight } = imageEditImageObject
//     let a = imageEditBoxObject.transform / 180 * Math.PI;
//     let middleAbsoluteTop = imageAbsoluteTop + imageHeight / 2 - (boxTop + boxHeight / 2);
//     let middleAbsoluteLeft = imageAbsoluteLeft + imageWidth / 2 - (boxLeft + boxWidth / 2);
//     let middleRelativeTop = middleAbsoluteTop * Math.cos(a) - middleAbsoluteLeft * Math.sin(a);
//     let middleRelativeLeft = middleAbsoluteTop * Math.sin(a) + middleAbsoluteLeft * Math.cos(a);
//     let imageRelativeLeft = middleRelativeLeft - (imageWidth / 2 - boxWidth / 2)
//     let imageRelativeTop = middleRelativeTop - (imageHeight / 2 - boxHeight / 2)
//     return {
//         left: imageRelativeLeft / boxWidth,
//         top: imageRelativeTop / boxHeight
//     }
// }

// function dealWithAngle(angle: number) {
//     let integralNum = angle > 0 ? Math.floor(angle / 360) : Math.ceil(angle / 360)
//     return angle - integralNum * 360
// }
function getFont(fontName: string) {
    let font = copy(fonts[fontName]);
    if (font) {
        font.name = fontName;
    } else {
        font = fonts["Source Han Sans CN Regular"];
        font.name = "Source Han Sans CN Regular";
    }
    return font;
}

// function getClipSvgStyle(box, child) {
//     //正常的svg盒子
//     let result = {};
//     if (child) {
//         let relative = getRelative(box, child)
//         result = {
//             path: box.path,
//             src: box.src,
//             x: relative.left * 100,
//             y: relative.top * 100,
//             width: child.width / box.width * 100,
//             height: child.height / box.height * 100
//         }
//     } else {
//         result = {
//             path: box.path,
//             src: box.src,
//             x: box.relative.left * 100,
//             y: box.relative.top * 100,
//             width: box.originWidth * box.relative.scaleWidth / box.width * 100,
//             height: box.originHeight * box.relative.scaleHeight / box.height * 100
//         }
//     }
//     return result
// }

// //如果外部没传 fontStatus，那就内部自己记录
// let innerFontStatus = {};
// //备注：字体加载情况需要与store同步，所以
// function loadFontFamily(fontRealName, allFontStatus = innerFontStatus) {
//     return new Promise((resolve, reject) => {
//         //这里只负责加载，不负责赋值
//         if (!fontRealName) fontRealName = 'Alibaba PuHuiTi R'
//         if (!fonts[fontRealName]) {
//             reject(`字体库查询字体${fontRealName}失败，请联系管理员`)
//             return;
//         }
//         let fontStatus = allFontStatus[fontRealName]
//         if (fontStatus === 'loaded') {
//             // console.log(`字体${fontRealName}已加载过`)
//             resolve()
//             return;
//         }
//         let style = document.createElement('style');
//         let head = document.head || document.getElementsByTagName('head')[0];
//         style.type = 'text/css';
//         let textNode = document.createTextNode(`@font-face {font-family:${fontRealName};src:url(${fonts[fontRealName].src});}`);
//         style.appendChild(textNode);
//         head.appendChild(style);

//         //创建虚拟dom引用字体，帮助字体加载；
//         let text = document.createElement('p');
//         text.appendChild(document.createTextNode('test'))
//         text.style.fontFamily = fontRealName;
//         text.style.visibility = 'hidden';
//         document.body.appendChild(text);
//         //先更新一遍状态，应该会更新到loading
//         setTimeout(() => {
//             let documentFontStatus = getDocumentFontStatus(fontRealName, allFontStatus);
//             // store.commit('setFontStatus', {fontFamily: fontRealName, status: documentFontStatus});
//             allFontStatus[fontRealName] = documentFontStatus
//         }, 0)
//         document.fonts.ready.then(() => {
//             let interval = setInterval(() => {
//                 let documentFontStatus = getDocumentFontStatus(fontRealName, allFontStatus);
//                 //无论成功失败、更新vuex字体状态
//                 // store.commit('setFontStatus', {fontFamily: fontRealName, status: documentFontStatus});
//                 allFontStatus[fontRealName] = documentFontStatus
//                 //未加载、加载中，不做后续操作
//                 if (['unloaded', 'loading'].indexOf(documentFontStatus) !== -1) return;

//                 //加载完了，分为成功、失败处理
//                 clearInterval(interval);
//                 document.body.removeChild(text);
//                 if (documentFontStatus === 'loaded') {
//                     // console.info(`加载${fontRealName}成功了`)
//                     resolve();
//                 } else {
//                     //todo 失败时的全局提示
//                     console.error(`加载${fontRealName}失败了`);
//                     reject(`加载字体${fontRealName}失败`);
//                 }
//             }, 300)
//         })
//     })
// }
// function getDocumentFontStatus(fontRealName, allFontStatus = innerFontStatus) {
//     let status = ''
//     for (let font of document.fonts) {
//         if (font.family === fontRealName) {
//             status = font.status
//             allFontStatus[fontRealName] = status
//             // store.commit('setFontStatus', {fontFamily: fontRealName, status})
//         }
//     }
//     return status || 'unloaded'
// }
