document.addEventListener('DOMContentLoaded', function() {
    let achievements = JSON.parse(localStorage.getItem('achievements'));
    if (!achievements || achievements.length !== 10) { 
        achievements = Array(10).fill(0);
        localStorage.setItem('achievements', JSON.stringify(achievements));
    }

    const achievementNames = ['第一课', '第二课', '第三课', '第四课', '第五课', '第六课', '第七课', '第八课', '第九课', '第十课']; // 成就名称
    const container = document.querySelector('.achievement-container');

    achievements.forEach((stars, index) => {
        const starContainer = document.createElement('div');
        starContainer.classList.add('star-container');
        starContainer.style.setProperty('--random-height', Math.random()); // 随机高度
        starContainer.style.left = `${20 + index * 140}px`; 

        starContainer.dataset.lesson = `lesson${index + 1}`;
        const isAnimationEnabled = stars !== 0;

        const maxY = 50;
        const startY = isAnimationEnabled ? Math.random() * maxY : 0; 

        for (let i = 0; i < 3; i++) {
            const star = document.createElement('div');
            star.classList.add('star');

            star.style.left = `${i * 30}px`;

            if (isAnimationEnabled) {
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
            window.location.href = `/algorithms/lessons/${starContainer.dataset.lesson}.html`;
        });

        container.appendChild(starContainer);
    });
});
