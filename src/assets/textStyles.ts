/*
* 注意2：空对象别删，说明原样渲染
* 注意2：最后保存的数据并不会有src/fontFamily/color
*
* @params: name {String} 某类的唯一标识符，注意，不能重复；
* @params: fontFamily {String} 初始字体，可以随意指定，但是注意与图片相匹配
* @params: src {String} 预览图片，注意与初始字体相匹配
* @params: type {Enum: ["offset","linear"]} 炫彩类型，目前支持偏移类和线性渐变类；
* @params: levels {Array} 炫彩字体时，文字不再以单一文本渲染，而是多层渲染，每个level表示一层
*
* @level 根据type的不同，使用不同的样式渲染
*       type==='offset'时，使用 fill+stroke+offset，进行渲染
*       type==='linear'时，使用 backgroundImage 进行渲染
* */

let textStyles = [
    {
        name: "blackWhiteOffset5",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/blackWhiteOffset5.png",
        color: "rgb(0, 0, 0)",
        type: "offset",
        levels: [
            {
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 11.9412 / 70
            },
            {
                fillColor: "rgb(255, 255, 255)"
            }
        ]
    },
    {
        name: "blueLinear",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/blueLinear.png",
        color: "rgb(0, 0, 0)",
        type: "linear",
        levels: [
            {
                degree: -13,
                colorPercent: [
                    {
                        color: "rgb(50, 86, 255)",
                        percent: 0
                    },
                    {
                        color: "rgb(87, 209, 255)",
                        percent: 1
                    },
                ]
            }
        ]
    },
    {
        name: "goldenLinear",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/goldenLinear.png",
        color: "rgb(0, 0, 0)",
        type: "linear",
        levels: [
            {
                degree: 90,
                colorPercent: [
                    {
                        color: "rgb(255, 246, 217)",
                        percent: 0
                    },
                    {
                        color: "rgb(244, 215, 148)",
                        percent: 0.1860
                    },
                    {
                        color: "rgb(206, 165, 97)",
                        percent: 0.5407
                    },
                    {
                        color: "rgb(240, 218, 164)",
                        percent: 1
                    }
                ]
            }
        ]
    },
    {
        name: "whiteGreenLinear",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/whiteGreenLinear.png",
        color: "rgb(0, 0, 0)",
        type: "linear",
        levels: [
            {
                // strokeColor: "rgb(150,144,144)",
                // strokeWidth: 0.0278,
                fillColor: "rgb(255, 255, 255)",
                left: 0.0555,
                top: 0,
                skewX: -0.1143,
                skewY: 0
            },
            {
                strokeWidth: 0.0278,
                strokeColor: "rgb(0, 0, 0)",
                fillColor: "rgb(255, 255, 255)",
                skewX: -0.1143,
                skewY: 0
            },
            {
                fillColor: "rgb(255, 255, 255)",
                skewX: -0.1143,
                skewY: 0
            },
            {
                skewX: -0.1143,
                skewY: 0,
                degree: 180,
                colorPercent: [
                    {
                        color: "rgb(255, 255, 255)",
                        percent: 0.4128
                    },
                    {
                        color: "rgb(0, 199, 100)",
                        percent: 1
                    },
                ]
            }
        ]
    },
    {
        name: "whiteOrangeLinear",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/whiteOrangeLinear.png",
        color: "rgb(228, 142, 74)",
        type: "linear",
        levels: [
            {
                fillColor: "rgb(228, 142, 74)",
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 0.0397,
                left: 0,
                top: 0.0781
            },
            {
                left: 0,
                top: 0.0781,
                fillColor: "rgb(228, 142, 74)"
            },
            {   //linear-gradient(rgb(255, 255, 255) 50.5814%, rgb(255, 225, 151) 100%)
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 0.0397,
                degree: 180,
                colorPercent: [
                    {
                        color: "rgb(255, 255, 255)",
                        percent: 0.5058
                    },
                    {
                        color: "rgb(255, 225, 151)",
                        percent: 1
                    },
                ]
            },
            { //linear-gradient(rgb(255, 255, 255) 50.5814%, rgb(255, 225, 151) 100%)
                degree: 180,
                colorPercent: [
                    {
                        color: "rgb(255, 255, 255)",
                        percent: 0.5058
                    },
                    {
                        color: "rgb(255, 225, 151)",
                        percent: 1
                    },
                ]
            }
        ]
    },
    {
        name: "greyLinear",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/greyLinear.png",
        color: "rgb(0, 0, 0)",
        type: "linear",
        levels: [ //skew(-9.89011deg, 0deg);
            {
                left: 0.0972,
                top: 0,
                fillColor: "rgb(180, 180, 180)",
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 0.0556,
                skewX: -0.1412,
                skewY: 0
            },
            {   //skew(-9.89011deg, 0deg)
                left: 0.0972,
                top: 0,
                fillColor: "rgb(180, 180, 180)",
                skewX: -0.1412,
                skewY: 0
            },
            {   //linear-gradient(130deg, rgb(255, 255, 255) 16.2791%, rgb(220, 220, 220) 59.3023%, rgb(255, 255, 255) 93.0233%)
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 0.0555,
                skewX: -0.1412,
                skewY: 0,
                degree: 130,
                colorPercent: [
                    {
                        color: "rgb(255, 255, 255)",
                        percent: 0.1628
                    },
                    {
                        color: "rgb(220, 220, 220)",
                        percent: 0.5930
                    },
                    {
                        color: "rgb(255, 255, 255)",
                        percent: 0.9302
                    },
                ]
            },
            { //linear-gradient(130deg, rgb(255, 255, 255) 16.2791%, rgb(220, 220, 220) 59.3023%, rgb(255, 255, 255) 93.0233%)
                skewX: -0.1412,
                skewY: 0,
                degree: 130,
                colorPercent: [
                    {
                        color: "rgb(255, 255, 255)",
                        percent: 0.1628
                    },
                    {
                        color: "rgb(220, 220, 220)",
                        percent: 0.5930
                    },
                    {
                        color: "rgb(255, 255, 255)",
                        percent: 0.9302
                    },
                ]
            }
        ]
    },
    {
        name: "blackWhiteLinear",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/blackWhiteLinear.png",
        color: "rgb(51, 51, 51)",
        type: "linear",
        levels: [ //linear-gradient(rgb(0, 0, 0) 0%, rgb(255, 255, 255) 100%)
            {
                degree: 180,
                colorPercent: [
                    {
                        color: "rgb(0, 0, 0)",
                        percent: 0
                    },
                    {
                        color: "rgb(255, 255, 255)",
                        percent: 1
                    }
                ]
            }
        ]
    },
    {
        name: "whiteBlackOffset",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/whiteBlackOffset.png",
        color: "rgb(0, 0, 0)",
        type: "offset",
        levels: [
            {
                fillColor: "rgb(255, 255, 255)",
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 0.015,
                top: 0.001,
                left: 0.055,
            },
            {
                fillColor: "rgb(0, 0, 0)"
            },
        ],
    },
    {
        name: "blueYellowOffset",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/blueYellowOffset.png",
        color: "rgb(250, 196, 63)",
        type: "offset",
        levels: [
            {
                strokeColor: "rgb(255, 255, 255)",
                strokeWidth: 0.36,
            },
            {
            },
            {
                strokeColor: "rgb(19, 56, 175)",
                strokeWidth: 0.222,
            },
            {
            },
            {
                fillColor: "rgb(250, 196, 63)"
            }
        ],
    },
    {
        name: "greenWhiteOffset",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/greenWhiteOffset.png",
        color: "rgb(255, 255, 255)",
        type: "offset",
        hidden: true,
        levels: [
            {
                fillColor: "rgb(255, 255, 255)",
                strokeColor: "rgb(21, 100, 17)",
                strokeWidth: 0.153,
                top: 0.047,
                left: (-2.01707e-16) / 70,
                textShadow: {
                    color: "rgb(21, 100, 17)",
                    offsetX: (-4.45706e-16) / 70,
                    offsetY: 0.104,
                    blur: 0.143,
                }
            },
            {
                fillColor: "rgb(255, 255, 255)",
                strokeWidth: 0.129,
                strokeColor: "rgb(47, 158, 53)",
            },
            {
                fillColor: "rgb(255, 255, 255)",
                textShadow: {
                    color: "rgb(128, 206, 42)",
                    offsetX: (-1.33712e-16) / 70,
                    offsetY: 0.031,
                    blur: 0
                }
            }
        ],
    },
    {
        name: "yellowBlackOffset",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/yellowBlackOffset.png",
        color: "rgb(0, 0, 0)",
        type: "offset",
        levels: [
            {
                fillColor: "rgb(255, 222, 0)",
                left: 0.059,
                top: 0.059
            },
            {
                fillColor: "rgb(0, 0, 0)",
            },
        ],
    },
    {
        name: "purpleWhiteOffset",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/purpleWhiteOffset.png",
        color: "rgb(255, 73, 164)",
        type: "offset",
        levels: [
            {
                fillColor: "rgb(41, 202, 255)",
                left: 0.036,
                top: 0.043,
            },
            {
                fillColor: "rgb(255, 73, 164)",
                left: -0.039,
                top: -0.039,
            },
            {
                fillColor: "rgb(255, 255, 255)"
            }
        ],
    },
    {
        name: "greenWhiteOffset2",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/greenWhiteOffset2.png",
        color: "rgb(51, 51, 51))",
        type: "offset",
        levels: [
            {
                strokeColor: "rgb(201, 208, 186)",
                strokeWidth: 0.4,
                left: -0.000972222 / 70,
            },
            {
                left: -0.000972222 / 70,
            },
            {
                strokeColor: "rgb(217, 222, 205)",
                strokeWidth: 0.361,
                left: -0.000972222 / 70,
            },
            {
                left: -0.000972222 / 70,
            },
            {
                fillColor: "rgb(255, 255, 255)",
                strokeColor: "rgb(37, 133, 80)",
                strokeWidth: 0.222
            },
            {
                fillColor: "rgb(255, 255, 255)"
            }
        ],
    },
    {
        name: "greyGreenOffset",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/greyGreenOffset.png",
        color: "rgb(80, 67, 169)",
        type: "offset",
        hidden: true,
        levels: [
            {
                strokeColor: "rgb(209, 209, 209)",
                strokeWidth: 0.194,
                left: 0.042,
                top: 3.57189e-16 / 70,
            },
            {
                left: 0.042,
                top: 3.57189e-16 / 70,
            },
            {
                strokeColor: "rgb(237, 233, 225)",
                strokeWidth: 0.163,
                left: 0.042,
                top: 3.57189e-16 / 70,
            },
            {
                left: 0.042,
                top: 3.57189e-16 / 70,
            },
            {
                fillColor: "rgb(80, 67, 169)",
                textShadow: {
                    color: "rgb(83, 191, 140)",
                    offsetX: 0.0556,
                    offsetY: (4.76252e-16) / 70,
                    blur: 0,
                }
            }
        ],
    },
    {
        name: "blueWhiteOffset",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/blueWhiteOffset.png",
        color: "rgb(51, 51, 51)",
        type: "offset",
        hidden: true,
        levels: [
            {
                fillColor: "rgba(51, 51, 51, 0)",
                textShadow: {
                    color: "rgba(0, 121, 255, 0.3)",
                    offsetX: 0.000687465/70,
                    offsetY: 0.000687465/70,
                    blur: 0.210,
                },
            },
            {
                fillColor: "rgba(51, 51, 51, 0)",
                textShadow: {
                    color: "rgba(0, 121, 255, 0.5)",
                    offsetX: 0.000687465/70,
                    offsetY: 0.000687465/70,
                    blur: 0.142,
                },
            },
            {
                fillColor: "rgb(255, 255, 255)"
            }
        ],
    },
    {
        name: "whiteBlackOffset2",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/whiteBlackOffset2.png",
        color: "rgb(51, 51, 51)",
        type: "offset",
        hidden: true,
        levels: [
            {
                fillColor: "rgb(0, 0, 0)",
                strokeColor: "rgb(255, 255, 255)",
                strokeWidth: 0.139,
                textShadow: {
                    color: "rgba(0, 0, 0, 0.75)",
                    offsetX: (-2.4663e-16)/70,
                    offsetY: 0.058,
                    blur: 0.171,
                }
            },
            {
                fillColor: "rgb(0, 0, 0)"
            }
        ],
    },
    {
        name: "greyBlackOffset",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/greyBlackOffset.png",
        color: "rgb(51, 51, 51)",
        type: "offset",
        levels: [
            {
                fillColor: "rgb(255, 255, 255)",
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 0.972222/70,
                left: (-4.1672e-16) / 70,
                top: 0.097
            },
            {
                fillColor: "rgb(255, 255, 255)",
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 0.972222/70,
                left: (-2.97657e-16) / 70,
                top: 0.069
            },
            {
                fillColor: "rgb(255, 255, 255)",
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 0.972222 / 70,
                top: 1.94444 / 70,
                left: 0.028
            },
            {
                fillColor: "rgb(0, 0, 0)"
            }
        ],
    },
    {
        name: "blackTransparentOffset",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/blackTransparentOffset.png",
        color: "rgb(0, 0, 0)",
        type: "offset",
        levels: [
            {
                fillColor: "rgba(51, 51, 51, 0)",
                strokeWidth: 1.88889 / 70,
                strokeColor: "rgb(0, 0, 0)"
            }
        ],
    },
    {
        name: "blackWhiteOffset",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/blackWhiteOffset.png",
        color: "rgb(51, 51, 51)",
        type: "offset",
        levels: [
            {
                fillColor: "rgb(213, 213, 213)",
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 3.88889 / 70,
                left: -3.57189e-16 / 70,
                top: 5.83333 / 70
            },
            {
                fillColor: "rgb(213, 213, 213)",
                top: 5.83333 / 70,
                left: -3.57189e-16 / 70
            },
            {
                fillColor: "rgb(255, 255, 255)",
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 3.88889 / 70
            },
            {
                fillColor: "rgb(255, 255, 255)"
            }
        ],
    },
    {
        name: "blackYellowOffset",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/blackYellowOffset.png",
        color: "rgb(51, 51, 51)",
        type: "offset",
        levels: [
            {
                fillColor: "rgb(0, 0, 0)",
                left: 7.16595 / 70,
                top: 2.32836 / 70,
            },
            {
                fillColor: "rgb(255, 218, 0)",
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 3.22222 / 70
            },
            {
                fillColor: "rgb(255, 218, 0)"
            }
        ],
    },
    {
        name: "orangeWhiteOffset2",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/orangeWhiteOffset2.png",
        color: "rgb(51, 51, 51)",
        type: "offset",
        levels: [
            {
                fillColor: "rgb(255, 140, 0)",
                left: 5.15599 / 70,
                top: 5.15599 / 70,
                strokeColor: "rgb(255, 140, 0)",
                strokeWidth: 7.77778 / 70
            },
            {
                fillColor: "rgb(255, 140, 0)",
                left: 5.15599 / 70,
                top: 5.15599 / 70,
            },
            {
                fillColor: "rgb(255, 255, 255)",
                strokeWidth: 7.77778 / 70,
                strokeColor: "rgb(0, 0, 0)"
            },
            {
                fillColor: "rgb(255, 255, 255)"
            }
        ],
    },
    // {
    //     name: "orangeWhiteOffset",
    //     fontFamily: "Alibaba PuHuiTi B",
    //     src: "https://res.cxb123.com/imgeditor/img/xc/orangeWhiteOffset.png",
    //     color: "rgb(51, 51, 51)",
    //     type: "offset",
    //     levels: [
    //         {
    //             fillColor: "rgb(255, 140, 0)",
    //             left: 5.15599 / 70,
    //             top: 5.15599 / 70,
    //             strokeColor: "rgb(255, 140, 0)",
    //             strokeWidth: 7.77778 / 70
    //         },
    //         {
    //             fillColor: "rgb(255, 140, 0)",
    //             left: 5.15599 / 70,
    //             top: 5.15599 / 70,
    //         },
    //         {
    //             fillColor: "rgb(255, 255, 255)",
    //             strokeWidth: 7.77778 / 70,
    //             strokeColor: "rgb(0, 0, 0)"
    //         },
    //         {
    //             fillColor: "rgb(255, 255, 255)"
    //         }
    //     ],
    // },
    // {    //多色背景 7排1号 7排2号
    //
    // },
    {
        name: "whiteBlackOffset3",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/whiteBlackOffset3.png",
        color: "rgb(51, 51, 51)",
        type: "offset",
        hidden: true,
        levels: [
            {
                fillColor: "rgb(0, 0, 0)",
                strokeColor: "rgb(255, 255, 255)",
                strokeWidth: 15.3925 / 70,
                left: 7.21522 / 70,
                top: (-8.8361e-16) / 70,
                textShadow: {
                    color: "rgb(0, 0, 0)",
                    blur: 0,
                    offsetX: 10.8841 / 70,
                    offsetY: 10.8841 / 70
                }
            },
            {
                fillColor: "rgb(0, 0, 0)",
                left: 7.21522 / 70,
                top: (-8.8361e-16) / 70,
            }
        ],
    },
    {
        name: "blackYellowOffset2",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/blackYellowOffset2.png",
        color: "rgb(255, 228, 0)",
        type: "offset",
        levels: [
            {
                left: (-4.01837e-16) / 70,
                top: 6.5625 / 70,
                strokeWidth: 6.80556 / 70,
                strokeColor: "rgb(0, 0, 0)"
            },
            {
                strokeWidth: 7.77778 / 70,
                strokeColor: "rgb(0, 0, 0)"
            },
            {
                left: -3.48259e-16 / 70,
                top: 5.6875 / 70,
                fillColor: "rgb(237, 91, 34)"
            },
            {
                fillColor: "rgb(255, 228, 0)",
                left: -5.35783e-20 / 70,
                top: 0.000875 / 70
            }
        ],
    },
    {
        name: "blackWhiteOffset2",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/blackWhiteOffset2.png",
        color: "rgb(51, 51, 51)",
        type: "offset",
        levels: [
            {
                fillColor: "rgb(255, 255, 255)",
                left: 1.94444 / 70,
                top: -2.38126e-16 / 70,
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 3.61111 / 70,
            },
            {
                fillColor: "rgb(255, 255, 255)",
                left: 1.94444 / 70,
                top: -2.38126e-16 / 70
            },
            {
                fillColor: "rgb(255, 255, 255)",
                left: -1.94444 / 70,
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 3.61111 / 70
            },
            {
                left: -1.94444 / 70,
                fillColor: "rgb(255, 255, 255)"
            }
        ],
    },
    //暂不支持纯shadow
    // {
    //     name: "yellowBlackOffset1",
    //     fontFamily: "Alibaba PuHuiTi B",
    //     src: "https://res.cxb123.com/imgeditor/img/xc/yellowBlackOffset1.png",
    //     color: "rgb(51, 51, 51)",
    //     type: "offset",
    //     levels: [
    //         {
    //             textShadow: {
    //                 color: "rgb(255, 202, 28)",
    //                 offsetX: 6.18718 / 70,
    //                 offsetY: 6.18718 / 70,
    //                 blur: 0
    //             }
    //         },
    //         {
    //             textShadow: {
    //                 color: "rgb(255, 202, 28)",
    //                 offsetX: 4.81225 / 70,
    //                 offsetY: 4.81225 / 70,
    //                 blur: 0
    //             }
    //         },
    //         {
    //             textShadow: {
    //                 color: "rgb(255, 202, 28)",
    //                 offsetX: 3.43732 / 70,
    //                 offsetY: 3.43732 / 70,
    //                 blur: 0
    //             }
    //         },
    //         {
    //             fillColor: "rgb(0, 0, 0)",
    //             textShadow: {
    //                 color: "rgb(255, 202, 28)",
    //                 offsetX: 2.25881 / 70,
    //                 offsetY: 2.25881 / 70,
    //                 blur: 0
    //             }
    //         }
    //     ],
    // },
    //九排1/2/3/4渐变
    {
        name: "blueGreyOffset",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/blueGreyOffset.png",
        color: "rgb(51, 51, 51)",
        type: "offset",
        levels: [
            {
                fillColor: "rgba(146, 174, 255, 0.5)",
                left: 2.74986 / 70,
                top: 2.74986 / 70
            },
            {
                fillColor: "rgba(51, 51, 51, 0)",
                left: -0.624932 / 70,
                top: -0.744765 / 70,
                strokeColor: "rgb(0, 63, 255)",
                strokeWidth: 1.61111 / 70
            }
        ],
    },
    {
        name: "blackWhiteOffset3",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/blackWhiteOffset3.png",
        color: "rgb(51, 51, 51)",
        type: "offset",
        levels: [
            {
                fillColor: "rgb(255, 255, 255)",
                left: -5.83333 / 70
            },
            {
                fillColor: "rgb(0, 0, 0)"
            }
        ],
    },
    //十一排1号渐变
    {
        name: "redGreyOffset",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/redGreyOffset.png",
        color: "rgb(187, 0, 0)",
        type: "offset",
        levels: [
            {
                fillColor: "rgb(255, 242, 222)",
                strokeWidth: 11.6667 / 70,
                strokeColor: "rgb(182, 36, 36)"
            },
            {
                fillColor: "rgb(255, 242, 222)"
            }
        ],
    },
    {
        name: "blackWhiteOffset4",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/blackWhiteOffset4.png",
        color: "rgb(0, 0, 0)",
        type: "offset",
        hidden: true,
        levels: [
            {
                left: 0.000972222 / 70,
                top: -1.19063e-19 / 70,
                textShadow: {
                    color: "rgba(0, 0, 0, 0.5)",
                    offsetX: -5.95314e-20 / 70,
                    offsetY: -0.000972222 / 70,
                    blur: 0
                }
            },
            {
                fillColor: "rgb(255, 255, 255)",
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 1.94444 / 70
            }
        ],
    },
    //12排1、2号的图案
    {
        name: "greyDotOffset",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/greyDotOffset.png",
        color: "rgb(0, 0, 0)",
        type: "offset",
        hidden: true,
        levels: [
            {
                fillColor: "rgba(51, 51, 51, 0)",
                textShadow: {
                    color: "rgba(0, 0, 0, 0.75)",
                    offsetX: -5.95314e-20 / 70,
                    offsetY: 0.000972222 / 70,
                    blur: 6.19048 / 70
                }
            }
        ],
    },
    //倒数第5排1、2渐变
    {
        name: "blueRedOffset",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/blueRedOffset.png",
        color: "rgb(0, 0, 0)",
        type: "offset",
        levels: [
            {
                fillColor: "rgba(199, 199, 199, 0.5)",
                left: 7.80701 / 70,
                top: 11.1496 / 70,
                skewX: -0.1714,
                skewY: -0.0612
            },
            {
                fillColor: "rgb(22, 82, 177)",
                left: 4.46115 / 70,
                top: 6.37118 / 70,
                skewX: -0.1714,
                skewY: -0.0612
            },
            {
                fillColor: "rgb(220, 59, 62)",
                strokeColor: "rgb(255, 255, 255)",
                strokeWidth: 3.88889 / 70,
                skewX: -0.1714,
                skewY: -0.0612
            },
            {
                fillColor: "rgb(220, 59, 62)",
                skewX: -0.1714,
                skewY: -0.0612
            }
        ],
    },
    {
        name: "greyWhiteOffset",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/greyWhiteOffset.png",
        color: "rgb(0, 0, 0)",
        type: "offset",
        levels: [
            {
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 17.2941 / 70
            },
            {
                strokeColor: "rgb(255, 255, 255)",
                strokeWidth: 14 / 70
            },
            {
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 12.3529 / 70
            },
            {
                strokeColor: "rgb(255, 255, 255)",
                strokeWidth: 9.88235 / 70
            },
            {
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 7 / 70
            },
            {
                strokeColor: "rgb(255, 255, 255)",
                strokeWidth: 4.86111 / 70
            },
            {
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 2.91667 / 70
            },
            {
                fillColor: "rgb(255, 255, 255)"
            }
        ],
    },
    {
        name: "orangeBlueOffset",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/orangeBlueOffset.png",
        color: "rgb(0, 0, 0)",
        type: "offset",
        hidden: true,
        levels: [
            {
                fillColor: "rgb(20, 113, 255)",
                left: 1.37493 / 70,
                top: 1.37493 / 70,
                textShadow: {
                    color: "rgb(255, 209, 192)",
                    offsetX: 3.24091 / 70,
                    offsetY: 3.24091 / 70,
                    blur: 0
                }
            },
            {
                fillColor: "rgba(51, 51, 51, 0)",
                strokeColor: "rgb(89, 208, 255)",
                strokeWidth: 0.777778 / 70
            },
            {
                fillColor: "rgba(51, 51, 51, 0)"
            }
        ]
    },
    {
        name: "whiteOrangeOffset",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/whiteOrangeOffset.png",
        color: "rgb(51, 51, 51)",
        type: "offset",
        hidden: true,
        levels: [
            {
                left: -2.38126e-16 / 70,
                top: 3.88889 / 70,
                fillColor: "rgb(231, 89, 0)",
                textShadow: {
                    color: "rgb(231, 89, 0)",
                    offsetX: -1.7009e-16 / 70,
                    offsetY: 2.77778 / 70,
                    blur: 10 / 70
                }
            },
            {
                left: -1.19063e-16 / 70,
                top: 1.94444 / 70,
                fillColor: "rgb(231, 89, 0)"
            },
            {
                fillColor: "rgba(51, 51, 51, 0)",
                strokeColor: "rgb(255, 244, 211)",
                strokeWidth: 1.27778 / 70,
                textShadow: {
                    color: "rgb(231, 89, 0)",
                    offsetX: 0.000687465 / 70,
                    offsetY: 0.000687465 / 70,
                    blur: 10.2381 / 70
                }
            },
            {
                fillColor: "rgba(51, 51, 51, 0)"
            }
        ]
    },
    {
        name: "rainbowOffset",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/rainbowOffset.png",
        color: "rgb(51, 51, 51)",
        type: "offset",
        levels: [
            {
                left: -1.66688e-15 / 70,
                top: 27.2222 / 70,
                fillColor: "rgb(140, 0, 224)"
            },
            {
                left: -1.42875e-15 / 70,
                top: 23.3333 / 70,
                fillColor: "rgb(0, 90, 213)"
            },
            {
                left: -1.19063e-15 / 70,
                top: 19.4444 / 70,
                fillColor: "rgb(0, 213, 213)"
            },
            {
                left: -9.52503e-16 / 70,
                top: 15.5556 / 70,
                fillColor: "rgb(46, 255, 34)"
            },
            {
                left: -7.14377e-16 / 70,
                top: 11.6667 / 70,
                fillColor: "rgb(255, 246, 0)"
            },
            {
                left: -4.76252e-16 / 70,
                top: 7.77778 / 70,
                fillColor: "rgb(255, 119, 0)"
            },
            {
                left: -2.38126e-16 / 70,
                top: 3.88889 / 70,
                fillColor: "rgb(242, 0, 0)"
            },
            {
                fillColor: "rgb(255, 255, 255)"
            }
        ]
    },
    {
        name: "rainbowOffset2",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/rainbowOffset2.png",
        color: "rgb(51, 51, 51)",
        type: "offset",
        levels: [
            {
                left: 18.9599 / 70,
                top: 27.0775 / 70,
                fillColor: "rgb(255, 200, 61)",
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 2.27778 / 70
            },
            {
                left: 18.9599 / 70,
                top: 27.0775 / 70,
                fillColor: "rgb(255, 200, 61)"
            },
            {
                left: 22.3058 / 70,
                top: 31.8559 / 70,
                fillColor: "rgb(80, 215, 119)",
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 2.27778 / 70
            },
            {
                left: 22.3058 / 70,
                top: 31.8559 / 70,
                fillColor: "rgb(80, 215, 119)"
            },
            {
                left: 17.8446 / 70,
                top: 25.4847 / 70,
                fillColor: "rgb(52, 143, 255)",
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 2.27778 / 70
            },
            {
                left: 17.8446 / 70,
                top: 25.4847 / 70,
                fillColor: "rgb(52, 143, 255)",
            },
            {
                left: 13.3835 / 70,
                top: 19.1135 / 70,
                fillColor: "rgb(129, 69, 255)",
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 2.27778 / 70
            },
            {
                left: 13.3835 / 70,
                top: 19.1135 / 70,
                fillColor: "rgb(129, 69, 255)"
            },
            {
                left: 8.9223 / 70,
                top: 12.7424 / 70,
                fillColor: "rgb(220, 0, 0)",
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 2.27778 / 70
            },
            {
                left: 8.9223 / 70,
                top: 12.7424 / 70,
                fillColor: "rgb(220, 0, 0)"
            },
            {
                left: 4.46115 / 70,
                top: 6.37118 / 70,
                fillColor: "rgb(255, 94, 4)",
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 2.27778 / 70
            },
            {
                left: 4.46115 / 70,
                top: 6.37118 / 70,
                fillColor: "rgb(255, 94, 4)"
            },
            {
                fillColor: "rgb(255, 255, 255)",
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 1.61111 / 70
            },
            {
                fillColor: "rgb(255, 255, 255)"
            }
        ]
    },
    {
        name: "greenOrangeOffset",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/greenOrangeOffset.png",
        color: "rgb(51, 51, 51)",
        type: "offset",
        levels: [
            {
                strokeColor: "rgb(80, 255, 125)",
                strokeWidth: 23.3333 / 70
            },
            {
            },
            {
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 17.5 / 70
            },
            {

            },
            {
                strokeColor: "rgb(255, 69, 0)",
                strokeWidth: 13.6111 / 70
            },
            {

            },
            {
                strokeColor: "rgb(255, 255, 255)",
                strokeWidth: 9.72222 / 70
            },
            {

            },
            {
                fillColor: "rgb(255, 69, 0)",
                strokeColor: "rgb(255, 168, 0)",
                strokeWidth: 3.88889 / 70
            },
            {
                fillColor: "rgb(255, 69, 0)"
            }
        ]
    },
    {
        name: "whiteBlackOffset4",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/whiteBlackOffset4.png",
        color: "rgb(51, 51, 51)",
        type: "offset",
        levels: [
            {
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 11.3 / 70
            },
            {
                strokeColor: "rgb(255, 255, 255)",
                strokeWidth: 6.58824 / 70
            },
            {
                fillColor: "rgb(51, 51, 51)"
            }
        ]
    },
    {
        name: "blackWhiteOffset6",
        fontFamily: "Alibaba PuHuiTi B",
        src: "https://res.cxb123.com/imgeditor/img/xc/blackWhiteOffset6.png",
        color: "rgb(51, 51, 51)",
        type: "offset",
        levels: [
            {
                left: -3.0256e-16 / 70,
                top: 4.94118 / 70,
                fillColor: "rgb(0, 0, 0)",
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 2.47059 /70
            },
            {
                strokeColor: "rgb(0, 0, 0)",
                strokeWidth: 2.47059 / 70
            },
            {
                fillColor: "rgb(255, 255, 255)"
            }
        ]
    },
    //type === image 实例
    // {
    //     name: "calligraphyImage",                   //书法
    //     fontFamily: "Source Han Sans CN Bold",   //should be 汉仪程行简
    //     src: "https://res.cxb123.com/imgeditor/img/xc/calligraphyImage.png",
    //     type: 'image',
    //     colors: [
    //         "#fdd835",
    //         "#fc9432",
    //         "#ffc58a",
    //         "#ffe208",
    //     ],
    //     images: [
    //         "https://st-gdx.dancf.com/www/8/design/20180404-192434-3.png",
    //         "https://st-gdx.dancf.com/www/8/design/20180408-160632-2.png",
    //         "https://st-gdx.dancf.com/www/8/design/20180408-160642-3.png",
    //         "https://st-gdx.dancf.com/www/8/design/20180408-160646-4.png",
    //     ],
    //     color: "#fdd835",
    //     levels: [
    //         {
    //             backgroundImage: "https://st-gdx.dancf.com/www/8/design/20180404-192434-3.png",
    //             backgroundSizeX: 2.2,
    //             backgroundSizeY: 1,
    //         },
    //     ],
    // },
]

textStyles = textStyles.filter(style => (!style.hidden));
export default textStyles;
