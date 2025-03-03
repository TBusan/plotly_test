// 定义.lvl的色阶
const origincolors = [
    [0.0, '#FF0000'],  // 红，t=0.0
    [100.0, '#FF7F00'],  // 橙，t=0.25
    [200.0, '#FFFF00'],  // 黄，t=0.5
    [300.0, '#1FDAE5'],  // 绿，t=0.75
    [400.0, '#00FF00'],  // 绿，t=0.75
    [500.0, '#8B00FF']   // 紫，t=1.0
];

const origincolors2 = [
    [0.0, '#FF0000'],  // 红，t=0.0
    [100.0, '#FF7F00'],  // 橙，t=0.25
    [200.0, '#FFFF00'],  // 黄，t=0.5
    [300.0, '#1FDAE5'],  // 绿，t=0.75
    [400.0, '#00FF00'],  // 绿，t=0.75
    [500.0, '#8B00FF'],   // 紫，t=1.0
    [600.0, '#B0F111'],   // 紫，t=1.0
];


// const origincolorsLen = origincolors.length
// 原始颜色范围
// const originColorRange = [0, 500]



// 示例1
// 真实的数据的数据范围
const dataMinAndMaxValue = [-300.0, 800.0];

const dataRealColors = [
    [-300.0, '#FF0000'],
    [0.0, '#FF0000'],
    [100.0, '#FF7F00'],
    [200.0, '#FFFF00'],
    [300.0, '#1FDAE5'],
    [400.0, '#00FF00'],
    [800.0, '#8B00FF'],
]

const dataRange = 800 - (-300)

const colorScale = [
    [(-300.0 - (-300.0)) / dataRange, '#FF0000'],
    [(0.0 - (-300.0)) / dataRange, '#FF0000'],
    [(100.0 - (-300.0)) / dataRange, '#FF7F00'],
    [(200.0 - (-300.0)) / dataRange, '#FFFF00'],
    [(300.0 - (-300.0)) / dataRange, '#1FDAE5'],
    [(400.0 - (-300.0)) / dataRange, '#00FF00'],
    [(800.0 - (-300.0)) / dataRange, '#8B00FF'],
];

console.log('colorScale', colorScale)

// 示例2
const dataMinAndMaxValue2 = [100.0, 400.0];

const dataRealColors2 = [
    [100.0, '#FF7F00'],
    [200.0, '#FFFF00'],
    [300.0, '#1FDAE5'],
    [400.0, '#00FF00'],
]

const dataRange2 = 400.0 - 100.0

const colorScale2 = [
    [(100.0 - 100.0) / dataRange2, '#FF7F00'],
    [(200.0 - 100.0) / dataRange2, '#FFFF00'],
    [(300.0 - 100.0) / dataRange2, '#1FDAE5'],
    [(400.0 - 100.0) / dataRange2, '#00FF00'],
]

console.log('colorScale2', colorScale2)

// 示例3
const dataMinAndMaxValue3 = [600.0, 900.0];

const dataRealColors3 = [
    [600.0, '#8B00FF'],
    [900.0, '#8B00FF'],
]

const dataRange3 = 900.0 - 600.0

const colorScale3 = [
    [(600.0 - 600.0) / dataRange3, '#8B00FF'],
    [(900.0 - 600.0) / dataRange3, '#8B00FF'],
]

console.log('colorScale3', colorScale2)

// 示例4
const dataMinAndMaxValue4 = [240.0, 630.0];

// const dataRealColors4 = [
//     [200.0, '#FFFF00'],
//     [240.0, '#1FDAE5'],
//     [300.0, '#1FDAE5'],
//     [400.0, '#00FF00'],
//     [630.0, '#8B00FF'],
// ]

const dataRealColors4 = [
    [240.0, '#1FDAE5'],
    [300.0, '#1FDAE5'],
    [400.0, '#00FF00'],
    [630.0, '#8B00FF'],
]


const dataRange4 = 630.0 - 240.0

const colorScale4 = [
    [(240.0 - 240.0) / dataRange4, '#1FDAE5'],
    [(300.0 - 240.0) / dataRange4, '#1FDAE5'],
    [(400.0 - 240.0) / dataRange4, '#00FF00'],
    [(630.0 - 240.0) / dataRange4, '#8B00FF'],
]

console.log('colorScale4', colorScale4)


// 示例5
const dataMinAndMaxValue5 = [-300.0, 200.0];

const dataRealColors5 = [
    [-300.0, '#FF0000'],
    [0.0, '#FF0000'],
    [100.0, '#FF7F00'],
    [200.0, '#FFFF00'],
]

const dataRange5 = 200.0 - (-300.0)

const colorScale5 = [
    [(-300.0 - (-300.0)) / dataRange5, '#FF0000'],
    [(0.0 - (-300.0)) / dataRange5, '#FF0000'],
    [(100.0 - (-300.0)) / dataRange5, '#FF7F00'],
    [(200.0 - (-300.0)) / dataRange5, '#FFFF00'],
]

console.log('colorScale5', colorScale5)


// 示例 6
const dataMinAndMaxValue6 = [-314.0, 367.0];

const dataRealColors6 = [
    [-314.0, '#FF0000'],
    [0.0, '#FF0000'],
    [100.0, '#FF7F00'],
    [200.0, '#FFFF00'],
    [300.0, '#8B00FF'],
    [367.0, '#8B00FF'],
]

const dataRange6 = 367.0 - (-314.0)

const colorScale6 = [
    [((-314.0) - (-314.0)) / dataRange6, '#FF0000'],
    [(0.0 - (-314.0)) / dataRange6, '#FF0000'],
    [(100.0 - (-314.0)) / dataRange6, '#FF7F00'],
    [(200.0 - (-314.0)) / dataRange6, '#FFFF00'],
    [(300.0 - (-314.0)) / dataRange6, '#8B00FF'],
    [(367.0 - (-314.0)) / dataRange6, '#8B00FF'],
]

console.log('colorScale6', colorScale6)


// 示例7
const dataMinAndMaxValue7 = [0.0, 500.0];

const dataRealColors7 = [
    [0.0, '#FF0000'],  // 红，t=0.0
    [100.0, '#FF7F00'],  // 橙，t=0.25
    [200.0, '#FFFF00'],  // 黄，t=0.5
    [300.0, '#1FDAE5'],  // 绿，t=0.75
    [400.0, '#00FF00'],  // 绿，t=0.75
    [500.0, '#8B00FF']   // 紫，t=1.0
]

const dataRange7 = 500.0 - 0.0

const colorScale7 = [
    [(0.0 - 0.0) / dataRange7, '#FF0000'],
    [(100.0 - 0.0) / dataRange7, '#FF7F00'],
    [(200.0 - 0.0) / dataRange7, '#FFFF00'],
    [(300.0 - 0.0) / dataRange7, '#1FDAE5'],
    [(400.0 - 0.0) / dataRange7, '#00FF00'],
    [(500.0 - 0.0) / dataRange7, '#8B00FF'],
]

console.log('colorScale7', colorScale7)


// 示例8
const dataMinAndMaxValue8 = [0.0, 400.0];

const dataRealColors8 = [
    [0.0, '#FF0000'],  // 红，t=0.0
    [100.0, '#FF7F00'],  // 橙，t=0.25
    [200.0, '#FFFF00'],  // 黄，t=0.5
    [300.0, '#1FDAE5'],  // 绿，t=0.75
    [400.0, '#00FF00'],  // 绿，t=0.75
]

const dataRange8 = 400.0 - 0.0

const colorScale8 = [
    [(0.0 - 0.0) / dataRange8, '#FF0000'],
    [(100.0 - 0.0) / dataRange8, '#FF7F00'],
    [(200.0 - 0.0) / dataRange8, '#FFFF00'],
    [(300.0 - 0.0) / dataRange8, '#1FDAE5'],
    [(400.0 - 0.0) / dataRange8, '#00FF00'],
]

console.log('colorScale8', colorScale8)

/////////////////////////////////////////////////////////////