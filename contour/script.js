// 生成示例数据
function generateData() {
    const size = 100;
    const x = [];
    const y = [];
    const z = [];
    
    // 生成 x 和 y 坐标
    for (let i = 0; i < size; i++) {
        x.push(i);
        y.push(i);
    }
    
    // 生成 z 值（使用一个简单的二维函数）
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            // 创建一个有趣的等值线模式
            const value = Math.sin(i/10) * Math.cos(j/10) * 50 + 
                         Math.sin(Math.sqrt((i-50)*(i-50) + (j-50)*(j-50))/5) * 30;
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
            showlabels: true,
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
        title: '等值线图示例',
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
        displayModeBar: false // 禁用工具栏
    };

    Plotly.newPlot('plot', [trace], layout, config);
}

// 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', initPlot); 