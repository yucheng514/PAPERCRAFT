declare interface TextInter extends ElementInter {
    type: "TEXT";
    content: string;
    fontSize: number;
    fontFamily: string;
    lineHeight: number;
    letterSpacing: number;
    verticalAlign: string;
    textAlign: string;
    fontWeight: string;
    fontStyle: string;
    color: string;
    textDecoration: string;
    textOrder: string;
    virtualKey: string;
}

declare interface ImageInter extends ElementInter {
    type: "IMAGE";
    // locked: false,
    zIndex: number;
    rotateX: boolean;
    rotateY: boolean;
    src: "https://cdn.cxb123.com/imgextra1/a6/dLto81ew.png";
    originHeight: number;
    originWidth: number;
    // relative: { left: 0, top: 0, scaleHeight: 1, scaleWidth: 1 },
}

declare interface ElementInter {
    type: string,
    width: number;
    height: number;
    left: number;
    top: number;
    transform: number;
    opacity: number;
    virtualKey: string;
}
