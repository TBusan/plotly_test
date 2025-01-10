let isDrawing = false;
let currentMode = null;
let currentPoints = [];
let allShapes = [];
let selectedShapeIndex = -1;

// 添加预定义的颜色配置方案
const colorScales = [
    'Viridis',     // 默认
    'Plasma',      // 紫橙色渐变
    'Inferno',     // 黑红黄渐变
    'Magma',       // 黑紫黄渐变
    'RdBu',        // 红蓝渐变
    'Jet',         // 彩虹色
    'Hot',         // 热力图
    'Portland',    // 紫绿渐变
    'Electric',    // 电力图
    'Earth'        // 地球色系
];

let currentColorScaleIndex = 0;

// 添加全局变量
let mainPlot = null;
let overviewPlot = null;

// 生成模拟数据 (5000个点)
function generateData() {
    const x = [];
    const y = [];
    const values = [];  // 添加 value 数组
    
    for (let i = 0; i < 10000; i++) {
        x.push(Math.random() * 100);
        y.push(Math.random() * 100);
        // 生成1-100的随机值
        values.push(Math.floor(Math.random() * 100) + 1);
    }
    return { x, y, values };
    // return { x:mockDataX, y:mockDataZ, values:mockDataV };
}

// 初始化图表
function initPlot() {
    const data = generateData();
    
    // 主图表配置
    const trace = {
        x: data.x,
        y: data.y,
        type: 'histogram2dcontour',
        colorscale: colorScales[currentColorScaleIndex],
        reversescale: false,
        showscale: true,
        z: data.values,  // 使用 values 作为颜色深浅的依据
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
        displayModeBar: false,
        displaylogo: false
    };

    // 鹰眼图表配置
    const overviewTrace = {
        ...trace,
        showscale: false,  // 不显示颜色条
        z: data.values     // 确保鹰眼图也使用相同的值
    };

    const overviewLayout = {
        dragmode: false,
        showlegend: false,
        margin: { l: 20, r: 20, t: 20, b: 20 },
        xaxis: {
            showgrid: false,
            zeroline: false,
            showticklabels: false
        },
        yaxis: {
            showgrid: false,
            zeroline: false,
            showticklabels: false
        }
    };

    const overviewConfig = {
        responsive: true,
        displayModeBar: false,
        displaylogo: false,
        staticPlot: true  // 禁用所有交互
    };

    // 创建主图表和鹰眼图表
    Plotly.newPlot('plot', [trace], layout, config).then(function(gd) {
        mainPlot = gd;
        // 监听主图表的范围变化
        mainPlot.on('plotly_relayout', updateOverviewBox);
    });

    Plotly.newPlot('overview', [overviewTrace], overviewLayout, overviewConfig).then(function(gd) {
        overviewPlot = gd;
    });

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
    document.getElementById('updateColorScale').onclick = updateColorScale;

    // 替换点击事件为鼠标点击事件
    plot.addEventListener('click', function(e) {
        if (isDrawing) {
            // 如果正在绘制，执行原有的绘制逻辑
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xaxis = plot._fullLayout.xaxis;
            const yaxis = plot._fullLayout.yaxis;
            const dataX = xaxis.p2d(x);
            const dataY = yaxis.p2d(y);

            currentPoints.push({ x: dataX, y: dataY });
            updateDrawing();
        } else {
            // 如果不在绘制状态，检查是否点击到了图形
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xaxis = plot._fullLayout.xaxis;
            const yaxis = plot._fullLayout.yaxis;
            const dataX = xaxis.p2d(x);
            const dataY = yaxis.p2d(y);

            checkShapeSelection({ x: dataX, y: dataY });
        }
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

    // 添加鹰眼的初始化
    const mainPlotDiv = document.getElementById('plot');
    mainPlotDiv.on('plotly_relayout', updateOverviewBox);
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
        points: [...currentPoints],
        style: currentMode === 'polygon' ? {
            color: 'red',
            width: 2,
            fillcolor: 'rgba(255, 0, 0, 0.2)'
        } : {
            color: 'red',
            width: 2,
            dash: 'solid'
        }
    };

    allShapes.push(shape);
    isDrawing = false;
    currentPoints = [];
    redrawAllShapes();
}

// 重绘所有图形
function redrawAllShapes() {
    const shapes = allShapes.map((shape, index) => {
        const isSelected = index === selectedShapeIndex;
        const baseStyle = shape.style || {};
        
        return {
            type: 'path',
            path: generatePathFromShape(shape),
            line: {
                color: isSelected ? '#ff0000' : (baseStyle.color || 'red'),
                width: isSelected ? (baseStyle.width || 2) + 2 : (baseStyle.width || 2),
                dash: baseStyle.dash || 'solid'
            },
            fillcolor: shape.type === 'polygon' ? 
                (isSelected ? 'rgba(255,0,0,0.4)' : (baseStyle.fillcolor || 'rgba(255,0,0,0.2)')) : 
                undefined,
            fill: shape.type === 'polygon' ? 'toself' : undefined
        };
    });

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
                color: `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`,
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
            const r = Math.floor(Math.random()*255);
            const g = Math.floor(Math.random()*255);
            const b = Math.floor(Math.random()*255);
            shape.style = {
                color: `rgb(${r},${g},${b})`,
                width: Math.random() * 5 + 1,
                fillcolor: `rgba(${r},${g},${b},0.2)`
            };
        }
        return shape;
    });
    redrawAllShapes();
}

// 更新单个线段样式
function updateSingleLine() {
    const lineShapes = allShapes.filter(shape => shape.type === 'line');
    if (lineShapes.length === 0) return;

    // 随机选择一个线段
    const randomIndex = Math.floor(Math.random() * lineShapes.length);
    const actualIndex = allShapes.findIndex(shape => shape === lineShapes[randomIndex]);

    // 更新样式
    allShapes[actualIndex].style = {
        color: `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`,
        width: Math.random() * 5 + 1,
        dash: ['solid', 'dot', 'dash'][Math.floor(Math.random() * 3)]
    };

    redrawAllShapes();
}

// 添加更新颜色配置的函数
function updateColorScale() {
    // 循环切换颜色配置
    currentColorScaleIndex = (currentColorScaleIndex + 1) % colorScales.length;
    const newColorScale = colorScales[currentColorScaleIndex];
    
    // 更新图表的颜色配置
    Plotly.restyle('plot', {
        'colorscale': newColorScale
    });
}

// 添加检查图形选择的函数
function checkShapeSelection(point) {
    let minDistance = Infinity;
    let selectedIndex = -1;

    allShapes.forEach((shape, index) => {
        if (shape.type === 'line') {
            // 检查点到线段的距离
            for (let i = 0; i < shape.points.length - 1; i++) {
                const distance = pointToLineDistance(
                    point,
                    shape.points[i],
                    shape.points[i + 1]
                );
                if (distance < minDistance && distance < 5) { // 5是选择容差
                    minDistance = distance;
                    selectedIndex = index;
                }
            }
        } else if (shape.type === 'polygon') {
            // 检查点是否在多边形内
            if (isPointInPolygon(point, shape.points)) {
                selectedIndex = index;
                minDistance = 0;
            }
        }
    });

    // 更新选中状态并重绘
    selectedShapeIndex = selectedIndex;
    redrawAllShapes();
}

// 计算点到线段的距离
function pointToLineDistance(point, lineStart, lineEnd) {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) {
        param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
        xx = lineStart.x;
        yy = lineStart.y;
    } else if (param > 1) {
        xx = lineEnd.x;
        yy = lineEnd.y;
    } else {
        xx = lineStart.x + param * C;
        yy = lineStart.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;

    return Math.sqrt(dx * dx + dy * dy);
}

// 检查点是否在多边形内
function isPointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;

        const intersect = ((yi > point.y) !== (yj > point.y))
            && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// 添加更新鹰眼框的函数
function updateOverviewBox(eventData) {
    if (!eventData) return;
    
    // 获取主图表的当前范围
    const xaxis = mainPlot._fullLayout.xaxis;
    const yaxis = mainPlot._fullLayout.yaxis;
    
    // 获取完整的数据范围
    const fullXRange = [0, 100];  // 根据你的数据范围调整
    const fullYRange = [0, 100];
    
    // 如果发生了缩放
    if (eventData['xaxis.range[0]'] !== undefined || eventData['xaxis.autorange']) {
        const currentXRange = xaxis.range;
        const currentYRange = yaxis.range;
        
        // 创建表示当前视图的矩形
        const shapes = [{
            type: 'rect',
            x0: currentXRange[0],
            x1: currentXRange[1],
            y0: currentYRange[0],
            y1: currentYRange[1],
            fillcolor: 'rgba(255,255,255,0.3)',
            line: {
                color: 'rgb(255,0,0)',
                width: 1
            }
        }];
        
        // 更新鹰眼图表的范围和矩形
        Plotly.relayout(overviewPlot, {
            'shapes': shapes,
            'xaxis.range': fullXRange,
            'yaxis.range': fullYRange
        });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', initPlot); 
//     Plotly.restyle('plot', {
//         'colorscale': newColorScale
//     });
// }

// 初始化
document.addEventListener('DOMContentLoaded', initPlot); 