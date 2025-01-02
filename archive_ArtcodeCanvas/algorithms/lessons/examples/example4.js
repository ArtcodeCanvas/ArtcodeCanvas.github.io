var isDaytime = false;
var isClearSky = false;
var ______ = undefined;
ctx.clearRect(0, 0, 500, 500);
/*
任务一：将上面的isClearSky改成true，看看画面发生了什么变化！
*/

if (isDaytime == false) {
    if (isClearSky == true) {
        drawBrightStar(); // 🌟 绘制明亮的星星
        drawMoon(); // 🌕 绘制月亮
    } else {
        drawDimStar(); // 🌑 绘制暗淡的星星
        drawHiddenMoon(); // ☁️ 月亮被云遮住
    }
}

/*
任务二：将教程中的任务代码复制在下方，并且将代码中的“______”都改成条件语句，让程序正确地展示白天与黑夜、晴朗与阴云的不同场景。
如果白天则展示太阳，白天且天晴（isClearSky为真）则展示一个快乐的小朋友；
如果晚上则展示月亮和星星，晚上且天气不晴朗展示一个不快乐的小朋友。
*/

