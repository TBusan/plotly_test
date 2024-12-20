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
        dragmode: 'pan',
        hovermode: 'closest',
        showlegend: false
    };

    Plotly.newPlot('plot', data, layout);

    // 添加点击事件监听器
    document.getElementById('plot').on('plotly_click', function(eventData) {
        if (!drawingMode) {  // 只在非绘制模式下处理点击选择
            const pointIndex = eventData.points[0].pointIndex;
            
            if (selectedPoints.has(pointIndex)) {
                selectedPoints.delete(pointIndex);
            } else {
                selectedPoints.add(pointIndex);
            }

            // 更新选中点的样式
            const selectedStyle = new Array(data[0].x.length).fill(false);
            selectedPoints.forEach(index => {
                selectedStyle[index] = true;
            });

            Plotly.restyle('plot', {
                'marker.color': [selectedStyle.map((isSelected, i) => 
                    isSelected ? 'red' : data[0].marker.color[i]
                )],
                'marker.size': [selectedStyle.map(isSelected => 
                    isSelected ? 12 : 10
                )]
            }, [0]);
        }
    });
}

// 2. 选择模式
document.getElementById('selectMode').addEventListener('click', function() {
    const plot = document.getElementById('plot');
    plot.classList.add('select-cursor');
    plot.classList.remove('drawing-cursor');
    drawingMode = null;
    
    // ���布局为非绘制模式
    Plotly.relayout('plot', {
        dragmode: 'pan'
    });
});

// 3 & 4. 隐藏和显示点
document.getElementById('hidePoints').addEventListener('click', function() {
    if (selectedPoints.size === 0) return; // 如果没有选中的点，直接返回
    
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
    plot.classList.add('drawing-cursor');
    plot.classList.remove('select-cursor');
    currentDrawing = [];
    
    // 更改布局为绘制模式
    Plotly.relayout('plot', {
        dragmode: false  // 禁用拖动以便绘制
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
    event.preventDefault(); // 阻止默认的右键菜单
    
    if (!drawingMode) return;
    
    finishDrawing();
});

// 添加完成绘制的函数
function finishDrawing() {
    if (currentDrawing.length < 2) {
        // 如果点数不足，取消绘制
        currentDrawing = [];
        drawingMode = null;
        return;
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
    } else if (drawingMode === 'polygon') {
        drawings.polygons.push({
            points: [...currentDrawing],
            style: {
                fillcolor: 'rgba(0,0,255,0.2)',
                linecolor: 'rgb(0,0,255)',
                linewidth: 2
            }
        });
    }
    
    // 重置绘制状态
    currentDrawing = [];
    drawingMode = null;
    
    // 更新图表显示
    updatePlot();
    
    // 重置鼠标样式和拖动模式
    const plot = document.getElementById('plot');
    plot.classList.remove('drawing-cursor');
    Plotly.relayout('plot', {
        dragmode: 'pan'
    });
}

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
    // 创建一个新的颜色数组，隐藏的点设置为透明
    const colors = data[0].x.map((_, i) => {
        if (hiddenPoints.has(i)) {
            return 'rgba(0,0,0,0)'; // 完全透明
        }
        return selectedPoints.has(i) ? 'red' : data[0].marker.color[i];
    });

    // 创建一个新的大小数组
    const sizes = data[0].x.map((_, i) => {
        if (hiddenPoints.has(i)) {
            return 0; // 隐藏的点大小设为0
        }
        return selectedPoints.has(i) ? 12 : 10;
    });

    // 更新点的样式
    Plotly.restyle('plot', {
        'marker.color': [colors],
        'marker.size': [sizes]
    }, [0]);
}

function updateDrawing() {
    if (currentDrawing.length < 2) return;
    
    const trace = {
        type: 'scatter',
        mode: 'lines+markers',  // 添加markers以显示点
        x: currentDrawing.map(p => p[0]),
        y: currentDrawing.map(p => p[1]),
        line: { color: 'red', width: 2 },
        marker: { color: 'red', size: 8 }  // 添加点的样式
    };
    
    // 如果是多边形模式，添加闭合线
    if (drawingMode === 'polygon' && currentDrawing.length > 2) {
        trace.x.push(currentDrawing[0][0]);
        trace.y.push(currentDrawing[0][1]);
    }
    
    // 更新图表，保持之前的所有内容
    updatePlot();
    Plotly.addTraces('plot', trace);
}

function updatePlot() {
    // 创建基础散点图的颜色和大小数组
    const colors = data[0].x.map((_, i) => {
        if (hiddenPoints.has(i)) {
            return 'rgba(0,0,0,0)'; // 完全透明
        }
        return selectedPoints.has(i) ? 'red' : data[0].marker.color[i];
    });

    const sizes = data[0].x.map((_, i) => {
        if (hiddenPoints.has(i)) {
            return 0; // 隐藏的点大小设为0
        }
        return selectedPoints.has(i) ? 12 : 10;
    });

    // 更新基础散点图的数据
    const baseTrace = {
        ...data[0],
        marker: {
            ...data[0].marker,
            color: colors,
            size: sizes
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

// 初始化
createScatterPlot(); 