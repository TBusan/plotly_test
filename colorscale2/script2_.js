// 定义.clr的色阶
const rainbowColors = [
    [0.0, '#FF0000'],
    [0.25, '#FF7F00'],
    [0.5, '#FFFF00'],
    [0.70, '#1FDAE5'],
    [0.75, '#00FF00'],
    [1.0, '#8B00FF']
];


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

// 颜色插值函数
function interpolateColor(color1, color2, ratio) {
    const hex = (c) => {
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    };

    const r = Math.ceil(parseInt(color1.substring(1, 3), 16) * (1 - ratio) + parseInt(color2.substring(1, 3), 16) * ratio);
    const g = Math.ceil(parseInt(color1.substring(3, 5), 16) * (1 - ratio) + parseInt(color2.substring(3, 5), 16) * ratio);
    const b = Math.ceil(parseInt(color1.substring(5, 7), 16) * (1 - ratio) + parseInt(color2.substring(5, 7), 16) * ratio);

    return "#" + hex(r) + hex(g) + hex(b);
}

// 获取原始数据范围
const minVal = Math.min(...origincolors.map(c => c[0]));
const maxVal = Math.max(...origincolors.map(c => c[0]));

// 重新映射颜色
origincolors.forEach(point => {
    // 将原始值归一化到0-1范围
    const normalized = (point[0] - minVal) / (maxVal - minVal);

    // 找到对应的颜色区间
    let i = 0;
    while (i < rainbowColors.length - 1 && normalized > rainbowColors[i + 1][0]) {
        i++;
    }

    // 计算插值比例
    const [x0, x1] = [rainbowColors[i][0], rainbowColors[i + 1][0]];
    const ratio = (normalized - x0) / (x1 - x0);

    // 更新颜色值
    point[1] = interpolateColor(rainbowColors[i][1], rainbowColors[i + 1][1], ratio);
});

