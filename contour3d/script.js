// 生成三维等值线数据
function generateData() {
    const size = 50;
    const x = [];
    const y = [];
    const z = [];
    
    // 生成坐标点
    for (let i = 0; i < size; i++) {
        x.push(i - size/2);
    }
    
    for (let i = 0; i < size; i++) {
        y.push(i - size/2);
    }

    // 生成z值（使用一个三维函数）
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            // 创建一个有趣的等值线模式
            const value = Math.sin(Math.sqrt(
                Math.pow(x[i], 2) + 
                Math.pow(y[j], 2)
            ) / 3) * 30;
            row.push(value);
        }
        z.push(row);
    }
    
    return { x, y, z };
}

// 初始化图表
function initPlot() {
    const data = generateData();
    
    // 创建多个不同高度的等值线图层
    const traces = [];
    const heights = [-20, -10, 0, 10, 20]; // 不同的高度层级

    heights.forEach(height => {
        traces.push({
            type: 'contour',
            x: data.x,
            y: data.y,
            z: data.z,
            colorscale: 'Viridis',
            showscale: false, // 只显示一个颜色条
            contours: {
                coloring: 'lines',
                showlabels: true,
                labelfont: {
                    size: 12,
                    color: 'white'
                }
            },
            opacity: 0.8,
            showlegend: true,
            name: `高度: ${height}`,
            // 使用 transform 在 3D 空间中定位等值线
            transforms: [{
                type: 'surface',
                rotation: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                translation: {
                    x: 0,
                    y: 0,
                    z: height
                }
            }]
        });
    });

    const layout = {
        title: '三维等值线图',
        scene: {
            camera: {
                eye: { x: 1.5, y: 1.5, z: 1.5 }
            },
            xaxis: { title: 'X轴' },
            yaxis: { title: 'Y轴' },
            zaxis: { 
                title: 'Z轴',
                range: [-30, 30]
            },
            aspectmode: 'cube'
        },
        showlegend: true,
        margin: {
            l: 0,
            r: 0,
            t: 30,
            b: 0
        }
    };

    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false
    };

    Plotly.newPlot('plot', traces, layout, config);
}

// 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', initPlot);
