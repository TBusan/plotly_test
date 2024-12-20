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
let isSelectMode = false;  // 添加选择模式状态标志
let currentMousePosition = null;
let drawingRecords = {
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
            size: 10,
            symbol: 'square',
            line: {
                width: 1,
                color: 'rgba(0,0,0,0.3)'
            }
        }
    }];

    layout = {
        dragmode: 'pan',
        hovermode: 'closest',
        showlegend: false,
        xaxis: {
            autorange: true,
            showgrid: true,
            zeroline: true,
            showline: true,
            scaleanchor: 'y',
            constrain: 'domain',
            constraintoward: 'center'
        },
        yaxis: {
            autorange: true,
            showgrid: true,
            zeroline: true,
            showline: true,
            scaleanchor: 'x',
            constrain: 'domain',
            constraintoward: 'center'
        }
    };

    const config = {
        scrollZoom: true,
        displayModeBar: true,
        modeBarButtonsToAdd: ['zoom2d', 'pan2d', 'resetScale2d']
    };

    Plotly.newPlot('plot', data, layout, config).then(() => {
        // 在图表完全加载后设置默认鼠标样式
        const plot = document.getElementById('plot');
        plot.classList.add('default-cursor');
        const mainSvg = plot.querySelector('.main-svg');
        if (mainSvg) {
            mainSvg.style.cursor = 'move';
        }
    });

    // 修改点击事件监听器
document.getElementById('plot').on('plotly_click', function(eventData) {
    if (!isSelectMode || drawingMode) return;
    
    const pointIndex = eventData.points[0].pointIndex;
    
    if (selectedPoints.has(pointIndex)) {
        selectedPoints.delete(pointIndex);
    } else {
        selectedPoints.add(pointIndex);
    }

    // 更新选中点的样式
    const lineWidths = new Array(data[0].x.length).fill(1);
    const lineColors = new Array(data[0].x.length).fill('rgba(0,0,0,0.3)');
    
    selectedPoints.forEach(index => {
        lineWidths[index] = 3;  // 加粗边框
        lineColors[index] = 'red';  // 边框改为红色
    });

    Plotly.restyle('plot', {
        'marker.line.width': [lineWidths],
        'marker.line.color': [lineColors]
    }, [0]);
});

}



// 2. 选择模式
document.getElementById('selectMode').addEventListener('click', function() {
    const plot = document.getElementById('plot');
    plot.classList.remove('default-cursor');
    plot.classList.remove('drawing-cursor');
    plot.classList.add('select-cursor');
    drawingMode = null;
    isSelectMode = true;
    
    // 强制更新鼠标样式
    const mainSvg = plot.querySelector('.main-svg');
    if (mainSvg) {
        mainSvg.style.cursor = 'default';
    }
    
    Plotly.relayout('plot', {
        dragmode: 'pan'
    });
});

// 修改退出选择模式按钮的处理函数
document.getElementById('exitSelectMode').addEventListener('click', function() {
    const plot = document.getElementById('plot');
    plot.classList.remove('select-cursor');
    plot.classList.add('default-cursor');
    isSelectMode = false;
    
    // 强制更新鼠标样式
    const mainSvg = plot.querySelector('.main-svg');
    if (mainSvg) {
        mainSvg.style.cursor = 'move';
    }
    
    selectedPoints.clear();
    updatePlot();
    
    Plotly.relayout('plot', {
        dragmode: 'pan'
    });
});

// 3 & 4. 隐藏和显示点
document.getElementById('hidePoints').addEventListener('click', function() {
    if (selectedPoints.size === 0) return; // 如果没有选中的点直接返回
    
    // 将选中的点添加到隐藏集合中
    selectedPoints.forEach(index => {
        hiddenPoints.add(index);
    });
    
    // 清空选中的点
    selectedPoints.clear();
    
    // 更新整个图表
    updatePlot();
});

document.getElementById('showPoints').addEventListener('click', function() {
    if (hiddenPoints.size === 0) return; // 如果没有隐藏的点，直接返回
    
    // 清空隐藏的点集合
    hiddenPoints.clear();
    
    // 更新整个图表
    updatePlot();
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
    plot.classList.remove('default-cursor');
    plot.classList.remove('select-cursor');
    plot.classList.add('drawing-cursor');
    
    // 强制更新鼠标样式
    const mainSvg = plot.querySelector('.main-svg');
    if (mainSvg) {
        mainSvg.style.cursor = 'crosshair';
    }
    
    currentDrawing = [];
    currentMousePosition = null;
    
    Plotly.relayout('plot', {
        dragmode: false
    });
}

// 7. 处理绘制事件
document.getElementById('plot').addEventListener('click', function(event) {
    if (!drawingMode) return;
    
    // 如果是右键点击，结束绘制
    if (event.button === 2) {
        finishDrawing();
        return;
    }
    
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

// 添加右键事件监听器
document.getElementById('plot').addEventListener('contextmenu', function(event) {
    event.preventDefault(); // 止默认的右键菜单
    
    if (!drawingMode) return;
    
    finishDrawing();
});

// 添加完成绘制的函数
function finishDrawing() {
    if (currentDrawing.length < 2) {
        currentDrawing = [];
        drawingMode = null;
        currentMousePosition = null;
        return;
    }
    
    const points = currentDrawing.map(p => ({x: parseFloat(p[0].toFixed(2)), y: parseFloat(p[1].toFixed(2))}));
    const record = {
        type: drawingMode,
        points: points,
        timestamp: new Date().toLocaleString()
    };

    // 根据类型添加长度或面积
    if (drawingMode === 'line') {
        record.length = calculateLineLength(points);
    } else if (drawingMode === 'polygon') {
        record.area = calculatePolygonArea(points);
    }
    
    // 根据绘制模式保存图形
    if (drawingMode === 'line') {
        drawings.lines.push({
            points: [...currentDrawing],
            style: {
                color: 'rgb(0,0,255)',
                width: 2,
                dash: 'solid'
            }
        });
        drawingRecords.lines.push(record);
    } else if (drawingMode === 'polygon') {
        drawings.polygons.push({
            points: [...currentDrawing],
            style: {
                fillcolor: 'rgba(0,0,255,0.2)',
                linecolor: 'rgb(0,0,255)',
                linewidth: 2
            }
        });
        drawingRecords.polygons.push(record);
    }
    
    // 更新信息显示
    updateInfoPanel();
    
    // 重置绘制状态
    currentDrawing = [];
    drawingMode = null;
    currentMousePosition = null;
    
    // 更新图表显示
    updatePlot();
    
    // 重置鼠标样式和拖动模式
    const plot = document.getElementById('plot');
    plot.classList.remove('drawing-cursor');
    Plotly.relayout('plot', {
        dragmode: 'pan'
    });
}

// 添加计算折线长度的函数
function calculateLineLength(points) {
    let totalLength = 0;
    for (let i = 0; i < points.length - 1; i++) {
        const dx = points[i + 1].x - points[i].x;
        const dy = points[i + 1].y - points[i].y;
        totalLength += Math.sqrt(dx * dx + dy * dy);
    }
    return totalLength.toFixed(2);
}

// 添加计算多边形面积的函数
function calculatePolygonArea(points) {
    let area = 0;
    for (let i = 0; i < points.length; i++) {
        const j = (i + 1) % points.length;
        area += points[i].x * points[j].y;
        area -= points[j].x * points[i].y;
    }
    area = Math.abs(area) / 2;
    return area.toFixed(2);
}

// 修改 updateInfoPanel 函数
function updateInfoPanel() {
    const infoDiv = document.getElementById('info');
    let html = '<div style="padding: 10px; overflow-y: auto; height: 100%;">';
    
    // 添加折线记录
    if (drawingRecords.lines.length > 0) {
        html += '<h3>折线记录：</h3>';
        drawingRecords.lines.forEach((record, index) => {
            html += `
                <div style="margin-bottom: 10px; padding: 5px; border: 1px solid #eee;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>折线 ${index + 1}</strong>
                        <div>
                            <button onclick="locateDrawing('line', ${index})" class="action-btn">定位</button>
                            <button onclick="updateDrawingStyle('line', ${index})" class="action-btn">更改样式</button>
                            <button onclick="deleteDrawing('line', ${index})" class="action-btn delete-btn">删除</button>
                        </div>
                    </div>
                    <div style="margin-top: 5px;">
                        时间：${record.timestamp}<br>
                        点数：${record.points.length}<br>
                        总长度：${record.length} 单位<br>
                        点坐标：<br>
                        ${record.points.map((p, i) => `点${i + 1}: (${p.x}, ${p.y})`).join('<br>')}
                    </div>
                </div>
            `;
        });
    }
    
    // 添加多边形记录
    if (drawingRecords.polygons.length > 0) {
        html += '<h3>多边形记录：</h3>';
        drawingRecords.polygons.forEach((record, index) => {
            html += `
                <div style="margin-bottom: 10px; padding: 5px; border: 1px solid #eee;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>多边形 ${index + 1}</strong>
                        <div>
                            <button onclick="locateDrawing('polygon', ${index})" class="action-btn">定位</button>
                            <button onclick="updateDrawingStyle('polygon', ${index})" class="action-btn">更改样式</button>
                            <button onclick="deleteDrawing('polygon', ${index})" class="action-btn delete-btn">删除</button>
                        </div>
                    </div>
                    <div style="margin-top: 5px;">
                        时间：${record.timestamp}<br>
                        顶点数：${record.points.length}<br>
                        面积：${record.area} 平方单位<br>
                        顶点坐标：<br>
                        ${record.points.map((p, i) => `顶点${i + 1}: (${p.x}, ${p.y})`).join('<br>')}
                    </div>
                </div>
            `;
        });
    }
    
    html += '</div>';
    infoDiv.innerHTML = html;
}

// 添加删除绘制的函数
function deleteDrawing(type, index) {
    if (type === 'line') {
        drawings.lines.splice(index, 1);
        drawingRecords.lines.splice(index, 1);
    } else if (type === 'polygon') {
        drawings.polygons.splice(index, 1);
        drawingRecords.polygons.splice(index, 1);
    }
    updatePlot();
    updateInfoPanel();
}

// 添加定位绘制的函数
function locateDrawing(type, index) {
    let points;
    if (type === 'line') {
        points = drawings.lines[index].points;
    } else if (type === 'polygon') {
        points = drawings.polygons[index].points;
    }

    // 计算绘制内容的边界框
    const xCoords = points.map(p => p[0]);
    const yCoords = points.map(p => p[1]);
    const xMin = Math.min(...xCoords);
    const xMax = Math.max(...xCoords);
    const yMin = Math.min(...yCoords);
    const yMax = Math.max(...yCoords);

    // 设置视图以显示绘制内容（添加一些边距）
    const margin = 10;
    Plotly.relayout('plot', {
        'xaxis.range': [xMin - margin, xMax + margin],
        'yaxis.range': [yMin - margin, yMax + margin]
    });
}

// 添加更新绘制样式的函数
function updateDrawingStyle(type, index) {
    if (type === 'line') {
        const newStyle = {
            color: `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`,
            width: Math.random() * 5 + 1,
            dash: ['solid', 'dot', 'dash'][Math.floor(Math.random() * 3)]
        };
        drawings.lines[index].style = {...drawings.lines[index].style, ...newStyle};
    } else if (type === 'polygon') {
        const newStyle = {
            fillcolor: `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},0.3)`,
            linecolor: `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`,
            linewidth: Math.random() * 5 + 1
        };
        drawings.polygons[index].style = {...drawings.polygons[index].style, ...newStyle};
    }
    updatePlot();
}

// 8. 清除按钮
document.getElementById('clear').addEventListener('click', function() {
    drawings.lines = [];
    drawings.polygons = [];
    drawingRecords.lines = [];
    drawingRecords.polygons = [];
    updatePlot();
    updateInfoPanel();
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
    const sizes = data[0].x.map((_, i) => hiddenPoints.has(i) ? 0 : 10);
    const lineWidths = new Array(data[0].x.length).fill(1);
    const lineColors = new Array(data[0].x.length).fill('rgba(0,0,0,0.3)');
    
    selectedPoints.forEach(index => {
        if (!hiddenPoints.has(index)) {
            lineWidths[index] = 3;
            lineColors[index] = 'red';
        }
    });

    Plotly.restyle('plot', {
        'marker.size': [sizes],
        'marker.line.width': [lineWidths],
        'marker.line.color': [lineColors]
    }, [0]);
}

function updateDrawing() {
    if (currentDrawing.length < 1) return;
    
    let traceX = currentDrawing.map(p => p[0]);
    let traceY = currentDrawing.map(p => p[1]);
    
    // 添加当前鼠标位置的预览线
    if (currentMousePosition) {
        traceX = [...traceX, currentMousePosition[0]];
        traceY = [...traceY, currentMousePosition[1]];
    }
    
    // 如果是多边形模式且有超过2个点，添加到起始点的预览线
    if (drawingMode === 'polygon' && currentDrawing.length > 2) {
        traceX.push(currentDrawing[0][0]);
        traceY.push(currentDrawing[0][1]);
    }
    
    const trace = {
        type: 'scatter',
        mode: 'lines+markers',
        x: traceX,
        y: traceY,
        line: { 
            color: 'red', 
            width: 2,
            dash: currentMousePosition ? 'dash' : 'solid' // 预览线使用虚线
        },
        marker: { 
            color: 'red', 
            size: 8 
        }
    };
    
    // 更新图表，保持之前的所有内容
    updatePlot();
    Plotly.addTraces('plot', trace);
}

function updatePlot() {
    // 创建边框样式数组
    const lineWidths = new Array(data[0].x.length).fill(1);
    const lineColors = new Array(data[0].x.length).fill('rgba(0,0,0,0.3)');
    
    selectedPoints.forEach(index => {
        if (!hiddenPoints.has(index)) {
            lineWidths[index] = 3;
            lineColors[index] = 'red';
        }
    });

    // 更新基础散点图的数据
    const baseTrace = {
        ...data[0],
        marker: {
            ...data[0].marker,
            size: data[0].x.map((_, i) => hiddenPoints.has(i) ? 0 : 10),
            line: {
                width: lineWidths,
                color: lineColors
            }
        }
    };

    const traces = [baseTrace];
    
    // 添加线段和多边形
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

// 添加鼠标移动事件监听器
document.getElementById('plot').addEventListener('mousemove', function(event) {
    if (!drawingMode || currentDrawing.length === 0) return;
    
    const plotRect = event.target.getBoundingClientRect();
    const x = event.clientX - plotRect.left;
    const y = event.clientY - plotRect.top;
    
    // 转换坐标到数据空间
    const xaxis = plot._fullLayout.xaxis;
    const yaxis = plot._fullLayout.yaxis;
    const dataX = xaxis.p2d(x);
    const dataY = yaxis.p2d(y);
    
    currentMousePosition = [dataX, dataY];
    updateDrawing();
});

// 初始化
createScatterPlot(); 