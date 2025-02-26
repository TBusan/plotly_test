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

// 初始化图表
function initPlot() {
    const data = generateData();
    
    const trace = {
        type: 'contour',
        x: data.x,
        y: data.y,
        z: data.z,
        colorscale: 'Viridis',
        contours: {
            coloring: 'heatmap',
            showlabels: false,
            labelfont: {
                size: 12,
                color: 'white'
            }
        },
        colorbar: {
            title: '值',
            titleside: 'right'
        }
    };

    const layout = {
        title: '等值线图',
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

    Plotly.newPlot('plot', [trace], layout, config);
    
    // 添加控件事件监听
    document.getElementById('updatePlot').addEventListener('click', updatePlot);
}

// 更新图表
function updatePlot() {
    const colorscale = document.getElementById('colorscale').value;
    const contourType = document.getElementById('contourType').value;
    const showLabels = document.getElementById('showLabels').checked;
    
    const update = {
        'colorscale': colorscale,
        'contours.coloring': contourType,
        'contours.showlabels': showLabels
    };
    
    Plotly.restyle('plot', update, 0);
}

// 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', initPlot); 