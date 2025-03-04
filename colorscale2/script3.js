// 定义.clr的色阶
const rainbowColors = [
    [0.0, '#FF0000'],
    [0.25, '#FF7F00'],
    [0.55, '#FFFF00'],
    [0.78, '#1FDAE5'],
    [0.81, '#00FF00'],
    [1.0, '#8B00FF']
];

// 定义需要映射的最大值最小值
const rainbowColorsMinAndMax = [100.0, 1400.0]

const dataRange = rainbowColorsMinAndMax[1] - rainbowColorsMinAndMax[0]

// 通用转换函数
function convertScale(rainbowColors, minMax) {
    const [min, max] = minMax;
    const range = max - min;

    return rainbowColors.map(color => [
        min + color[0] * range,  // 应用转换公式
        color[1]                 // 保留原始颜色值
    ]);
}

// 使用示例
const rainbowColorsYS = convertScale(rainbowColors, rainbowColorsMinAndMax);

console.log("rainbowColorsYS", rainbowColorsYS)


// 定义.lvl的色阶（颜色值将被重新映射）
const origincolors = [
    [-200.0, '#47D349'],
    [-100.0, '#D7E915'],
    [0.0, '#05EBDB'],
    [100.0, '#47D349'],
    [200.0, '#D7E915'],
    [300.0, '#4E0B84'],
    [400.0, '#C9E02F'],
    [500.0, '#F36F46'],
    [600.0, '#B0F111'],
    [700.0, '#658613'],
    [800.0, '#70CFE5'],
    [900.0, '#3840E3'],
    [1000.0, '#D120B7'],
    [1100.0, '#EB2105'],
];

