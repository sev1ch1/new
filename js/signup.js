document.addEventListener('DOMContentLoaded', () => {
    const triggers = document.querySelectorAll('[data-modal-target]');
    const modals = document.querySelectorAll('.form-modal');
    let lastActiveElement = null;

    const closeModal = modal => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    };

    const openModal = id => {
        const modal = document.getElementById(`modal-${id}`);
        if (!modal) return;

        lastActiveElement = document.activeElement;
        modals.forEach(closeModal);
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        modal.querySelector('input, textarea, button')?.focus();
    };

    triggers.forEach(button => {
        button.addEventListener('click', () => openModal(button.dataset.modalTarget));
    });

    modals.forEach(modal => {
        modal.addEventListener('click', event => {
            if (event.target.dataset.close === 'modal') {
                closeModal(modal);
                lastActiveElement?.focus?.();
            }
        });

        modal.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                closeModal(modal);
                lastActiveElement?.focus?.();
            }
        });

        const form = modal.querySelector('form');
        if (!form) return;

        form.addEventListener('submit', event => {
            event.preventDefault();
            closeModal(modal);
            window.showModal?.({
                title: 'Заявка отправлена',
                message: 'Мы получили ваши данные и скоро свяжемся с вами.'
            });
            form.reset();
            lastActiveElement?.focus?.();
        });
    });
});
