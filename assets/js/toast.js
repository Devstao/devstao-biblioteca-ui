function showToast(type, title, message) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.getElementById('toast');
    const text1 = toast.querySelector('.text-1');
    const text2 = toast.querySelector('.text-2');
    const closeButton = toast.querySelector('.close');

    toast.classList.remove('success', 'error');
    toast.classList.add(type);
    text1.textContent = title;
    text2.textContent = message;
    toastContainer.style.display = 'block';

    const hideToast = () => {
        toastContainer.style.display = 'none';
    };

    closeButton.addEventListener('click', hideToast);

    setTimeout(hideToast, 3000);
}

export { showToast };