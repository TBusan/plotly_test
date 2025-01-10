// 生成梯形区域的散点数据
function generateData() {
    const points = 200;  // 散点数量
    const x = [];
    const y = [];
    const values = [];  // 用于颜色映射的值

    // 生成梯形的四个顶点
    const trapezoid = {
        bottomLeft: { x: 0, y: 0 },
        bottomRight: { x: 100, y: 0 },
        topLeft: { x: 20, y: 80 },
        topRight: { x: 80, y: 80 }
    };

    // 生成梯形内的随机点
    for (let i = 0; i < points; i++) {
        // 使用参数方程生成梯形内的随机点
        const t = Math.random();  // 高度参数 [0,1]
        const s = Math.random();  // 水平参数 [0,1]

        // 在当前高度计算左右边界
        const leftX = trapezoid.bottomLeft.x + (trapezoid.topLeft.x - trapezoid.bottomLeft.x) * t;
        const rightX = trapezoid.bottomRight.x + (trapezoid.topRight.x - trapezoid.bottomRight.x) * t;
        const y_val = trapezoid.bottomLeft.y + (trapezoid.topLeft.y - trapezoid.bottomLeft.y) * t;

        // 在左右边界之间插值
        const x_val = leftX + (rightX - leftX) * s;

        x.push(x_val);
        y.push(y_val);

        // 生成值用于颜色映射 (这里使用位置相关的值)
        const value = Math.sin(x_val / 20) * Math.cos(y_val / 20) * 50 + 50;
        values.push(value);
    }

    return { x, y, values };
}

function initSymblo(size) {
    // size 参数控制符号大小
    let r = Math.sqrt(size / Math.PI);
    // 返回 SVG path 字符串，定义一个星形
    return "M" + (0) + "," + (-r) + 
           "L" + (r*0.3) + "," + (-r*0.3) + 
           "L" + (r) + "," + (-r*0.3) + 
           "L" + (r*0.5) + "," + (r*0.1) + 
           "L" + (r*0.6) + "," + (r) + 
           "L" + (0) + "," + (r*0.5) + 
           "L" + (-r*0.6) + "," + (r) + 
           "L" + (-r*0.5) + "," + (r*0.1) + 
           "L" + (-r) + "," + (-r*0.3) + 
           "L" + (-r*0.3) + "," + (-r*0.3) + 
           "Z";
}

function initPlot() {
    const data = generateData();

 
    // 注册自定义符号
// 定义自定义符号库
const CustomSymbols = {
    // 确保 path 字符串格式正确，移除多余的空格，使用绝对坐标
    star: 'M0,-5L1.5,-1.5L5,-1.5L2.5,1L3,5L0,2.5L-3,5L-2.5,1L-5,-1.5L-1.5,-1.5Z',
    
    // 简化的十字
    cross: 'path://M-5,0L5,0M0,-5L0,5',
    
    // 简化的菱形
    diamond: 'path://M0,-5L5,0L0,5L-5,0Z',
    
    // 简化的三角形
    triangle: 'path://M-5,4L5,4L0,-4Z'
};


    const trace = {
        type: 'scattergl',
        x: data.x,
        y: data.y,
        mode: 'markers',
        marker: {
            // 使用一个绝对定位的矩形路径
            // type: 'path',
            symbol: 'path://M -4,0 L -2,-3.5 L 2,-3.5 L 4,0 L 2,3.5 L -2,3.5 Z',
            // path: 'M -5 0 L -2.5 -4.33 L 2.5 -4.33 L 5 0 L 2.5 4.33 L -2.5 4.33 Z',
            // symbol: 'M -5 0 L -2.5 -4.33 L 2.5 -4.33 L 5 0 L 2.5 4.33 L -2.5 4.33 Z', //'path://M -0.866 0.5 L 0 -1 L 0.866 0.5 Z',
            // symbol: [
            //     CustomSymbols.star
            //     // CustomSymbols.cross,
            //     // CustomSymbols.diamondCross,
            //     // 'circle',  // 内置符号
            //     // CustomSymbols.triangle
            // ],
            size: 20,
            color: data.values,
            colorscale: 'Viridis',
            showscale: true,
            colorbar: {
                title: '值',
                titleside: 'right'
            }
        }
    };

    const layout = {
        title: '梯形区域散点图',
        xaxis: {
            title: 'X轴',
            zeroline: false
        },
        yaxis: {
            title: 'Y轴',
            zeroline: false
        },
        // xaxis: {
        //     // range: [0, 2]
        // },
        // yaxis: {
        //     // range: [0, 1],
        //     scaleanchor: 'x',
        //     scaleratio: 1
        // },
        showlegend: false,
        hovermode: 'closest'
    };

    const config = {
        responsive: true,
        displayModeBar: false
    };

    Plotly.newPlot('plot', [trace], layout, config);
}

// 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', initPlot); 