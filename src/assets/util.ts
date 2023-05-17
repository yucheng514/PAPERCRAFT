// import fonts from "./fonts";

const initialAlign = {
    vertical: "middle", //这里top时输入文字不会位移，否则会(改为middle,否则有更大的问题-主要兼容输入)
    horizontal: "center",
};

export {
    mergeObject,
    genarateKey,
    copy,
    // customMap,
    // initialAlign,
    // isPriceText,
    // isPrice,
    // isComplex,
    // isImage,
    // isCustom,
    // getRelative,
    // dealWithAngle,
    // getFont,
    getZIndex,
    isTextType,
    isImageType,
    // loadFontFamily,
    // fonts,
    // getCustomIds,
    // canCustomAdd,
    // dealCustomAdd,
    // getDocumentFontStatus
    getImgRawSize,
};
function mergeObject(newObj: any, obj: any) {
    //注意，此方法不支持含有函数的对象复制
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (typeof obj[key] === "object" && obj[key] !== null) {
            let defaultObj = obj[key] instanceof Array ? [] : {};
            newObj[key] = newObj[key] || defaultObj;
            mergeObject(newObj[key], obj[key]);
        } else {
            newObj[key] = obj[key];
        }
    }
}
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
    return "" + y + m + Number(d) + h + minute + second;
}
function genarateKey() {
    return formatDateTime() + Math.random().toString(36).substr(2);
}
function copy(object: object) {
    if (!object) return object;
    return JSON.parse(JSON.stringify(object));
}

// function isComplex(type: any) {
//     if (!type) return;
//     return ['complex'].indexOf(type.toLowerCase()) !== -1
// }
function isTextType(type: string) {
    return type === "TEXT";
}
function isImageType(type: string) {
    return type === "IMAGE";
}
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

function getImgRawSize(img: any) {
    return Promise.resolve(
        new Promise(function (reslove, reject) {
            var _image = img;
            if (_image instanceof HTMLImageElement) {
                if (_image.naturalWidth)
                    return reslove({
                        width: _image.naturalWidth,
                        height: _image.naturalHeight,
                    });
                img = img.src;
            }
            if (typeof img == "string") {
                _image = new Image();
                _image.src = img;
            }
            _image.onload = (_: any) =>
                reslove({
                    width: _image.naturalWidth || _image.width,
                    height: _image.naturalHeight || _image.height,
                });
            _image.onerror = (_: any) => reject({ width: 0, height: 0 });
        })
    );
}
