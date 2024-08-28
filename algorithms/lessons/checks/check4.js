function check2(arr1,arr2) {
    for (let i = 0;i < arr1.length;i++) {
        if (arr1[i] != arr2[i]) {
            console.log(i,"false");
            return false
        }
    }
    console.log(i,"true");
    return true
}

function check() {
    const code = editor.getValue();
    eval(code);
    console.log(1);
    isDaytime = true,isClearSky = true;
    drawSky();
    if (check2([sun,moon,star,child],[1,0,0,2])!=true) {
        return false
    };
    console.log(2);
    isDaytime = true,isClearSky = false;
    drawSky();
    if (check2([sun,moon,star,child],[1,0,0,0])!=true) {
        return false
    };
    console.log(3);
    isDaytime = false,isClearSky = true;
    drawSky();
    if (check2([sun,moon,star,child],[0,2,2,0])!=true) {
        return false
    };
    isDaytime = false,isClearSky = false;
    drawSky();
    if (check2([sun,moon,star,child],[0,1,1,1])!=true) {
        return false
    };
    return(true)
}

// function drawSky() {
//     if (isDaytime) {
//         drawSun(); // ☀️ 绘制太阳
//         if (isClearSky) {
//             drawHappyChild(); // 😊 绘制一个快乐的小朋友
//         }
//     } else {
//         drawMoonAndStar(); // 🌙 🌟 绘制月亮和星星
//         if (isClearSky == false) {
//             drawDimStar(); // 🌑 绘制暗淡的星星
//             drawHiddenMoon(); // ☁️ 月亮被云遮住
//             drawSadChild(); // 😞 绘制一个不快乐的小朋友
//         }
//     }
// }
// drawSky();