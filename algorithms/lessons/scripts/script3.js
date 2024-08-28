var canvas = document.getElementById("myCanvas"); // 🎨 获取页面上的画布元素，让我们开始创作吧！
var ctx = canvas.getContext("2d"); // ✏️ 获取2D绘图环境，准备好画笔咯！
ctx.clearRect(0, 0, 500, 500); // 🧼 清除画布上的内容，为新绘制的图形腾出空间

var starImage = new Image(); // 🖼️ 创建一个新的图像对象
starImage.src = '/resources/achievement-star.png'; // 🌟 设置图像源路径为星星图片的路径

starImage.onload = function() {
    console.log(window['showStar'],window['starCount'],window['starName'],starName.length);
    if (showStar === false) { 
        let cnt = 0, yy = 0;
        for (let i = 0; i < starCount; i++) {
            if (cnt == 5){
                yy += 1;
                cnt = 0;
            }
            xx = i % 5;
            cnt += 1;
            let x = 0 + xx * 70; // 计算星星的 x 坐标，每颗星星之间留出一定的间隔
            let y = 150 + yy * 70; // 固定 y 坐标，使星星在一排显示

            // 在每颗星星下面显示名字
            ctx.fillStyle = "white";
            ctx.font = "16px Arial";
            if (typeof(starName) === "string") {
                ctx.fillText(starName, x+20, y + 70);
            }else {
                ctx.fillText(starName[i], x+20, y + 70); // 星星名字显示在星星下方
            }
        }
        return;
    }

    if (starCount !== starName.length) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除画布
        ctx.fillStyle = "yellow";
        ctx.font = "20px Arial";
        ctx.fillText(`Oh no！你有 ${starCount} 颗星星，但却有 ${starName.length} 个名字`, 0, 170); 
        return; 
    }

    // 🖌️ 当图像加载完成时执行
    let cnt = 0, yy = 0;
    for (let i = 0; i < starCount; i++) {
        console.log(1)
        if (cnt == 5){
            yy += 1;
            cnt = 0;
        }
        xx = i % 5;
        cnt += 1;
        let x = 0 + xx * 70; // 计算星星的 x 坐标，每颗星星之间留出一定的间隔
        let y = 150 + yy * 70; // 固定 y 坐标，使星星在一排显示
        ctx.drawImage(starImage, x, y, 50, 50); // 绘制星星，大小为 50px * 50px

        // 在每颗星星下面显示名字
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(starName[i], x-10, y + 70); // 星星名字显示在星星下方
    }
};

if (window['showStar'] !== undefined) {
    delete window['showStar'],window['starCount'],window['starName']; // 删除全局变量 'stars'，避免重复声明的冲突
}
