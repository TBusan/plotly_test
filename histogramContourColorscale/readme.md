# plotly_test
使用plotly库的一些深度集成测试    直方图等值线

1，使用plotly.js创建一个二维平面的直方图等值，模拟的数据多一点有5000个点左右来模拟。用webgl实现渲染。
2，页面内有两个按钮，点击之后就进入绘制状态，可以在plotly.js渲染的整体区域内进行鼠标点击绘制，一个按钮是绘制折线，一个按钮是绘制多边形。
3，步骤2中的绘制，需要保证鼠标点击的位置与渲染出来的图形的位置一致，且鼠标右键表示绘制结束，且退出绘制状态。
4，绘制的线与面都保存在一个图层之中。
5，页面内还有一个清除按钮，点击之后可以将绘制的内容清除。且只针对该绘制的对象进行清除。
6，页面内还有一个更改全部线段样式按钮，点击之后可以将绘制的线段内容的样式进行全局更改，包括颜色，线宽，线型等。
7，页面内还有一个更改全部面样式按钮，点击之后可以将绘制的面的内容的样式进行全局更改，包括颜色，填充颜色，线宽，线型等。
8，页面内有一个更改局部颜色按钮，点击之后可以对绘制的线段中的某一个线段进行样式的更改，不影响其他线段。