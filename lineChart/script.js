// 生成示例数据
function generateData() {
    const points = 100;  // 数据点数量
    const x = [];
    const y1 = [];  // 第一条线的数据
    const y2 = [];  // 第二条线的数据
    
    for (let i = 0; i < points; i++) {
        x.push(i);
        // 生成一些有趣的曲线数据
        y1.push(Math.sin(i/10) * 5 + Math.random() * 2);
        y2.push(Math.cos(i/10) * 3 + Math.random() * 1.5);
    }
    
    return { x, y1, y2 };
}

// 初始化折线图
function initPlot() {
    const data = generateData();
    
    const trace1 = {
        type: 'scatter',
        mode: 'lines+markers',
        x: data.x,
        y: data.y1,
        name: '数据1',
        line: {
            color: 'rgb(219, 64, 82)',
            width: 2
        },
        marker: {
            size: 6,
            symbol: 'circle'
        }
    };
    
    const trace2 = {
        type: 'scatter',
        mode: 'lines+markers',
        x: data.x,
        y: data.y2,
        name: '数据2',
        line: {
            color: 'rgb(55, 128, 191)',
            width: 2
        },
        marker: {
            size: 6,
            symbol: 'circle'
        }
    };

    const layout = {
        title: '折线图示例',
        dragmode: 'pan',  // 设置默认模式为移动（pan）
        xaxis: {
            title: 'X轴',
            showgrid: true,
            gridcolor: 'rgb(230, 230, 230)'
        },
        yaxis: {
            title: 'Y轴',
            showgrid: true,
            gridcolor: 'rgb(230, 230, 230)',
            zeroline: true,
            zerolinecolor: 'rgb(180, 180, 180)'
        },
        margin: {
            l: 40,
            r: 40,
            b: 40,
            t: 60
        },
        showlegend: true,
        legend: {
            x: 1,
            xanchor: 'right',
            y: 1
        },
        hovermode: 'closest'
    };

    const config = {
        responsive: true,
        displayModeBar: true,  // 显示工具栏以便切换模式
        displaylogo: false,    // 不显示 plotly logo
        modeBarButtonsToRemove: ['select2d', 'lasso2d'], // 移除选择工具
        scrollZoom: true      // 启用滚轮缩放
    };

    Plotly.newPlot('plot', [trace1, trace2], layout, config);
}

// 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', initPlot); 