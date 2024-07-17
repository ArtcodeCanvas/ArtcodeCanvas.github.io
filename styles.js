document.addEventListener('DOMContentLoaded', () => {
    initEditor();
    initMouseEffect();

    const styleSelect = document.getElementById('style-select');
    styleSelect.addEventListener('change', loadSelectedStyle);

    // Load the initial style
    loadSelectedStyle();
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

function loadSelectedStyle() {
    const styleSelect = document.getElementById('style-select');
    const selectedStyle = styleSelect.value;
    const scriptUrl = `${selectedStyle}.js`; // Assuming the script files are named style1.js, style2.js, style3.js

    fetch(scriptUrl)
        .then(response => response.text())
        .then(code => {
            editor.setValue(code, -1); // Set the code in the editor, -1 moves cursor to start
        })
        .catch(error => console.error('Error loading style script:', error));
}

function updateCode() {
    const code = editor.getValue();
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = code;
    document.body.appendChild(script);
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
