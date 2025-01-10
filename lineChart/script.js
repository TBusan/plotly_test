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

// 添加全局变量来跟踪状态
let isEditMode = false;
let currentSelectedPoint = null;  // 存储当前选中点的信息
let myPlot = null;

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
            symbol: 'circle',
            color: 'rgb(219, 64, 82)'  // 初始颜色
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
            symbol: 'circle',
            color: 'rgb(55, 128, 191)'  // 初始颜色
        }
    };

    const layout = {
        title: '折线图示例',
        dragmode: 'pan',
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
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['select2d', 'lasso2d'],
        scrollZoom: true
    };

    Plotly.newPlot('plot', [trace1, trace2], layout, config).then(function(gd) {
        myPlot = gd;
        setupEventListeners();
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 添加点击事件监听
    myPlot.on('plotly_click', function(data) {
        if (!isEditMode) return;  // 如果不在编辑模式，直接返回
        
        const pt = data.points[0];
        const curveNumber = pt.curveNumber;
        const pointIndex = pt.pointIndex;
        const newPoint = { curveNumber, pointIndex };

        // 如果点击的是当前选中的点，取消选中
        if (currentSelectedPoint && 
            currentSelectedPoint.curveNumber === curveNumber && 
            currentSelectedPoint.pointIndex === pointIndex) {
            updatePointColor(curveNumber, pointIndex, false);
            currentSelectedPoint = null;
        } 
        // 如果点击的是新的点
        else {
            // 如果之前有选中的点，先恢复其颜色
            if (currentSelectedPoint) {
                updatePointColor(
                    currentSelectedPoint.curveNumber,
                    currentSelectedPoint.pointIndex,
                    false
                );
            }
            // 高亮新选中的点
            updatePointColor(curveNumber, pointIndex, true);
            currentSelectedPoint = newPoint;
        }
    });

    // 添加键盘事件监听
    document.addEventListener('keydown', function(e) {
        if (!isEditMode || !currentSelectedPoint) return;
        
        // 监听 Delete 键
        if (e.key === 'Delete') {
            updatePointValue(
                currentSelectedPoint.curveNumber,
                currentSelectedPoint.pointIndex
            );
        }
    });
}

// 更新点的颜色
function updatePointColor(curveNumber, pointIndex, isSelected) {
    const trace = myPlot.data[curveNumber];
    const colors = Array.isArray(trace.marker.color) ? 
        [...trace.marker.color] : 
        Array(trace.x.length).fill(trace.marker.color);
    
    colors[pointIndex] = isSelected ? 'yellow' : trace.line.color;
    
    Plotly.restyle(myPlot, {
        'marker.color': [colors]
    }, [curveNumber]);
}

// 切换编辑模式
function toggleEditMode() {
    isEditMode = !isEditMode;
    
    // 更新布局和交互模式
    Plotly.relayout(myPlot, {
        'dragmode': isEditMode ? false : 'pan'
    });
    
    // 更新按钮状态
    document.getElementById('editButton').style.display = isEditMode ? 'none' : 'inline-block';
    document.getElementById('exitEditButton').style.display = isEditMode ? 'inline-block' : 'none';

    // 如果是退出编辑模式，清除选中的点
    if (!isEditMode) {
        clearSelection();
    }
}

// 清除所有选中的点
function clearSelection() {
    // 如果有选中的点，恢复其颜色
    if (currentSelectedPoint) {
        updatePointColor(
            currentSelectedPoint.curveNumber,
            currentSelectedPoint.pointIndex,
            false
        );
        currentSelectedPoint = null;
    }
}

// 添加更新点值的函数
function updatePointValue(curveNumber, pointIndex) {
    const trace = myPlot.data[curveNumber];
    const points = trace.y;
    let newValue;

    // 根据不同情况计算新值
    if (pointIndex === 0) {
        // 如果是第一个点，使用下一个点的值
        newValue = points[1];
    } else if (pointIndex === points.length - 1) {
        // 如果是最后一个点，使用前一个点的值
        newValue = points[pointIndex - 1];
    } else {
        // 其他情况，使用前后点的平均值
        newValue = (points[pointIndex - 1] + points[pointIndex + 1]) / 2;
    }

    // 创建新的y值数组
    const updatedY = [...points];
    updatedY[pointIndex] = newValue;

    // 更新图表
    Plotly.restyle(myPlot, {
        'y': [updatedY]
    }, [curveNumber]);

    // 保持点的选中状态和高亮显示
    updatePointColor(curveNumber, pointIndex, true);
}

// 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', function() {
    initPlot();
}); 