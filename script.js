let data = [];
let layout = {};
let selectedPoints = new Set();
let hiddenPoints = new Set();
let drawingMode = null;
let currentDrawing = [];
let drawings = {
    lines: [],
    polygons: []
};

// 1. 创建散点图
function createScatterPlot() {
    const points = 1000;
    const x = Array.from({length: points}, () => Math.random() * 100);
    const y = Array.from({length: points}, () => Math.random() * 100);
    const colors = Array.from({length: points}, () => 
        `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`
    );

    data = [{
        type: 'scattergl',
        mode: 'markers',
        x: x,
        y: y,
        marker: {
            color: colors,
            size: 10
        },
        selectedpoints: [],
        unselected: {
            marker: { opacity: 0.3 }
        },
        selected: {
            marker: { 
                color: 'red',
                size: 12,
                opacity: 1
            }
        }
    }];

    layout = {
        dragmode: 'select',
        hovermode: 'closest',
        showlegend: false
    };

    Plotly.newPlot('plot', data, layout);
}

// 2. 选择模式
document.getElementById('selectMode').addEventListener('click', function() {
    const plot = document.getElementById('plot');
    plot.classList.add('select-cursor');
    plot.classList.remove('drawing-cursor');
    drawingMode = null;
});

// 3 & 4. 隐藏和显示点
document.getElementById('hidePoints').addEventListener('click', function() {
    // 实现隐藏选中点的逻辑
    selectedPoints.forEach(index => hiddenPoints.add(index));
    updatePointsVisibility();
});

document.getElementById('showPoints').addEventListener('click', function() {
    // 显示所有隐藏的点
    hiddenPoints.clear();
    updatePointsVisibility();
});

// 5 & 6. 绘制功能
document.getElementById('drawLine').addEventListener('click', function() {
    drawingMode = 'line';
    setupDrawingMode();
});

document.getElementById('drawPolygon').addEventListener('click', function() {
    drawingMode = 'polygon';
    setupDrawingMode();
});

function setupDrawingMode() {
    const plot = document.getElementById('plot');
    plot.classList.add('drawing-cursor');
    plot.classList.remove('select-cursor');
    currentDrawing = [];
}

// 7. 处理绘制事件
document.getElementById('plot').addEventListener('click', function(event) {
    if (!drawingMode) return;
    
    const plotRect = event.target.getBoundingClientRect();
    const x = event.clientX - plotRect.left;
    const y = event.clientY - plotRect.top;
    
    // 转换坐标到数据空间
    const xaxis = plot._fullLayout.xaxis;
    const yaxis = plot._fullLayout.yaxis;
    const dataX = xaxis.p2d(x);
    const dataY = yaxis.p2d(y);
    
    currentDrawing.push([dataX, dataY]);
    updateDrawing();
});

// 8. 清除按钮
document.getElementById('clear').addEventListener('click', function() {
    drawings.lines = [];
    drawings.polygons = [];
    updatePlot();
});

// 9 & 10. 更新样式
document.getElementById('updateAllLines').addEventListener('click', function() {
    // 实现更新所有线段样式的逻辑
    const newStyle = {
        color: `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`,
        width: Math.random() * 5 + 1,
        dash: ['solid', 'dot', 'dash'][Math.floor(Math.random() * 3)]
    };
    
    drawings.lines.forEach(line => {
        line.style = {...line.style, ...newStyle};
    });
    updatePlot();
});

document.getElementById('updateAllPolygons').addEventListener('click', function() {
    // 实现更新所有多边形样式的逻辑
    const newStyle = {
        fillcolor: `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},0.3)`,
        linecolor: `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`,
        linewidth: Math.random() * 5 + 1
    };
    
    drawings.polygons.forEach(polygon => {
        polygon.style = {...polygon.style, ...newStyle};
    });
    updatePlot();
});

// 11. 更新单个线段样式
document.getElementById('updateSingleLine').addEventListener('click', function() {
    // 实现更新单个线段样式的逻辑
    if (drawings.lines.length === 0) return;
    
    const lineIndex = Math.floor(Math.random() * drawings.lines.length);
    const newStyle = {
        color: `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`,
        width: Math.random() * 5 + 1,
        dash: ['solid', 'dot', 'dash'][Math.floor(Math.random() * 3)]
    };
    
    drawings.lines[lineIndex].style = {...drawings.lines[lineIndex].style, ...newStyle};
    updatePlot();
});

// 辅助函数
function updatePointsVisibility() {
    const visibility = data[0].x.map((_, i) => !hiddenPoints.has(i));
    Plotly.restyle('plot', {'visible': [visibility]}, [0]);
}

function updateDrawing() {
    if (currentDrawing.length < 2) return;
    
    const trace = {
        type: 'scatter',
        mode: 'lines',
        x: currentDrawing.map(p => p[0]),
        y: currentDrawing.map(p => p[1]),
        line: { color: 'red', width: 2 }
    };
    
    Plotly.update('plot', {}, {shapes: []});
    Plotly.addTraces('plot', trace);
}

function updatePlot() {
    // 更新所有绘制的内容
    const traces = [data[0]];
    
    drawings.lines.forEach(line => {
        traces.push({
            type: 'scatter',
            mode: 'lines',
            x: line.points.map(p => p[0]),
            y: line.points.map(p => p[1]),
            line: line.style
        });
    });
    
    drawings.polygons.forEach(polygon => {
        traces.push({
            type: 'scatter',
            fill: 'toself',
            x: [...polygon.points.map(p => p[0]), polygon.points[0][0]],
            y: [...polygon.points.map(p => p[1]), polygon.points[0][1]],
            fillcolor: polygon.style.fillcolor,
            line: {
                color: polygon.style.linecolor,
                width: polygon.style.linewidth
            }
        });
    });
    
    Plotly.react('plot', traces, layout);
}

// 初始化
createScatterPlot(); 