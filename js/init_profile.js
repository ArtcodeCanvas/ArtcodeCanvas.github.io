document.addEventListener('DOMContentLoaded', function() {
    // 尝试从 localStorage 中读取名为 "achievements" 的数组
    let achievements = JSON.parse(localStorage.getItem('achievements'));

    // 如果 "achievements" 不存在或长度不为11，则初始化为长度为11的全0数组
    if (!achievements || achievements.length !== 11) {
        achievements = Array(11).fill(0);
        localStorage.setItem('achievements', JSON.stringify(achievements));
    }

    console.log(achievements); // 打印结果，检查数组内容
});
