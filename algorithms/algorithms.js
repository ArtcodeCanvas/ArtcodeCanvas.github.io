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