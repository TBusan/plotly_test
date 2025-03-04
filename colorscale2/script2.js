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

const origincolors11 = [
    [-500.0, '#47D349'],
    [-400.0, '#47D349'],
    [-300.0, '#47D349'],
    [-200.0, '#47D349'],
    [-100.0, '#D7E915'],
    [0.0, '#05EBDB'],
    [100.0, '#47D359'],
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
    [1200.0, '#EB2105'],
    [1300.0, '#EB2105'],
    [1400.0, '#EB2105'],
];

const origincolors22 = [
    [-500.0, '#47D349'],
    [-400.0, '#47D349'],
    [-300.0, '#47D349'],
    [-200.0, '#47D349'],
    [-100.0, '#D7E915'],
    [0.0, '#05EBDB'],
    [1400.0, '#EB2105'],
    [100.0, '#47D359'],
    [600.0, '#B0F111'],
    [700.0, '#658613'],
    [800.0, '#70CFE5'],
    [900.0, '#3840E3'],
    [1000.0, '#D120B7'],
    [1100.0, '#EB2105'],
    [1200.0, '#EB2105'],
    [1300.0, '#EB2105'],

];

// 修改后的颜色映射函数
function interpolateColor(rainbowScale, originScale) {
    // 获取有效数据范围（排除重复的边界值）
    const dataPoints = originScale.map(c => c[0]);
    const dataMin = Math.min(...dataPoints);
    const dataMax = Math.max(...dataPoints);

    // 自动检测有效数据边界（找到第一个颜色变化点）
    let actualMin = dataMin;
    let actualMax = dataMax;

    // 向前扫描找最小有效值
    for (let i = 0; i < originScale.length - 1; i++) {
        if (originScale[i][1] !== originScale[i + 1][1]) {
            actualMin = originScale[i][0];
            break;
        }
    }

    // 向后扫描找最大有效值
    for (let i = originScale.length - 1; i > 0; i--) {
        if (originScale[i][1] !== originScale[i - 1][1]) {
            actualMax = originScale[i][0];
            break;
        }
    }

    return originScale.map(point => {
        // 钳位处理
        let clampedValue = point[0];
        if (point[0] < actualMin) clampedValue = actualMin;
        if (point[0] > actualMax) clampedValue = actualMax;

        // 归一化计算
        const normalized = (clampedValue - actualMin) / (actualMax - actualMin);

        // 边界值特殊处理
        if (normalized <= 0) return [point[0], rainbowScale[0][1]];
        if (normalized >= 1) return [point[0], rainbowScale[rainbowScale.length - 1][1]];

        // 区间定位和颜色插值（保持原有逻辑）
        let i = 0;
        while (i < rainbowScale.length - 1 && normalized > rainbowScale[i + 1][0]) {
            i++;
        }

        const [x0, x1] = [rainbowScale[i][0], rainbowScale[i + 1][0]];
        const ratio = (normalized - x0) / (x1 - x0);

        const color1 = rainbowScale[i][1];
        const color2 = rainbowScale[i + 1][1];
        const hex = c => c.toString(16).padStart(2, '0');

        const r = Math.round(parseInt(color1.slice(1, 3), 16) * (1 - ratio) +
            parseInt(color2.slice(1, 3), 16) * ratio);
        const g = Math.round(parseInt(color1.slice(3, 5), 16) * (1 - ratio) +
            parseInt(color2.slice(3, 5), 16) * ratio);
        const b = Math.round(parseInt(color1.slice(5, 7), 16) * (1 - ratio) +
            parseInt(color2.slice(5, 7), 16) * ratio);

        return [point[0], `#${hex(r)}${hex(g)}${hex(b)}`];
    });
}

// 使用方式：
const mappedColors = interpolateColor(rainbowColors, origincolors22);
console.log(mappedColors);

