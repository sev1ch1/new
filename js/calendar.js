document.addEventListener('DOMContentLoaded', () => {
    const filterGroups = document.querySelectorAll('.calendar-filter .chip-list');

    filterGroups.forEach(group => {
        const chips = Array.from(group.querySelectorAll('.chip'));

        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(item => {
                    item.classList.remove('active');
                    item.removeAttribute('aria-current');
                });

                chip.classList.add('active');
                chip.setAttribute('aria-current', 'true');
            });
        });
    });
});
