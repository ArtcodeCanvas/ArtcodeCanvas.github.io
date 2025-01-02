function check() {
    const code = editor.getValue();
    eval(code);
    return stars === 3;
}
