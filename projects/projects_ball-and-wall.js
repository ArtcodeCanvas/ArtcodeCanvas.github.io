document.addEventListener('DOMContentLoaded', function () {
    initEditor();
});

let editor;

function initEditor() {
    editor = ace.edit("codeEditor");
    const theme = "monokai";
    const language = "csharp";
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
    fetch('ball-and-wall.cs')
        .then(response => response.text())
        .then(data => {
            editor.setValue(data, -1);
        });
}
