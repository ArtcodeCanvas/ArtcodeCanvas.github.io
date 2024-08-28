var width = 20; // 设定游戏宽度
var height = 20; // 设定游戏高度
var player = 8; // 玩家初始位置
var ball_x = 2; // 球的初始x位置
var ball_y = 2; // 球的初始y位置
var speed_x = 1; // 球的x轴速度
var speed_y = 1; // 球的y轴速度

document.addEventListener('keydown', function(event) {
    if (event.key === 'w') {
        player--;
        if (player < 3) player = 3; // 防止玩家超出上边界
    } else if (event.key === 's') {
        player++;
        if (player > height - 4) player = height - 4; // 防止玩家超出下边界
    }
});

function update() {
    let output = '';

    // 绘制游戏画面
    for (let i = 0; i < height; i++) {
        if (i >= player - 3 && i <= player + 3) {
            output += '|'; // 板子始终在最左边
        } else {
            output += ' '; // 空白区域
        }
        if (i === ball_y && ball_x >= 0) { 
            output += ' '.repeat(ball_x) + 'O'; // 绘制球
        }
        output += '\n';
    }

    document.getElementById('game').innerText = output;

    // 检查球是否与板子碰撞
    if (ball_x === 0) {
        if (ball_y >= player - 3 && ball_y <= player + 3) {
            speed_x = -speed_x; // 改变x轴方向
        } else {
            document.getElementById('game').innerText = 'You lose';
            clearInterval(gameInterval);
            return; 
        }
    }

    if (ball_x === width - 1) {
        speed_x = -speed_x;
    }

    if (ball_y === 0 || ball_y === height - 1) {
        speed_y = -speed_y;
    }

    ball_x += speed_x;
    ball_y += speed_y;
}

function gameLoop() {
    update();
}

var gameInterval = setInterval(gameLoop, 125);
