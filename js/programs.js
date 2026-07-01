(function () {
    const modal = document.getElementById('filtersModal');
    const openButton = document.getElementById('openFilters');
    const panel = modal?.querySelector('.filter-panel');
    const countElement = document.getElementById('filterCount');
    const resetButton = document.getElementById('resetFilters');

    if (!modal || !openButton || !panel) {
        return;
    }

    const fields = Array.from(panel.querySelectorAll('select, input'));
    const focusableSelector = 'button:not([disabled]), select:not([disabled]), input:not([disabled])';
    let previousFocus = null;

    const activeFilterCount = () => fields.reduce((count, field) => {
        if (field.type === 'checkbox') {
            return count + Number(field.checked);
        }
        if (field.type === 'range') {
            return count;
        }
        if (field.id === 'priceMin') {
            return count + Number(field.value !== '0');
        }
        if (field.id === 'priceMax') {
            return count + Number(field.value !== '500000');
        }
        return count + Number(field.selectedIndex > 0);
    }, 0);

    const updateCount = () => {
        const count = activeFilterCount();
        if (!countElement) {
            return;
        }
        countElement.textContent = String(count);
        countElement.hidden = count === 0;
    };

    const open = () => {
        previousFocus = document.activeElement;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        openButton.setAttribute('aria-expanded', 'true');
        document.body.classList.add('filter-modal-open');
        panel.focus();
    };

    const close = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        openButton.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('filter-modal-open');
        previousFocus?.focus();
    };

    openButton.addEventListener('click', open);
    modal.addEventListener('click', (event) => {
        if (event.target.closest('[data-close-filters]')) {
            close();
        }
    });

    modal.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            close();
            return;
        }
        if (event.key !== 'Tab') {
            return;
        }
        const focusable = Array.from(panel.querySelectorAll(focusableSelector));
        if (!focusable.length) {
            return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    fields.forEach((field) => {
        field.addEventListener('change', updateCount);
        field.addEventListener('input', updateCount);
    });
    resetButton?.addEventListener('click', () => window.setTimeout(updateCount));
    updateCount();
})();
