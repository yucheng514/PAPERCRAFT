const dots = ["lt", "mt", "rt", "lm", "rm", "lb", "mb", "rb"];
const dotStyle = {
    lt: {
        cursor: "nw-resize",
        top: "-5px",
        left: "-5px",
    },
    mt: {
        cursor: "n-resize",
        top: "-5px",
        left: "calc(50% - 5px)",
    },
    rt: {
        cursor: "ne-resize",
        right: "-5px",
        top: "-5px",
    },
    lm: {
        cursor: "w-resize",
        left: "-5px",
        top: "calc(50% - 5px)",
    },
    rm: {
        top: "calc(50% - 5px)",
        cursor: "e-resize",
        right: "-5px",
    },
    lb: {
        cursor: "sw-resize",
        bottom: "-5px",
        left: "-5px",
    },
    mb: {
        cursor: "s-resize",
        bottom: "-5px",
        left: "calc(50% - 5px)",
    },
    rb: {
        cursor: "se-resize",
        right: "-5px",
        bottom: "-5px",
    },
};
const cursorObject = {
    lt: "nw-resize",
    mt: "n-resize",
    rt: "ne-resize",
    lm: "w-resize",
    rm: "e-resize",
    lb: "sw-resize",
    mb: "s-resize",
    rb: "se-resize",
};
function assertCursor(currentSelectObj: any, viewerSize: any, flag: any) {
    let currentElement = currentSelectObj;
    if (!currentElement) return;
    //获取中点和当前点坐标
    let center = {
        x: currentElement.left + currentElement.width / 2,
        y: currentElement.top + currentElement.height / 2,
    };
    let initialDegree1 =
        (Math.atan(currentElement.height / currentElement.width) * 180) /
        Math.PI;
    let initialDegree2 = 90 - initialDegree1;
    let [initialMin, initialMax] = [
        Math.min(initialDegree1, initialDegree2),
        Math.max(initialDegree1, initialDegree2),
    ];
    let viewer = document.getElementById("drawing");
    let currentDom = document.getElementById(flag);
    if (!viewer || !currentDom) return;
    let viewerBound = viewer.getBoundingClientRect();
    let currentBound = currentDom.getBoundingClientRect();

    let current = {
        x:
            (currentBound.left - viewerBound.left + currentBound.width / 2) /
            viewerSize,
        y:
            (currentBound.top - viewerBound.top + currentBound.height / 2) /
            viewerSize,
    };
    let xOffset = current.x - center.x;
    let yOffset = current.y - center.y;
    let cursor = "";
    let k = (-current.y + center.y) / (current.x - center.x);
    let degree = Math.abs((Math.atan(k) * 180) / Math.PI);

    if (xOffset > 0) {
        if (degree < initialMin - 3) {
            cursor = "e-resize";
        } else if (degree < initialMax + 3) {
            cursor = yOffset > 0 ? "se-resize" : "ne-resize";
        } else {
            cursor = yOffset > 0 ? "s-resize" : "n-resize";
        }
    } else if (xOffset < 0) {
        if (degree < initialMin - 3) {
            cursor = "w-resize";
        } else if (degree < initialMax + 3) {
            cursor = yOffset > 0 ? "sw-resize" : "nw-resize";
        } else {
            cursor = yOffset > 0 ? "s-resize" : "n-resize";
        }
    }

    return cursor;
}
export { dots, dotStyle, cursorObject, assertCursor };
