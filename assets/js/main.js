document.addEventListener("DOMContentLoaded", function() {
    fetch('svg.html')
        .then(response => response.text())
        .then(data => {
            const container = document.getElementById('svg-container');
            if (container) {
                container.innerHTML = data;
            }
        });
});
