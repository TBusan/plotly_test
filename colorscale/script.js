// 定义Rainbow色阶
const rainbowColors = [
    [0.0,  '#FF0000'],  // 红，t=0.0
    [0.25, '#FF7F00'],  // 橙，t=0.25
    [0.5,  '#FFFF00'],  // 黄，t=0.5
    [0.70, '#1FDAE5'],  // 绿，t=0.75
    [0.75, '#00FF00'],  // 绿，t=0.75
    [1.0,  '#8B00FF']   // 紫，t=1.0
];

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
            // 生成范围在 -1000 到 1000 之间的值
            const value = (Math.sin(r * 3) / (r + 0.1) * 5 + 
                          Math.sin(xVal * 2) * Math.cos(yVal * 2) + 
                          (xVal * xVal - yVal * yVal) / 4) * 200;
            row.push(value);
        }
        z.push(row);
    }

    return { x, y, z };
}

// 将数据值映射到色阶的 t 值 (0-1)
function mapValueToColorScale(value, minValue, maxValue) {
    // 确保值在范围内
    const clampedValue = Math.max(minValue, Math.min(maxValue, value));
    // 线性映射到 0-1 范围
    return (clampedValue - minValue) / (maxValue - minValue);
}

// 创建基于间隔大小的色阶
function createCustomIntervalColorscale(colorscale, minValue, maxValue, intervalSize) {
    // 计算间隔数量
    const numIntervals = Math.ceil((maxValue - minValue) / intervalSize);
    
    // 创建新的色阶数组
    const customColorscale = [];
    
    for (let i = 0; i <= numIntervals; i++) {
        // 计算当前值
        const value = minValue + i * intervalSize;
        // 确保不超过最大值
        if (value > maxValue) break;
        
        // 将值映射到 0-1 范围
        const t = (value - minValue) / (maxValue - minValue);
        
        // 找到对应的颜色
        let color;
        for (let j = 0; j < colorscale.length - 1; j++) {
            if (t >= colorscale[j][0] && t <= colorscale[j+1][0]) {
                // 在两个色阶点之间进行插值
                const t1 = colorscale[j][0];
                const t2 = colorscale[j+1][0];
                const c1 = colorscale[j][1];
                const c2 = colorscale[j+1][1];
                
                // 计算插值比例
                const ratio = (t - t1) / (t2 - t1);
                
                // 解析颜色
                const r1 = parseInt(c1.slice(1, 3), 16);
                const g1 = parseInt(c1.slice(3, 5), 16);
                const b1 = parseInt(c1.slice(5, 7), 16);
                
                const r2 = parseInt(c2.slice(1, 3), 16);
                const g2 = parseInt(c2.slice(3, 5), 16);
                const b2 = parseInt(c2.slice(5, 7), 16);
                
                // 线性插值
                const r = Math.round(r1 + ratio * (r2 - r1));
                const g = Math.round(g1 + ratio * (g2 - g1));
                const b = Math.round(b1 + ratio * (b2 - b1));
                
                // 转换回十六进制
                color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                break;
            }
        }
        
        // 如果没有找到颜色（应该不会发生），使用最后一个颜色
        if (!color) {
            color = colorscale[colorscale.length - 1][1];
        }
        
        // 添加到自定义色阶
        customColorscale.push([t, color]);
    }
    
    return customColorscale;
}

// 初始化图表
function initPlot() {
    const data = generateData();

    debugger
    
    // 计算数据范围
    let zValues = [];
    for (let i = 0; i < data.z.length; i++) {
        zValues = zValues.concat(data.z[i]);
    }
    const zmin = Math.min(...zValues);
    const zmax = Math.max(...zValues);
    
    // 设置自定义数据范围
    const customMin = -1000;
    const customMax = 1000;
    
    // 创建基于间隔大小的色阶
    const intervalSize = 100; // 每100个单位一个间隔
    // let customColorscale = createCustomIntervalColorscale(rainbowColors, customMin, customMax, intervalSize);
    // console.log('Generated colorscale1:', customColorscale);

    // customColorscale.unshift([0.0, '#ff0000']);  //
    // customColorscale.unshift([0.0, '#ff0000']);  //
    // customColorscale.unshift([0.0, '#ff0000']);  //
  
    let customColorscale = [[-1000.00, '#F23463'],[-9000.0, '#6CEDD0'],[-8000.0, '#EC1449'],[1000.00, '#ff0000']]
    // let customColorscale = [[0.00, 'rgb(255,64,0)'],[0.1, 'rgb(128,255,0)'],[0.2, 'rgb(255,191,0)'],[0.5, 'rgb(0,255,128)'],  [1.0, 'rgb(0,255,255)'],]


    console.log('Generated colorscale2:', customColorscale);
    const defaultColorscale2 = [
        [0.00, 'rgb(0,0,255)'], // 深蓝色
        [0.05, 'rgb(0,64,255)'], // 蓝色
        [0.10, 'rgb(0,128,255)'], // 浅蓝色
        [0.15, 'rgb(0,191,255)'], // 天蓝色
        [0.20, 'rgb(0,255,255)'],
        [1.00, 'rgb(255,0,0)'], // 红色
      ]

    const defaultColorscale = [
        [0.00, 'rgb(0,0,255)'], // 深蓝色
        [0.05, 'rgb(0,64,255)'], // 蓝色
        [0.10, 'rgb(0,128,255)'], // 浅蓝色
        [0.15, 'rgb(0,191,255)'], // 天蓝色
        [0.20, 'rgb(0,255,255)'], // 青色
        [0.25, 'rgb(0,255,191)'], // 青绿色
        [0.30, 'rgb(0,255,128)'], // 浅青绿色
        [0.35, 'rgb(0,255,64)'], // 黄绿色
        [0.40, 'rgb(0,255,0)'], // 绿色
        [0.45, 'rgb(64,255,0)'], // 浅绿色
        [0.50, 'rgb(128,255,0)'], // 草绿色
        [0.55, 'rgb(191,255,0)'], // 黄绿色
        [0.60, 'rgb(255,255,0)'], // 黄色
        [0.65, 'rgb(255,223,0)'], // 金黄色
        [0.70, 'rgb(255,191,0)'], // 橙黄色
        [0.75, 'rgb(255,159,0)'], // 橙色
        [0.80, 'rgb(255,128,0)'], // 深橙色
        [0.85, 'rgb(255,64,0)'], // 红橙色
        [0.90, 'rgb(255,32,0)'], // 橘红色
        [1.00, 'rgb(255,0,0)'], // 红色
      ]
      
  
    // 创建等值线图
    const trace = {
        type: 'contour',
        x: data.x,
        y: data.y,
        z: data.z,
        colorscale: customColorscale,
        zauto: false,                // 关闭自动归一化
        zmin: -2000,  // 手动设置最小值
        zmax: 2000,  // 手动设置最大值
        // connectgaps: true,
        line: { smoothing: 0.5 },
        contours: {
            coloring: 'fill',
            showlabels: true,
            labelfont: {
                size: 12,
                color: 'black'
            },
            size: intervalSize  // 设置等值线间隔大小
        },
        colorbar: {
            title: '值',
            titleside: 'right',
            // 设置色标刻度
            tick0:-1200,
            dtick: intervalSize  // 使用相同的间隔大小
        },
        zmin: customMin,
        zmax: customMax
    };

    const layout = {
        title: '基于间隔大小的Rainbow色阶映射',
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

    // 创建图表
    Plotly.newPlot('plot', [trace], layout, config);
    
    // 显示色阶预览
    // displayColorscalePreview(customColorscale, customMin, customMax, intervalSize);
}

// 显示色阶预览
function displayColorscalePreview(colorscale, minValue, maxValue, intervalSize) {
    const container = document.getElementById('colorscalePreview');
    container.innerHTML = '';
    
    // 创建色阶预览表格
    const table = document.createElement('table');
    table.className = 'colorscale-table';
    
    // 添加表头
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['区间', '值范围', '颜色'];
    
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // 添加表体
    const tbody = document.createElement('tbody');
    const numIntervals = Math.ceil((maxValue - minValue) / intervalSize);
    
    for (let i = 0; i < numIntervals; i++) {
        const row = document.createElement('tr');
        
        // 区间编号
        const cellIndex = document.createElement('td');
        cellIndex.textContent = i + 1;
        row.appendChild(cellIndex);
        
        // 值范围
        const startValue = minValue + i * intervalSize;
        const endValue = Math.min(maxValue, minValue + (i + 1) * intervalSize);
        const cellRange = document.createElement('td');
        cellRange.textContent = `${startValue.toFixed(2)} - ${endValue.toFixed(2)}`;
        row.appendChild(cellRange);
        
        // 颜色
        const cellColor = document.createElement('td');
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        
        // 找到对应的颜色
        const t = (startValue - minValue) / (maxValue - minValue);
        const colorIndex = colorscale.findIndex(item => item[0] >= t);
        const color = colorscale[colorIndex][1];
        
        colorBox.style.backgroundColor = color;
        cellColor.appendChild(colorBox);
        row.appendChild(cellColor);
        
        tbody.appendChild(row);
    }
    
    table.appendChild(tbody);
    container.appendChild(table);
}

// 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', initPlot); 