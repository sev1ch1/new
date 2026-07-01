document.addEventListener('DOMContentLoaded', () => {
    const navigation = document.querySelector('.contact-nav, .services-nav, .info-nav[data-section-navigation]');
    if (!navigation) return;

    const links = Array.from(navigation.querySelectorAll('a[href^="#"]'));
    const sections = links
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (!sections.length) return;

    let selectedSectionId = '';
    let selectionTimeout;

    const setActiveLink = id => {
        links.forEach(link => {
            const isActive = link.hash === `#${id}`;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    links.forEach(link => {
        link.addEventListener('click', event => {
            const target = document.querySelector(link.hash);
            if (!target) return;

            event.preventDefault();
            event.stopImmediatePropagation();
            const offset = 88;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.history.replaceState(null, '', link.hash);
            selectedSectionId = target.id;
            clearTimeout(selectionTimeout);
            selectionTimeout = window.setTimeout(() => {
                selectedSectionId = '';
                updateActiveSection();
            }, 700);
            setActiveLink(target.id);
            window.scrollTo({ top, behavior: 'smooth' });
        }, true);
    });

    const updateActiveSection = () => {
        if (selectedSectionId) {
            setActiveLink(selectedSectionId);
            return;
        }

        const marker = window.scrollY + 128;
        let currentSection = sections[0];

        sections.forEach(section => {
            if (section.offsetTop <= marker) {
                currentSection = section;
            }
        });

        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
            currentSection = sections[sections.length - 1];
        }

        setActiveLink(currentSection.id);
    };

    if (window.location.hash && document.querySelector(window.location.hash)) {
        setActiveLink(window.location.hash.slice(1));
    } else {
        setActiveLink(sections[0].id);
    }

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
});
