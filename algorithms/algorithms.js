let editor;
var intervalId;

document.addEventListener('DOMContentLoaded', (event) => {
    initEditor();
    loadSelectedCode();

    document.getElementById('codeSelector').addEventListener('change', loadSelectedCode);
});


function loadSelectedCode() {
    const selectedFile = document.getElementById('codeSelector').value;
    const codeUrl = `codes/${selectedFile}`;
    const tipsUrl = `tips/tip${selectedFile.charAt(4)}.txt`; 
    
    fetch(codeUrl)
        .then(response => response.text())
        .then(data => {
            editor.setValue(data, -1);
            clearInterval(intervalId); 
            clearCanvas(); 
            document.getElementById('tips').innerHTML = ''; 
            loadTips(selectedFile);
        })
        .catch(error => console.error('Error fetching code file:', error));

    fetch(tipsUrl)
        .then(response => response.text())
        .then(data => {
            document.getElementById('tips-container').innerText = data;
        })
        .catch(error => console.error('Error fetching tips file:', error));
}

function clearCanvas() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
}

function updateCode() {
    const code = editor.getValue();
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = code;
    document.body.appendChild(script);
    const achievements = JSON.parse(localStorage.getItem('achievements')) || new Array(10).fill(0);
    achievements[0] = 3;
    localStorage.setItem('achievements', JSON.stringify(achievements));
}

function resetCode() {
    loadSelectedCode(); 
}