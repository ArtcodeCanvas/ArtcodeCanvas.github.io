document.addEventListener('DOMContentLoaded', (event) => {
    initEditor();
    loadSelectedCode();

    document.getElementById('codeSelector').addEventListener('change', loadSelectedCode);
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
}

function loadSelectedCode() {
    const selectedFile = document.getElementById('codeSelector').value;
    fetch(selectedFile)
        .then(response => response.text())
        .then(data => {
            editor.setValue(data, -1);
        })
        .catch(error => console.error('Error fetching code file:', error));
}

function updateCode() {
    const code = editor.getValue();
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = code;
    document.body.appendChild(script);
}

// Bubbly button animation
var animateButton = function(e) {
    e.preventDefault();
    e.target.classList.remove('animate');
    e.target.classList.add('animate');
    setTimeout(function(){
        e.target.classList.remove('animate');
    }, 700);
};

var bubblyButtons = document.getElementsByClassName("bubbly-button");
for (var i = 0; i < bubblyButtons.length; i++) {
    bubblyButtons[i].addEventListener('click', animateButton, false);
}

// Mouse move effect
function initMouseEffect() {
    const interBubble = document.querySelector('.interactive');
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    const move = () => {
        curX += (tgX - curX) / 20;
        curY += (tgY - curY) / 20;
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
        requestAnimationFrame(move);
    };

    window.addEventListener('mousemove', (event) => {
        tgX = event.clientX;
        tgY = event.clientY;
    });

    move();
}
