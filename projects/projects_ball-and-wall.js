document.addEventListener('DOMContentLoaded', function () {
    initEditor();
});

let editor;

function initEditor() {
    editor = ace.edit("codeEditor");
    const theme = "monokai";
    const language = "javascript";
    editor.setTheme("ace/theme/" + theme);
    editor.session.setMode("ace/mode/" + language);
    editor.setFontSize(15);
    editor.setReadOnly(false);
    editor.setOption("wrap", "free");
    ace.require("ace/ext/language_tools");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    editor.setValue('', -1);
}

function loadExampleCode2() {
    fetch('ball-and-wall.js')
        .then(response => response.text())
        .then(data => {
            editor.setValue(data, -1);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('displayButton').addEventListener('click', function() {
        runEditorCode();
        restartGame();
    });
});
  
function runEditorCode() {
    const editorCode = editor.getValue(); // 获取编辑器中的代码
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = editorCode; // 将编辑器代码作为脚本内容
    document.body.appendChild(script); // 执行代码
}

function restartGame() {
    // 清除当前的游戏循环
    clearInterval(gameInterval);

    // 重置游戏变量到初始状态
    
    player = 8;
    ball_x = 2;
    ball_y = 2;
    speed_x = 1;
    speed_y = 1;

    // 重新启动游戏循环
    gameInterval = setInterval(gameLoop, 125);
}
