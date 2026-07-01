(function () {
    const slider = document.getElementById('newsSlider');
    const track = slider?.querySelector('.news-track');
    const slides = track ? Array.from(track.children) : [];
    const previousButton = document.getElementById('newsPrev');
    const nextButton = document.getElementById('newsNext');
    const dots = document.getElementById('newsDots');
    let currentNewsPage = 0;

    if (!slider || !track || !slides.length) {
        return;
    }

    const visibleSlides = () => {
        if (window.innerWidth <= 680) {
            return 1;
        }
        if (window.innerWidth <= 1080) {
            return 2;
        }
        return 3;
    };

    const lastPage = () => Math.max(0, Math.ceil(slides.length / visibleSlides()) - 1);

    const firstSlideForPage = (page) => {
        const availableSlides = visibleSlides();
        const regularStart = page * availableSlides;
        return Math.min(regularStart, Math.max(0, slides.length - availableSlides));
    };

    const update = (nextPage = currentNewsPage) => {
        currentNewsPage = Math.max(0, Math.min(nextPage, lastPage()));
        const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '0') || 0;
        const perView = visibleSlides();
        const slideWidth = (track.clientWidth - gap * (perView - 1)) / perView;
        const firstSlide = firstSlideForPage(currentNewsPage);
        slides.forEach((slide) => {
            slide.style.flex = `0 0 ${slideWidth}px`;
        });
        track.style.transform = `translateX(-${(slideWidth + gap) * firstSlide}px)`;
        dots?.querySelectorAll('.news-dot').forEach((dot, index) => {
            const active = index === currentNewsPage;
            dot.classList.toggle('active', active);
            if (active) {
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.removeAttribute('aria-current');
            }
        });
        const counter = dots?.querySelector('.news-counter');
        if (counter) {
            counter.textContent = `${currentNewsPage + 1} / ${lastPage() + 1}`;
        }
        if (previousButton) {
            previousButton.disabled = currentNewsPage === 0;
        }
        if (nextButton) {
            nextButton.disabled = currentNewsPage === lastPage();
        }
    };

    const renderDots = () => {
        if (!dots) {
            return;
        }
        dots.innerHTML = '';
        if (lastPage() > 6) {
            const counter = document.createElement('span');
            counter.className = 'news-counter';
            counter.setAttribute('aria-live', 'polite');
            dots.appendChild(counter);
            return;
        }
        for (let index = 0; index <= lastPage(); index += 1) {
            const button = document.createElement('button');
            button.className = 'news-dot';
            button.type = 'button';
            button.setAttribute('aria-label', `Показать страницу событий ${index + 1}`);
            button.addEventListener('click', () => {
                update(index);
            });
            dots.appendChild(button);
        }
    };

    previousButton?.addEventListener('click', () => update(currentNewsPage - 1));
    nextButton?.addEventListener('click', () => update(currentNewsPage + 1));
    window.addEventListener('resize', () => {
        renderDots();
        update(currentNewsPage);
    });

    renderDots();
    update();

    const sectionLinks = Array.from(document.querySelectorAll('.home-section-nav a[href^="#"]'));
    const sections = sectionLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (sections.length) {
        const setActiveSection = (sectionId) => {
            sectionLinks.forEach((link) => {
                const active = link.getAttribute('href') === `#${sectionId}`;
                link.classList.toggle('active', active);
                if (active) {
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { rootMargin: '-30% 0px -55% 0px', threshold: 0.01 });

        sections.forEach((section) => observer.observe(section));
        setActiveSection(window.location.hash.slice(1) || sections[0].id);
    }

    const partnersSlider = document.getElementById('partnersSlider');
    const partnersTrack = partnersSlider?.querySelector('.partners-track');
    const partnerCards = partnersTrack ? Array.from(partnersTrack.children) : [];
    const partnersPrevious = document.getElementById('partnersPrev');
    const partnersNext = document.getElementById('partnersNext');
    const partnersDots = document.getElementById('partnersDots');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let currentPartner = 0;
    let partnersTimer = null;

    if (!partnersSlider || !partnersTrack || !partnerCards.length) {
        return;
    }

    const visiblePartners = () => {
        if (window.innerWidth <= 640) {
            return 1;
        }
        if (window.innerWidth <= 1100) {
            return 2;
        }
        return 4;
    };

    const maximumPartner = () => Math.max(0, partnerCards.length - visiblePartners());

    const renderPartnerDots = () => {
        if (!partnersDots) {
            return;
        }

        partnersDots.innerHTML = '';
        for (let index = 0; index <= maximumPartner(); index += 1) {
            const button = document.createElement('button');
            button.className = 'partners-dot';
            button.type = 'button';
            button.setAttribute('aria-label', `Показать ресурсы, начиная с карточки ${index + 1}`);
            button.addEventListener('click', () => updatePartners(index));
            partnersDots.appendChild(button);
        }
    };

    function updatePartners(nextIndex = currentPartner) {
        currentPartner = Math.max(0, Math.min(nextIndex, maximumPartner()));
        const gap = parseFloat(getComputedStyle(partnersTrack).columnGap || getComputedStyle(partnersTrack).gap || '0') || 0;
        const width = partnerCards[0].getBoundingClientRect().width;
        partnersTrack.style.transform = `translateX(-${currentPartner * (width + gap)}px)`;

        partnersDots?.querySelectorAll('.partners-dot').forEach((dot, index) => {
            const active = index === currentPartner;
            dot.classList.toggle('active', active);
            if (active) {
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.removeAttribute('aria-current');
            }
        });

        if (partnersPrevious) {
            partnersPrevious.disabled = currentPartner === 0;
        }
        if (partnersNext) {
            partnersNext.disabled = currentPartner === maximumPartner();
        }
    }

    const stopPartnersAutoplay = () => {
        if (partnersTimer) {
            window.clearInterval(partnersTimer);
            partnersTimer = null;
        }
    };

    const startPartnersAutoplay = () => {
        stopPartnersAutoplay();
        if (!reducedMotion && maximumPartner() > 0) {
            partnersTimer = window.setInterval(() => {
                const nextIndex = currentPartner >= maximumPartner() ? 0 : currentPartner + 1;
                updatePartners(nextIndex);
            }, 4800);
        }
    };

    partnersPrevious?.addEventListener('click', () => updatePartners(currentPartner - 1));
    partnersNext?.addEventListener('click', () => updatePartners(currentPartner + 1));
    partnersSlider.addEventListener('mouseenter', stopPartnersAutoplay);
    partnersSlider.addEventListener('mouseleave', startPartnersAutoplay);
    partnersSlider.addEventListener('focusin', stopPartnersAutoplay);
    partnersSlider.addEventListener('focusout', startPartnersAutoplay);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopPartnersAutoplay();
        } else {
            startPartnersAutoplay();
        }
    });
    window.addEventListener('resize', () => {
        renderPartnerDots();
        updatePartners();
        startPartnersAutoplay();
    });

    renderPartnerDots();
    updatePartners();
    startPartnersAutoplay();
})();
