// 生成示例数据
function generateData() {
    const size = 100;
    const x = [];
    const y = [];
    const z = [];

    // 生成 x 和 y 坐标
    for (let i = 0; i < size; i++) {
        x.push(i / (size - 1) * 4 - 2); // 范围从 -2 到 2
        y.push(i / (size - 1) * 4 - 2);
    }

    // 生成 z 值（使用一个有趣的二维函数）
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            // 创建一个复杂的等值线模式
            const xVal = x[i];
            const yVal = y[j];
            const r = Math.sqrt(xVal * xVal + yVal * yVal);
            const value = Math.sin(r * 3) / (r + 0.1) * 5 + 
                          Math.sin(xVal * 2) * Math.cos(yVal * 2) + 
                          (xVal * xVal - yVal * yVal) / 4;
            row.push(value);
        }
        z.push(row);
    }

    return { x, y, z };
}

// 全局变量存储图表实例
let myPlot;
let plotData;

// 初始化图表
function initPlot() {
    const data = generateData();
    plotData = data; // 保存数据以便后续使用
    
    // 计算数据范围
    let zValues = [];
    for (let i = 0; i < data.z.length; i++) {
        zValues = zValues.concat(data.z[i]);
    }
    const zmin = Math.min(...zValues);
    const zmax = Math.max(...zValues);
    const threshold = 5; // 设置颜色阈值
    
    // 生成等值线层级
    const step = (zmax - zmin) / 15;
    const levels = [];
    for (let level = zmin; level <= zmax; level += step) {
        levels.push(level);
    }
    
    // 生成颜色数组：阈值以上为红色，以下为蓝色
    const colors = levels.map(level => level > threshold ? '#FF0000' : '#0000FF');
    
    const trace = {
        type: 'contour',
        x: data.x,
        y: data.y,
        z: data.z,
        contours: {
            // coloring: 'lines',
            showlabels: true,
            labelfont: {
                size: 12,
                color: 'white',
                family: 'Arial'
            },
            start: zmin,
            end: zmax,
            size: step
        },
        line: {
            color: colors,
            width: 1
        },
        colorbar: {
            title: '值',
            titleside: 'right',
            tickvals: [zmin, threshold, zmax],
            ticktext: [`最小值: ${zmin.toFixed(2)}`, `阈值: ${threshold.toFixed(2)}`, `最大值: ${zmax.toFixed(2)}`],
            tickmode: 'array'
        }
    };

    const layout = {
        title: '等值线阈值颜色示例（>5为红色）',
        xaxis: {
            title: 'X轴'
        },
        yaxis: {
            title: 'Y轴'
        },
        showlegend: false
    };

    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false
    };

    // 创建图表并保存DOM元素引用
    myPlot = document.getElementById('myDiv');
    Plotly.newPlot(myPlot, [trace], layout, config);
}

// 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', initPlot); 