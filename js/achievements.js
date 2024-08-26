document.addEventListener('DOMContentLoaded', function() {
    const achievements = [3, 1, 0, 3, 0]; // 成就信息
    const achievementNames = ['第一课', '第二课', '第三课', '第四课', '第五课']; // 成就名称
    const container = document.querySelector('.achievement-container');

    achievements.forEach((stars, index) => {
        const starContainer = document.createElement('div');
        starContainer.classList.add('star-container');
        starContainer.style.setProperty('--random-height', Math.random()); // 随机高度
        starContainer.style.left = `${index * 180}px`; // 设置水平排列

        starContainer.dataset.lesson = `lesson${index + 1}`;
        const isAnimationEnabled = stars !== 0;

        for (let i = 0; i < 3; i++) {
            const star = document.createElement('div');
            star.classList.add('star');

            star.style.left = `${i * 50}px`;

            if (isAnimationEnabled) {
                const maxY = 50;
                const startY = Math.random() * maxY;
                const moveY1 = startY + Math.random() * (maxY - startY);
                const moveY2 = startY - Math.random() * startY;

                star.style.top = `${startY}px`;
                star.style.setProperty('--move-y1', `${moveY1 - startY}px`);
                star.style.setProperty('--move-y2', `${moveY2 - startY}px`);
                star.style.setProperty('--animation-duration', `${0.5 + Math.random() * 0.5}s`);
                star.style.setProperty('--rotation-duration', `${20 + Math.random() * 10}s`);
            } else {
                star.classList.add('no-animation');
            }

            if (i >= stars) {
                star.style.filter = 'grayscale(100%)'; 
            }

            starContainer.appendChild(star);
        }

        const achievementName = document.createElement('div');
        achievementName.classList.add('achievement-name');
        achievementName.textContent = achievementNames[index];
        starContainer.appendChild(achievementName);

        starContainer.addEventListener('click', () => {
            window.location.href = `${starContainer.dataset.lesson}.html`;
        });

        container.appendChild(starContainer);
    });
});
