// 模拟一个请求回来的 allData
const imageData: ImageInter = {
    type: "IMAGE",
    isBackground: false,
    width: 460,
    height: 220,
    left: 0,
    top: 0,
    zIndex: 55,
    opacity: 1,
    transform: 0,
    rotateX: false,
    rotateY: false,
    src: "https://user-images.githubusercontent.com/499550/176823239-f59d75de-1d24-4b2d-b04b-fcc95db2903e.png",
    originWidth: 460,
    originHeight: 220,
    // relative: { left: 0, top: 0, scaleHeight: 1, scaleWidth: 1 },
    virtualKey: "20220706215255mtfq48lo0f",
};

const allData: (TextInter | ImageInter)[] = [
    {
        type: "TEXT",
        content: "Text Element",
        fontSize: 68.58,
        fontFamily: "Alibaba PuHuiTi B",
        lineHeight: 2.38889,
        letterSpacing: 3.81,
        transform: 36,
        width: 500,
        height: 164,
        verticalAlign: "middle",
        textAlign: "center",
        fontWeight: "",
        fontStyle: "italic",
        color: "rgba(255,0,0,1)",
        top: 432.6587301587302,
        left: 0,
        textDecoration: "line-through",
        opacity: 0.78,
        textOrder: "horizontal",
        virtualKey: "20220614175750z7hyzapggn",
    },
    {
        type: "TEXT",
        content: "多行\n文字元素",
        fontSize: 68.58,
        fontFamily: "Alibaba PuHuiTi B",
        lineHeight: 2,
        letterSpacing: 4.81,
        transform: 0,
        width: 310,
        height: 310,
        verticalAlign: "middle",
        textAlign: "center",
        fontWeight: "",
        fontStyle: "italic",
        color: "rgba(255,0,0,1)",
        top: 180,
        left: 465,
        textDecoration: "line-through",
        opacity: 0.78,
        textOrder: "horizontal",
        virtualKey: "20220614175751z7hyzapggn",
    },
    imageData,
];

export { allData };
