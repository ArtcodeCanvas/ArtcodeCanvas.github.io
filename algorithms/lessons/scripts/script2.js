var canvas = document.getElementById("myCanvas"); // 🎨 获取页面上的画布元素，让我们开始创作吧！
var ctx = canvas.getContext("2d"); // ✏️ 获取2D绘图环境，准备好画笔咯！
ctx.clearRect(0, 0, 500, 500); // 🧼 清除画布上的内容，为新绘制的图形腾出空间

var starImage = new Image(); // 🖼️ 创建一个新的图像对象
starImage.src = '/resources/achievement-star.png'; // 🌟 设置图像源路径为星星图片的路径

starImage.onload = function() {
    // 🖌️ 当图像加载完成时执行
    let cnt = 0,yy = 0;
    for (let i = 0; i < stars; i++) {
        if (cnt == 5){
            yy += 1;
            cnt = 0;
        }
        xx = i % 5;
        cnt += 1
        let x = 0 + xx * 70; // 计算星星的 x 坐标，每颗星星之间留出一定的间隔
        let y = 150 + yy * 70; // 固定 y 坐标，使星星在一排显示
        ctx.drawImage(starImage, x, y, 50, 50); // 绘制星星，大小为 50px * 50px
    }
};

if (window[stars] !== undefined) {
    delete window[stars];
}