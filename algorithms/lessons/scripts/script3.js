var canvas = document.getElementById("myCanvas"); 
var ctx = canvas.getContext("2d"); 
ctx.clearRect(0, 0, 500, 500); 

var starImage = new Image(); 
starImage.src = '/resources/achievement-star.png'; 

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
            let x = 0 + xx * 70; 
            let y = 150 + yy * 70; 

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
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        ctx.fillStyle = "yellow";
        ctx.font = "20px Arial";
        ctx.fillText(`Oh no！你有 ${starCount} 颗星星，但却有 ${starName.length} 个名字`, 0, 170); 
        return; 
    }

    let cnt = 0, yy = 0;
    for (let i = 0; i < starCount; i++) {
        console.log(1)
        if (cnt == 5){
            yy += 1;
            cnt = 0;
        }
        xx = i % 5;
        cnt += 1;
        let x = 0 + xx * 70;
        let y = 150 + yy * 70; 
        ctx.drawImage(starImage, x, y, 50, 50); 

        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(starName[i], x-10, y + 70);
    }
};

if (window['showStar'] !== undefined) {
    delete window['showStar'],window['starCount'],window['starName']; // 删除全局变量 'stars'，避免重复声明的冲突
}
