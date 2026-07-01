document.addEventListener('DOMContentLoaded', () => {
    const headerTop = document.getElementById('headerTop');
    const mainNav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const megaMenu = document.getElementById('megaMenu');
    const navLinks = document.querySelectorAll('nav a[href^="#"], .main-nav a[href^="#"]');
    let lastScrollY = 0;
    
    // ????????? ????? ????????? ????????? ? ???????
    const navItems = document.querySelectorAll('.main-nav .nav-item');
    navItems.forEach(item => {
        const subMenu = item.querySelector('.sub-menu');
        if (subMenu) {
            item.classList.add('has-submenu');
        }
    });

    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (headerTop) {
            if (currentScrollY > 50) {
                headerTop.classList.add('hidden');
            } else {
                headerTop.classList.remove('hidden');
            }
        }
        
        lastScrollY = currentScrollY;
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    if (navToggle && megaMenu) {
        const closeMenu = () => {
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            mainNav?.classList.remove('open');
            megaMenu.classList.remove('active');
        };

        navToggle.addEventListener('click', () => {
            const open = !megaMenu.classList.contains('active');
            navToggle.classList.toggle('active', open);
            navToggle.setAttribute('aria-expanded', String(open));
            mainNav?.classList.toggle('open', open);
            megaMenu.classList.toggle('active', open);
        });

        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !megaMenu.contains(e.target)) {
                closeMenu();
            }
        });

        megaMenu.addEventListener('click', (event) => {
            if (event.target.closest('a')) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    event.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                    mainNav?.classList.remove('open');
                }
            }
        });
    });

    function bindForm(selector, successText) {
        const form = document.querySelector(selector);
        if (!form) return;
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const name = formData.get('name') || formData.get('fio') || '??????';
            window.showModal?.({
                title: successText,
                message: `${name}, ???? ?????? ?????????. ?? ???????? ? ??????? ?????.`
            });
            form.reset();
        });
    }

    bindForm('#contactForm', '????????? ??????????');
    bindForm('#signupForm', '?????? ????????????????');

    // ????????? ?????????????
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // ?????????? ???????????
    const directionTabs = document.querySelectorAll('.direction-tab');
    const filteredDirectionsGrid = document.getElementById('filteredDirections');
    
    if (directionTabs.length && filteredDirectionsGrid) {
        directionTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                directionTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-pressed', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-pressed', 'true');
                
                const category = tab.dataset.category;
                const cards = filteredDirectionsGrid.querySelectorAll('.direction-card');
                
                if (category === 'all') {
                    cards.forEach(card => {
                        card.style.display = '';
                        card.style.opacity = '1';
                    });
                } else {
                    cards.forEach(card => {
                        const categories = card.dataset.categories || '';
                        if (categories.includes(category)) {
                            card.style.display = '';
                            card.style.opacity = '1';
                        } else {
                            card.style.display = 'none';
                            card.style.opacity = '0';
                        }
                    });
                }
            });
        });
    }

    // Каталог программ: вкладки категорий
    const catalogTabs = document.querySelectorAll('.catalog-filters .direction-tab');
    const catalogGrid = document.querySelector('.catalog-grid');

    if (catalogTabs.length && catalogGrid) {
        catalogTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                catalogTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-pressed', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-pressed', 'true');
                currentCategory = tab.dataset.category || 'all';
                renderPrograms();
            });
        });
    }

    // ???????? ????????? + ?????? ?????? ????????
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const priceSlider = document.getElementById('priceSlider');
    const resetFilters = document.getElementById('resetFilters');
    const sidebarSelects = document.querySelectorAll('.catalog-sidebar select');
    const sidebarChecks = document.querySelectorAll('.catalog-sidebar input[type="checkbox"]');
    const filterCenter = document.getElementById('filterCenter');
    const filterCompetence = document.getElementById('filterCompetence');
    const filterPeriod = document.getElementById('filterPeriod');
    const filterOrganizer = document.getElementById('filterOrganizer');
    const filterCity = document.getElementById('filterCity');
    const filterProject = document.getElementById('filterProject');
    const formRemote = document.getElementById('formRemote');
    const formFulltime = document.getElementById('formFulltime');
    const formMixed = document.getElementById('formMixed');
    const dotFull = document.getElementById('dotFull');
    const dotPartial = document.getElementById('dotPartial');
    const ovzCheck = document.getElementById('ovz');

    if (priceMin && priceMax && priceSlider) {
        const clampPrice = (val) => Math.max(0, Math.min(500000, Number(val) || 0));
        const syncSlider = () => {
            const minVal = clampPrice(priceMin.value);
            const maxVal = clampPrice(priceMax.value);
            priceMin.value = minVal;
            priceMax.value = Math.max(minVal, maxVal);
            priceSlider.min = 0;
            priceSlider.max = 500000;
            priceSlider.value = priceMax.value;
        };
        priceMin.addEventListener('input', () => { syncSlider(); renderPrograms(); });
        priceMax.addEventListener('input', () => { syncSlider(); renderPrograms(); });
        priceSlider.addEventListener('input', () => {
            priceMax.value = priceSlider.value;
            renderPrograms();
        });
        syncSlider();
    }

    if (resetFilters) {
        resetFilters.addEventListener('click', () => {
            catalogTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-pressed', 'false');
            });
            catalogTabs[0]?.classList.add('active');
            catalogTabs[0]?.setAttribute('aria-pressed', 'true');
            currentCategory = 'all';
            if (catalogGrid) {
                catalogGrid.querySelectorAll('.program-card').forEach(card => card.style.display = '');
            }
            priceMin && (priceMin.value = 0);
            priceMax && (priceMax.value = 500000);
            if (priceSlider) {
                priceSlider.min = 0;
                priceSlider.max = 500000;
                priceSlider.value = 500000;
            }
            sidebarSelects.forEach(sel => sel.selectedIndex = 0);
            sidebarChecks.forEach(ch => ch.checked = false);
            if (programSearchInput) {
                programSearchInput.value = '';
            }
            currentPage = 1;
            renderPrograms();
        });
    }

    // ????????? ?????? ????????
    const programListEl = document.getElementById('programList');
    const programCountEl = document.getElementById('programCount');
    const paginationEl = document.getElementById('pagination');
    const sortButtons = document.querySelectorAll('.sort-btn');
    const programSearchInput = document.getElementById('programSearch');
    const programSearchButton = document.getElementById('programSearchButton');
    const pageSizeButtons = [10, 20, 50];
    let currentCategory = 'all';
    let currentSort = 'date';
    let currentPage = 1;
    let pageSize = 10;

    const basePrograms = [
        {
            title: 'Профессиональные пробы',
            desc: 'Попробуйте себя в профессиях, посетите мастерские и выберите направление.',
            hours: 144,
            format: 'Очная',
            tag: 'Школьникам',
            label: 'Очная',
            categories: 'school',
            date: '2024-04-01',
            cost: 12000,
            center: 'ЦОПП',
            competence: 'IT',
            period: 'Весь год',
            organizer: 'ЦТРТЛТ',
            city: 'Самарская обл.',
            project: 'Основные',
            form: 'Очная',
            dot: 'none',
            ovz: true
        },
        {
            title: 'Дуальное обучение',
            desc: 'Практика на предприятии параллельно учебе. Наставники и индивидуальные траектории.',
            hours: 504,
            format: 'Очная',
            tag: 'Студентам',
            label: 'С применением ДОТ',
            categories: 'student',
            date: '2024-03-15',
            cost: 45000,
            center: 'ЦОПП',
            competence: 'IT',
            period: 'Весна',
            organizer: 'Партнеры',
            city: 'Самара',
            project: 'Основные',
            form: 'Очная',
            dot: 'partial',
            ovz: false
        },
        {
            title: 'Наставничество',
            desc: 'Программы адаптации, обучение наставников, поддержка корпоративных курсов.',
            hours: 16,
            format: 'Очная / онлайн',
            tag: 'Работодателям',
            label: 'Индивидуально',
            categories: 'employer,adult',
            date: '2024-02-20',
            cost: 8000,
            center: 'Партнерские',
            competence: 'Педагогика',
            period: 'Осень',
            organizer: 'Партнеры',
            city: 'Тольятти',
            project: 'Социальные',
            form: 'Очно-заочная',
            dot: 'partial',
            ovz: false
        },
        {
            title: 'Повышение квалификации',
            desc: 'Программы для преподавателей и мастеров, обновление методик и оборудования.',
            hours: 72,
            format: 'Очная / дистанционно',
            tag: 'Колледжам',
            label: 'Аудиторная',
            categories: 'org,adult',
            date: '2024-01-10',
            cost: 60000,
            center: 'ЦОПП',
            competence: 'Педагогика',
            period: 'Весь год',
            organizer: 'ЦТРТЛТ',
            city: 'Самарская обл.',
            project: 'Основные',
            form: 'Очно-заочная',
            dot: 'full',
            ovz: true
        },
        {
            title: 'Организация профмероприятий',
            desc: 'Дополнительная программа для педагогов по профориентации.',
            hours: 40,
            format: 'Очная',
            tag: 'Взрослым',
            label: 'С применением ДОТ',
            categories: 'adult',
            date: '2024-04-10',
            cost: 30000,
            center: 'ЦОПП',
            competence: 'Педагогика',
            period: 'Осень',
            organizer: 'ЦТРТЛТ',
            city: 'Самарская обл.',
            project: 'Социальные',
            form: 'Очная',
            dot: 'partial',
            ovz: false
        },
        {
            title: 'Цифровые навыки',
            desc: 'Базовые цифровые компетенции для разных возрастов.',
            hours: 24,
            format: 'Онлайн',
            tag: 'Школьникам',
            label: 'Онлайн',
            categories: 'school',
            date: '2024-02-05',
            cost: 5000,
            center: 'Партнерские',
            competence: 'IT',
            period: 'Весна',
            organizer: 'Партнеры',
            city: 'Тольятти',
            project: 'Основные',
            form: 'Заочная',
            dot: 'full',
            ovz: true
        },
        {
            title: 'Партнерские стажировки',
            desc: 'Стажировки у работодателей Самарской области.',
            hours: 120,
            format: 'Очная',
            tag: 'Работодателям',
            label: 'Очная',
            categories: 'employer',
            date: '2024-03-30',
            cost: 90000,
            center: 'Партнерские',
            competence: 'IT',
            period: 'Осень',
            organizer: 'Партнеры',
            city: 'Самара',
            project: 'Социальные',
            form: 'Очная',
            dot: 'none',
            ovz: false
        },
        {
            title: 'Педагог будущего',
            desc: 'Обновление методик и инструментов обучения.',
            hours: 90,
            format: 'Очная / дистанционно',
            tag: 'Колледжам',
            label: 'Дистанционно',
            categories: 'org',
            date: '2024-03-01',
            cost: 70000,
            center: 'ЦОПП',
            competence: 'Педагогика',
            period: 'Весь год',
            organizer: 'ЦТРТЛТ',
            city: 'Самарская обл.',
            project: 'Основные',
            form: 'Очно-заочная',
            dot: 'full',
            ovz: true
        }
    ];

    const programs = [];
    for (let i = 0; i < 50; i++) {
        const item = basePrograms[i % basePrograms.length];
        programs.push({
            ...item,
            title: `${item.title} #${i + 1}`,
            date: new Date(2024, 0, 1 + i).toISOString().slice(0, 10),
            cost: item.cost + i * 500
        });
    }

    const programDetailLinks = {
        'Профессиональные пробы': 'professional-orientation.html',
        'Дуальное обучение': 'dual-training.html',
        'Наставничество': 'contacts.html',
        'Повышение квалификации': 'contacts.html',
        'Организация профмероприятий': 'professional-orientation.html',
        'Цифровые навыки': 'contacts.html',
        'Партнерские стажировки': 'employers.html',
        'Педагог будущего': 'contacts.html'
    };

    const detailLinkFor = (program) => {
        const matchingTitle = Object.keys(programDetailLinks).find(title => program.title.startsWith(title));
        return matchingTitle ? programDetailLinks[matchingTitle] : 'contacts.html';
    };

    const renderPrograms = () => {
        if (!programListEl) return;

        const selectedForms = [
            formRemote?.checked ? 'Заочная' : null,
            formFulltime?.checked ? 'Очная' : null,
            formMixed?.checked ? 'Очно-заочная' : null
        ].filter(Boolean);
        const filterDot = dotFull?.checked ? 'full' : (dotPartial?.checked ? 'partial' : null);
        const minCost = Number(priceMin?.value) || 0;
        const maxInput = Number(priceMax?.value);
        const maxCost = maxInput > 0 ? maxInput : 500000;
        const query = (programSearchInput?.value || '').trim().toLocaleLowerCase('ru-RU');

        let filtered = programs.filter(p => currentCategory === 'all' || (p.categories || '').includes(currentCategory));

        filtered = filtered.filter(p => p.cost >= Math.min(minCost, maxCost) && p.cost <= Math.max(minCost, maxCost));
        if (query) {
            filtered = filtered.filter(p => `${p.title} ${p.desc} ${p.tag}`.toLocaleLowerCase('ru-RU').includes(query));
        }

        if (selectedForms.length) {
            filtered = filtered.filter(p => selectedForms.some(f => p.form.includes(f)));
        }
        if (filterDot) {
            filtered = filtered.filter(p => p.dot === filterDot);
        }
        if (ovzCheck?.checked) {
            filtered = filtered.filter(p => p.ovz);
        }
        filtered = filtered.filter(p => {
            if (filterCenter && filterCenter.value !== 'Все' && p.center !== filterCenter.value) return false;
            if (filterCompetence && filterCompetence.value !== 'Любые' && p.competence !== filterCompetence.value) return false;
            if (filterPeriod && filterPeriod.value !== 'Все' && p.period !== filterPeriod.value) return false;
            if (filterOrganizer && filterOrganizer.value !== 'Все' && p.organizer !== filterOrganizer.value) return false;
            if (filterCity && filterCity.value !== 'Все' && p.city !== filterCity.value) return false;
            if (filterProject && filterProject.value !== 'Все' && p.project !== filterProject.value) return false;
            return true;
        });

        if (currentSort === 'alpha') {
            filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        const total = filtered.length;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        currentPage = Math.min(currentPage, totalPages);
        const start = (currentPage - 1) * pageSize;
        const pageItems = filtered.slice(start, start + pageSize);

        programListEl.innerHTML = pageItems.length ? pageItems.map(p => `
            <article class="program-card">
                <div class="program-thumb">
                    <div class="thumb-badge">${p.label}</div>
                    <div class="thumb-duration"><span class="duration-dot"></span>${p.hours} часов</div>
                </div>
                <div class="program-info">
                    <div class="program-meta-row">
                        <span class="program-tag">${p.tag}</span>
                    </div>
                    <h3>${p.title}</h3>
                    <p>${p.desc}</p>
                    <div class="program-meta">
                        <span>${p.hours} часов</span>
                        <span>Формат: ${p.format}</span>
                        <span>Стоимость: ${p.cost.toLocaleString('ru-RU')} руб.</span>
                    </div>
                    <div class="program-actions">
                        <a class="btn" href="signup.html">Оставить заявку</a>
                        <a class="link-ghost" href="${detailLinkFor(p)}">Подробнее</a>
                    </div>
                </div>
            </article>
        `).join('') : '<p class="catalog-empty">По выбранным параметрам программы не найдены.</p>';

        if (programCountEl) {
            programCountEl.textContent = `Найдено ${total} программ`;
        }

        if (paginationEl) {
            const pages = [];
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            paginationEl.innerHTML = `
                <div class="pager">
                    ${pages.map(p => `<button data-page="${p}" class="${p === currentPage ? 'active' : ''}">${p}</button>`).join('')}
                </div>
                <div class="page-size">
                    <span>Отображать по:</span>
                    ${pageSizeButtons.map(size => `<button data-size="${size}" class="${size === pageSize ? 'active' : ''}">${size}</button>`).join('')}
                </div>
            `;
            paginationEl.querySelectorAll('.pager button').forEach(btn => {
                btn.addEventListener('click', () => {
                    currentPage = Number(btn.dataset.page) || 1;
                    renderPrograms();
                });
            });
            paginationEl.querySelectorAll('.page-size button').forEach(btn => {
                btn.addEventListener('click', () => {
                    pageSize = Number(btn.dataset.size) || 10;
                    currentPage = 1;
                    renderPrograms();
                });
            });
        }
    };

    const triggerFilters = () => {
        currentPage = 1;
        renderPrograms();
    };

    sidebarSelects.forEach(sel => sel.addEventListener('change', triggerFilters));
    sidebarChecks.forEach(ch => ch.addEventListener('change', triggerFilters));
    programSearchInput?.addEventListener('input', triggerFilters);
    programSearchButton?.addEventListener('click', triggerFilters);

    sortButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sortButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            currentSort = btn.dataset.sort || 'date';
            renderPrograms();
        });
    });

    renderPrograms();

    // Слайдер новостей управляем в index.html локальным скриптом

    // ???????? ?????? ??????? ????????? ?? ???????? ????????
    const infoNavLinks = document.querySelectorAll('.info-nav:not([data-section-navigation]) a[href^="#"]');
    const infoSections = Array.from(infoNavLinks)
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    function setActiveInfo(id) {
        infoNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${id}`);
        });
    }

    if (infoSections.length) {
        infoNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                const targetEl = targetId ? document.querySelector(targetId) : null;
                if (targetEl) {
                    e.preventDefault();
                    const offset = 140;
                    const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                    setActiveInfo(targetId.replace('#', ''));
                }
            });
        });

        // ????????? ??????? ????? ??? ??????? ????
        const initialHash = window.location.hash && window.location.hash.slice(1);
        if (initialHash) {
            setActiveInfo(initialHash);
        }
    }

    // ??????? ????????? ????????? ??? ???????
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealTargets = document.querySelectorAll([
        'section',
        '.direction-card',
        '.news-card',
        '.stat-item',
        '.contact-grid > div',
        '.contact-form',
        '.info-category',
        '.direction-tab',
        '.program-card',
        '.tile',
        '.service-cards article',
        '.doc-grid article',
        '.cta .shell > *',
        '.news-header',
        '.news-nav'
    ].join(', '));

    if (revealTargets.length && document.body.classList.contains('home-page') && !prefersReduced) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -48px', threshold: 0.08 });

        revealTargets.forEach((element, index) => {
            element.classList.add('reveal');
            element.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 0.045}s`);
            revealObserver.observe(element);
        });
    } else if (revealTargets.length) {
        revealTargets.forEach(el => {
            el.classList.remove('reveal');
            el.classList.add('revealed');
        });
    }

    // ???????? ????? ? ????? ??????????
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    const counted = new WeakSet();

    function animateNumber(el, target, duration = 3000) {
        const start = performance.now();
        const startVal = 0;
        const endVal = Number(target) || 0;
        const step = (now) => {
            const progress = Math.min(1, (now - start) / duration);
            const value = Math.round(startVal + (endVal - startVal) * progress);
            el.textContent = value.toLocaleString('ru-RU');
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }

    if (statNumbers.length) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    if (!counted.has(el)) {
                        const target = el.dataset.target;
                        animateNumber(el, target, el.classList.contains('stat-total') ? 4000 : 3000);
                        counted.add(el);
                    }
                }
            });
        }, { threshold: 0.3 });

        statNumbers.forEach(el => {
            el.textContent = '0';
            statsObserver.observe(el);
        });
    }
});
