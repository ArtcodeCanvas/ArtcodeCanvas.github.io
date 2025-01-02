var canvas = document.getElementById("myCanvas"); 
var ctx = canvas.getContext("2d"); 
ctx.clearRect(0, 0, 500, 500); 

var starImage = new Image(); 
starImage.src = '/resources/achievement-star.png'; 

starImage.onload = function() {
    let cnt = 0,yy = 0;
    for (let i = 0; i < stars; i++) {
        if (cnt == 5){
            yy += 1;
            cnt = 0;
        }
        xx = i % 5;
        cnt += 1
        let x = 0 + xx * 70; 
        let y = 150 + yy * 70; 
        ctx.drawImage(starImage, x, y, 50, 50); 
    }
};

if (window[stars] !== undefined) {
    delete window[stars];
}