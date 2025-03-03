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
    [1100.0, '#EB2105'],
    [1200.0, '#EB2105'],
    [1300.0, '#EB2105'],
];

// 修改后的颜色映射函数
function interpolateColor(rainbowScale, originScale) {
    // 获取原始数据范围
    const minVal = Math.min(...originScale.map(c => c[0]));
    const maxVal = Math.max(...originScale.map(c => c[0]));
    
    return originScale.map(point => {
        // 归一化到0-1范围
        const normalized = (point[0] - minVal) / (maxVal - minVal);
        
        // 找到对应的颜色区间
        let i = 0;
        while (i < rainbowScale.length - 1 && normalized > rainbowScale[i+1][0]) {
            i++;
        }
        
        // 计算插值比例
        const [x0, x1] = [rainbowScale[i][0], rainbowScale[i+1][0]];
        const ratio = (normalized - x0) / (x1 - x0);
        
        // 颜色插值计算
        const color1 = rainbowScale[i][1];
        const color2 = rainbowScale[i+1][1];
        const hex = c => c.toString(16).padStart(2, '0');
        
        const r = Math.round(parseInt(color1.slice(1,3), 16) * (1 - ratio) + 
                            parseInt(color2.slice(1,3), 16) * ratio);
        const g = Math.round(parseInt(color1.slice(3,5), 16) * (1 - ratio) +
                            parseInt(color2.slice(3,5), 16) * ratio);
        const b = Math.round(parseInt(color1.slice(5,7), 16) * (1 - ratio) +
                            parseInt(color2.slice(5,7), 16) * ratio);
        
        // 返回新数组（保留原始位置值）
        return [point[0], `#${hex(r)}${hex(g)}${hex(b)}`];
    });
}

// 使用方式：
const mappedColors = interpolateColor(rainbowColors, origincolors);
console.log(mappedColors);

