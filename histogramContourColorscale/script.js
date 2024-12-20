let isDrawing = false;
let currentMode = null;
let currentPoints = [];
let allShapes = [];

// 生成模拟数据 (5000个点)
function generateData() {
    const x = [];
    const y = [];
    for (let i = 0; i < 5000; i++) {
        x.push(Math.random() * 100);
        y.push(Math.random() * 100);
    }
    return { x, y };
}

// 初始化图表
function initPlot() {
    const data = generateData();
    
    const trace = {
        x: data.x,
        y: data.y,
        type: 'histogram2dcontour',
        colorscale: 'Viridis',
        reversescale: false,
        showscale: true,
        contours: {
            coloring: 'heatmap'
        }
    };

    const layout = {
        title: 'Histogram Contour Plot',
        dragmode: 'pan',
        hovermode: 'closest'
    };

    const config = {
        responsive: true,
        scrollZoom: true,
        displayModeBar: false,  // 禁用工具栏显示
        displaylogo: false      // 禁用 Plotly logo
    };

    Plotly.newPlot('plot', [trace], layout, config);

    // 添加事件监听器
    setupEventListeners();
}

// 设置事件监听器
function setupEventListeners() {
    const plot = document.getElementById('plot');
    
    document.getElementById('drawLine').onclick = () => {
        currentMode = 'line';
        isDrawing = true;
        currentPoints = [];
        // 修改鼠标样式
        plot.style.cursor = 'crosshair';
        // 禁用拖动
        Plotly.relayout('plot', { dragmode: false });
    };

    document.getElementById('drawPolygon').onclick = () => {
        currentMode = 'polygon';
        isDrawing = true;
        currentPoints = [];
        // 修改鼠标样式
        plot.style.cursor = 'crosshair';
        // 禁用拖动
        Plotly.relayout('plot', { dragmode: false });
    };

    document.getElementById('clear').onclick = clearShapes;
    document.getElementById('updateAllLines').onclick = updateAllLines;
    document.getElementById('updateAllPolygons').onclick = updateAllPolygons;
    document.getElementById('updateSingleLine').onclick = updateSingleLine;

    // 替换点击事件为鼠标点击事件
    plot.addEventListener('click', function(e) {
        if (!isDrawing) return;

        // const rect = plot.getBoundingClientRect();
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 转换像素坐标到数据坐标
        const xaxis = plot._fullLayout.xaxis;
        const yaxis = plot._fullLayout.yaxis;
        const dataX = xaxis.p2d(x);
        const dataY = yaxis.p2d(y);

        currentPoints.push({ x: dataX, y: dataY });
        updateDrawing();
    });

    // 右键点击完成绘制
    plot.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        if (isDrawing && currentPoints.length >= 2) {
            finishDrawing();
            // 恢复鼠标样式和拖动模式
            plot.style.cursor = '';
            Plotly.relayout('plot', { dragmode: 'pan' });
        }
    });

    // 添加鼠标移动事件以显示预览线
    plot.addEventListener('mousemove', function(e) {
        if (!isDrawing || currentPoints.length === 0) return;

        // const rect = plot.getBoundingClientRect();
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xaxis = plot._fullLayout.xaxis;
        const yaxis = plot._fullLayout.yaxis;
        const dataX = xaxis.p2d(x);
        const dataY = yaxis.p2d(y);

        updateDrawingWithPreview(dataX, dataY);
    });
}

// 添加带预览的更新绘制函数
function updateDrawingWithPreview(previewX, previewY) {
    if (currentPoints.length === 0) return;

    const points = [...currentPoints, { x: previewX, y: previewY }];
    let path = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x},${points[i].y}`;
    }

    if (currentMode === 'polygon' && points.length > 2) {
        path += ' Z';
    }

    const shapes = [...allShapes.map(shape => ({
        type: 'path',
        path: generatePathFromShape(shape),
        line: { color: 'red', width: 2 },
        fillcolor: shape.type === 'polygon' ? 'rgba(255, 0, 0, 0.2)' : undefined,
        fill: shape.type === 'polygon' ? 'toself' : undefined
    })), {
        type: 'path',
        path: path,
        line: { 
            color: 'red', 
            width: 2,
            dash: 'dash' // 预览线使用虚线
        },
        fillcolor: currentMode === 'polygon' ? 'rgba(255, 0, 0, 0.1)' : undefined,
        fill: currentMode === 'polygon' ? 'toself' : undefined
    }];

    Plotly.relayout('plot', { shapes: shapes });
}

// 修改 updateDrawing 函数
function updateDrawing() {
    if (currentPoints.length < 2) return;

    let path = `M ${currentPoints[0].x},${currentPoints[0].y}`;
    
    for (let i = 1; i < currentPoints.length; i++) {
        path += ` L ${currentPoints[i].x},${currentPoints[i].y}`;
    }

    if (currentMode === 'polygon' && currentPoints.length > 2) {
        path += ' Z';
    }

    const shapes = [...allShapes.map(shape => ({
        type: 'path',
        path: generatePathFromShape(shape),
        line: { color: 'red', width: 2 },
        fillcolor: shape.type === 'polygon' ? 'rgba(255, 0, 0, 0.2)' : undefined,
        fill: shape.type === 'polygon' ? 'toself' : undefined
    })), {
        type: 'path',
        path: path,
        line: { color: 'red', width: 2 },
        fillcolor: currentMode === 'polygon' ? 'rgba(255, 0, 0, 0.2)' : undefined,
        fill: currentMode === 'polygon' ? 'toself' : undefined
    }];

    Plotly.relayout('plot', { shapes: shapes });
}

// 完成绘制
function finishDrawing() {
    if (currentPoints.length < 2) return;

    const shape = {
        type: currentMode,
        points: [...currentPoints]
    };

    allShapes.push(shape);
    isDrawing = false;
    currentPoints = [];
    redrawAllShapes();
}

// 重绘所有图形
function redrawAllShapes() {
    const shapes = allShapes.map(shape => ({
        type: 'path',
        path: generatePathFromShape(shape),
        line: { color: 'red', width: 2 },
        fillcolor: shape.type === 'polygon' ? 'rgba(255, 0, 0, 0.2)' : undefined,
        fill: shape.type === 'polygon' ? 'toself' : undefined
    }));

    Plotly.relayout('plot', { shapes: shapes });
}

// 生成路径
function generatePath() {
    if (currentPoints.length < 2) return '';
    
    let path = `M ${currentPoints[0].x},${currentPoints[0].y}`;
    for (let i = 1; i < currentPoints.length; i++) {
        path += ` L ${currentPoints[i].x},${currentPoints[i].y}`;
    }
    
    if (currentMode === 'polygon') {
        path += ' Z';
    }
    
    return path;
}

// 从形状生成路径
function generatePathFromShape(shape) {
    const points = shape.points;
    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x},${points[i].y}`;
    }
    if (shape.type === 'polygon') {
        path += ' Z';
    }
    return path;
}

// 清除所有图形
function clearShapes() {
    allShapes = [];
    Plotly.relayout('plot', { shapes: [] });
}

// 更新所有线段样式
function updateAllLines() {
    allShapes = allShapes.map(shape => {
        if (shape.type === 'line') {
            shape.style = {
                color: `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`,
                width: Math.random() * 5 + 1,
                dash: ['solid', 'dot', 'dash'][Math.floor(Math.random() * 3)]
            };
        }
        return shape;
    });
    redrawAllShapes();
}

// 更新所有多边形样式
function updateAllPolygons() {
    allShapes = allShapes.map(shape => {
        if (shape.type === 'polygon') {
            shape.style = {
                lineColor: `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`,
                fillColor: `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},0.2)`,
                width: Math.random() * 5 + 1,
                dash: ['solid', 'dot', 'dash'][Math.floor(Math.random() * 3)]
            };
        }
        return shape;
    });
    redrawAllShapes();
}

// 更新单个线段样式
function updateSingleLine() {
    // 这里可以添加交互式选择线段的逻辑
    if (allShapes.length > 0) {
        const randomIndex = Math.floor(Math.random() * allShapes.length);
        if (allShapes[randomIndex].type === 'line') {
            allShapes[randomIndex].style = {
                color: `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`,
                width: Math.random() * 5 + 1,
                dash: ['solid', 'dot', 'dash'][Math.floor(Math.random() * 3)]
            };
        }
        redrawAllShapes();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', initPlot); 