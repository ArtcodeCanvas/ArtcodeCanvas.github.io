// algorithms.js

let editor;
var intervalId;    

const lessonNumber = window.location.pathname.match(/lesson(\d+)/)[1];
const exampleUrl = `examples/example${lessonNumber}.js`;
const scriptUrl = `scripts/script${lessonNumber}.js`
const checkFile = `checks/check${lessonNumber}.js`;
const conclusionFile = `conclusions/conclusion${lessonNumber}.html`;
const wrongAnswerFile = `conclusions/wrong-answer.html`;

document.addEventListener('DOMContentLoaded', () => {
    initializePage(); // 调用初始化函数
});

function initializePage() {
    // 初始化编辑器并加载示例代码
    initEditor();
    loadExample(exampleUrl, () => {
        // 执行代码后更新画布内容
        updateCode();
    });

    // 设置教程和提交按钮的相关功能
    setupTutorialAndSubmit(
        lessonNumber,
        checkFile,
        conclusionFile,
        wrongAnswerFile
    );

    // 默认展示一次教程内容
    loadTutorial(lessonNumber);
}

function loadExample(exampleUrl, callback) {
    fetch(exampleUrl)
        .then(response => response.text())
        .then(data => {
            editor.setValue(data, -1);
            clearCanvas(); // 清空画布
            if (callback) callback(); // 执行传入的回调函数
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

    // 处理教程按钮点击事件
    tutorialButton.addEventListener('click', () => loadTutorial(lessonNumber));

    // 处理蒙版点击事件
    overlay.addEventListener('click', () => {
        tutorialContainer.style.display = 'none';
        conclusionContainer.style.display = 'none';
        overlay.style.display = 'none';
    });

    // 处理开始挑战按钮点击事件
    startChallengeButton.addEventListener('click', () => {
        tutorialContainer.style.display = 'none';
        overlay.style.display = 'none';
    });

    // 提交按钮点击事件
    submitButton.addEventListener('click', () => {
        // 首先运行代码
        updateCode();
        // 然后加载并执行check.js文件
        loadScript(checkFile, () => {
            overlay.style.display = 'block';
            if (typeof check === 'function' && check()) {
                // 如果check函数返回true，加载成功页面
                fetch(conclusionFile)
                    .then(response => response.text())
                    .then(data => {
                        conclusionContainer.innerHTML = `<h2>恭喜！</h2>${data}`;
                        nextLessonButton.innerText = "下一课"; // 更新按钮文本
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
                        nextLessonButton.innerText = "继续挑战"; // 更新按钮文本
                        nextLessonButton.onclick = () => {
                            conclusionContainer.style.display = 'none';
                            overlay.style.display = 'none';
                        };
                        conclusionContainer.appendChild(nextLessonButton);
                        conclusionContainer.style.display = 'block';
                    })
                    .catch(error => console.error('无法加载错误文件:', error));
            }
        });
    });

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
            document.body.appendChild(script2); // 执行 script2.js 的代码
        })
        .catch(error => console.error('Error loading script:', error));
}

function resetCode() {
    initializePage(); // 重置时重新初始化页面
}
