document.addEventListener('DOMContentLoaded', function() {
    fetch('template.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('template-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading template:', error));
});
