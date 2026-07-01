(function () {
    const root = document.getElementById('modal-root');
    if (!root) {
        window.showModal = (opts = {}) => alert(`${opts.title ? opts.title + '\n' : ''}${opts.message || ''}`.trim());
        window.closeModal = () => {};
        return;
    }
    const windowEl = root.querySelector('.modal-window');
    const titleEl = root.querySelector('.modal-title');
    const messageEl = root.querySelector('.modal-message');

    function openModal({ title = 'Сообщение', message = '' } = {}) {
        titleEl.textContent = title;
        messageEl.textContent = message;
        root.classList.add('is-open');
        root.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
        root.classList.remove('is-open');
        root.setAttribute('aria-hidden', 'true');
    }

    root.addEventListener('click', (event) => {
        if (event.target.dataset.close === 'modal') {
            closeModal();
        }
    });

    window.showModal = openModal;
    window.closeModal = closeModal;
})();
