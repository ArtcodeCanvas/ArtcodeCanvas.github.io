let editor;
var intervalId;    
var tempAchievementStars = 3;

const lessonNumber = window.location.pathname.match(/lesson(\d+)/)[1];
const exampleUrl = `examples/example${lessonNumber}.js`;
const scriptUrl = `scripts/script${lessonNumber}.js`;
const checkFile = `checks/check${lessonNumber}.js`;
const conclusionFile = `conclusions/conclusion${lessonNumber}.html`;
const wrongAnswerFile = `conclusions/wrong-answer.html`;

document.addEventListener('DOMContentLoaded', () => {
    initializePage(); // 调用初始化函数
});

function initializePage() {
    initEditor();
    loadExample(exampleUrl, () => {
        updateCode();
    });

    setupTutorialAndSubmit(lessonNumber, checkFile, conclusionFile, wrongAnswerFile);
    setupButton('tutorial-button', `tutorials/tutorial${lessonNumber}.html`);
    setupButton('hint-button', `hints/hint${lessonNumber}.html`, Math.min(2,tempAchievementStars)); 
    setupButton('answer-button', `answers/answer${lessonNumber}.html`, 1); 

    loadTutorial(lessonNumber);
}

function setupButton(buttonId, fileUrl, tempStarsValue = null) {
    const button = document.getElementById(buttonId);
    const tutorialContainer = document.getElementById('tutorial-container');
    const overlay = document.getElementById('overlay');

    button.addEventListener('click', () => {
        if (tempStarsValue !== null) {
            tempAchievementStars = tempStarsValue; 
        }

        fetch(fileUrl)
            .then(response => response.text())
            .then(data => {
                tutorialContainer.innerHTML = `<h2>${button.textContent}</h2><p>${data}</p>`;
                tutorialContainer.style.display = 'block';
                overlay.style.display = 'block';
            })
            .catch(error => console.error(`无法加载${button.textContent}内容:`, error));
    });

    overlay.addEventListener('click', () => {
        tutorialContainer.style.display = 'none';
        overlay.style.display = 'none';
    });
}

function loadExample(exampleUrl, callback) {
    fetch(exampleUrl)
        .then(response => response.text())
        .then(data => {
            editor.setValue(data, -1);
            clearCanvas(); 
            if (callback) callback(); 
        })
        .catch(error => console.error('Error fetching example file:', error));
}

function setupTutorialAndSubmit(lessonNumber, checkFile, conclusionFile, wrongAnswerFile) {
    const tutorialButton = document.getElementById('tutorial-button');
    const tutorialContainer = document.getElementById('tutorial-container');
    const overlay = document.getElementById('overlay');
    const startChallengeButton = document.getElementById('start-challenge-button');
    const submitButton = document.getElementById('submit-button');
    const conclusionContainer = document.getElementById('conclusion-container');
    const nextLessonButton = document.getElementById('next-lesson-button');

    tutorialButton.addEventListener('click', () => loadTutorial(lessonNumber));

    overlay.addEventListener('click', () => {
        tutorialContainer.style.display = 'none';
        conclusionContainer.style.display = 'none';
        overlay.style.display = 'none';
    });

    startChallengeButton.addEventListener('click', () => {
        tutorialContainer.style.display = 'none';
        overlay.style.display = 'none';
    });

    submitButton.addEventListener('click', () => {
        updateCode();

        loadScript(checkFile, () => {
            overlay.style.display = 'block';
            try {
                if (typeof check === 'function' && check()) {
                    updateAchievements();
                    fetch(conclusionFile)
                        .then(response => response.text())
                        .then(data => {
                            conclusionContainer.innerHTML = `<h2>恭喜！</h2>${data}`;
                            nextLessonButton.innerText = "下一课"; 
                            nextLessonButton.onclick = () => {
                                window.location.href = `lesson${parseInt(lessonNumber) + 1}.html`;
                            };
                            conclusionContainer.appendChild(nextLessonButton);
                            conclusionContainer.style.display = 'block';
                        })
                        .catch(error => console.error('无法加载结论文件:', error));
                } else {
                    // 如果check函数返回false，加载错误页面
                    fetch(wrongAnswerFile)
                        .then(response => response.text())
                        .then(data => {
                            conclusionContainer.innerHTML = `<h2>再试一次</h2>${data}`;
                            nextLessonButton.innerText = "继续挑战"; 
                            nextLessonButton.onclick = () => {
                                conclusionContainer.style.display = 'none';
                                overlay.style.display = 'none';
                            };
                            conclusionContainer.appendChild(nextLessonButton);
                            conclusionContainer.style.display = 'block';
                        })
                        .catch(error => console.error('无法加载错误文件:', error));
                }
            } catch (error) {
                console.error('执行验证时发生错误:', error);
                fetch(wrongAnswerFile)
                    .then(response => response.text())
                    .then(data => {
                        conclusionContainer.innerHTML = `<h2>出错了</h2>${data}`;
                        nextLessonButton.innerText = "再试一次"; 
                        nextLessonButton.onclick = () => {
                            conclusionContainer.style.display = 'none';
                            overlay.style.display = 'none';
                        };
                        conclusionContainer.appendChild(nextLessonButton);
                        conclusionContainer.style.display = 'block';
                    })
                    .catch(err => console.error('无法加载错误文件:', err));
            }
        });        
    });
}

function updateAchievements() {
    const achievements = JSON.parse(localStorage.getItem('achievements')) || new Array(10).fill(0);
    const currentAchievement = achievements[lessonNumber - 1];
    achievements[lessonNumber - 1] = Math.max(currentAchievement, tempAchievementStars);
    localStorage.setItem('achievements', JSON.stringify(achievements));
}

function loadTutorial(lessonNumber) {
    const tutorialContainer = document.getElementById('tutorial-container');
    const overlay = document.getElementById('overlay');
    const startChallengeButton = document.getElementById('start-challenge-button');
    const tutorialFile = `tutorials/tutorial${lessonNumber}.html`;

    fetch(tutorialFile)
        .then(response => response.text())
        .then(data => {
            tutorialContainer.innerHTML = `<h2>教程</h2><p>${data}</p>`;
            tutorialContainer.appendChild(startChallengeButton);
            tutorialContainer.style.display = 'block';
            overlay.style.display = 'block';
        })
        .catch(error => console.error('无法加载教程内容:', error));
}

function loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onload = () => callback();

    document.head.appendChild(script);
}

function clearCanvas() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateCode() {
    const code = editor.getValue();
    const script1 = document.createElement('script');
    script1.type = 'text/javascript';
    script1.innerHTML = code;
    document.body.appendChild(script1);

    fetch(scriptUrl)
        .then(response => response.text())
        .then(scriptCode => {
            const script2 = document.createElement('script');
            script2.type = 'text/javascript';
            script2.innerHTML = `(function() { ${scriptCode} })();`; // 包装为立即执行的函数表达式（IIFE）
            document.body.appendChild(script2); 
        })
        .catch(error => console.error('Error loading script:', error));
}

function resetCode() {
    initializePage(); 
}
