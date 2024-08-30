document.addEventListener('DOMContentLoaded', function() {
    let achievements = JSON.parse(localStorage.getItem('achievements'));
    if (!achievements || achievements.length !== 10) {
        achievements = Array(10).fill(0);
        localStorage.setItem('achievements', JSON.stringify(achievements));
    }

    console.log(achievements); 
});
