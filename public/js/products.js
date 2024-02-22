document.querySelectorAll('img').forEach(img => {
    img.onerror = function () {
        this.src = '../assets/image/no-image.jpg';
    };
});