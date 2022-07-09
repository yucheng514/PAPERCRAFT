declare interface ElementInter {
    type: string;
    width: number;
    height: number;
    left: number;
    top: number;
    transform: number;
    opacity: number;
    virtualKey: string;
}

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
}

declare interface ImageInter extends ElementInter {
    type: "IMAGE";
    // locked: false,
    isBackground: boolean;
    background?: string;
    backgroundImage?: string;
    zIndex?: number;
    rotateX: boolean;
    rotateY: boolean;
    src: string;
    originHeight: number;
    originWidth: number;
    relative: { left: 0; top: 0; scaleHeight: 1; scaleWidth: 1 };
}
