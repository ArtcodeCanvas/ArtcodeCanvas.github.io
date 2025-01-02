function check() {
    const code = editor.getValue();
    eval(code);
    return (showStar === true && starCount === 3 && starName.length === 3);
}
