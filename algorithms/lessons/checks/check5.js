function check() {
    const code = editor.getValue();
    eval(code);
    return (currentStarIndex >= 6);
}
