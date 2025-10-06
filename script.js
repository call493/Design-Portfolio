const intro = document.querySelector('.intro');
const logoSpan = document.querySelectorAll('.intro-logo');

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        logoSpan.forEach((span, idx) => {
            setTimeout(() => {
                span.classList.add('active');
            }, (idx + 1) * 150);
        });

        setTimeout(() => {
            logoSpan.forEach((span, idx) => {
                setTimeout(() => {
                    span.classList.remove('active');
                    span.classList.add('fade');
                }, (idx + 1) * 50);
            });
        }, 2000);

        setTimeout(() => {
            if (intro) {
                intro.style.top = '-100vh';
            }
        }, 2300);
    });
});

window.onload = function () {
    window.scrollTo(0, 0);
};

function togglemenu() {
    const menu = document.querySelector('.menu-links');
    const icon = document.querySelector('.hamburger-icon');
    if (!menu || !icon) return;
    menu.classList.toggle('open');
    icon.classList.toggle('open');

    if (menu.classList.contains('open')) {
        document.addEventListener('click', closeMenuOnClickOutside);
    } else {
        document.removeEventListener('click', closeMenuOnClickOutside);
    }
}

function closeMenuOnClickOutside(event) {
    const menu = document.querySelector('.menu-links');
    const icon = document.querySelector('.hamburger-icon');
    if (!menu || !icon) return;

    if (!menu.contains(event.target) && !icon.contains(event.target)) {
        menu.classList.remove('open');
        icon.classList.remove('open');
        document.removeEventListener('click', closeMenuOnClickOutside);
    }
}

function initRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.2
    });

    const targets = document.querySelectorAll('.section__text, .hero-focus, .service-card, .case-study-card, .testimonial-card, .showreel-media, .showreel-panels');
    targets.forEach((element) => observer.observe(element));
}

function initHeroFocus() {
    const heroFocus = document.querySelector('.hero-focus');
    const controls = document.querySelectorAll('.hero-focus-control');
    const panels = document.querySelectorAll('.hero-focus-panel');
    if (!heroFocus || controls.length === 0) return;

    const activate = (key) => {
        controls.forEach((button) => {
            const isActive = button.dataset.focus === key;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-selected', String(isActive));
        });

        panels.forEach((panel) => {
            const isMatch = panel.dataset.focusPanel === key;
            panel.classList.toggle('is-active', isMatch);
            if (isMatch) {
                panel.removeAttribute('hidden');
            } else {
                panel.setAttribute('hidden', '');
            }
        });
    };

    const defaultFocus = document.querySelector('.hero-focus-control.is-active')?.dataset.focus || controls[0].dataset.focus;
    activate(defaultFocus);

    controls.forEach((button) => {
        button.addEventListener('click', () => {
            activate(button.dataset.focus);
        });
    });

    heroFocus.addEventListener('pointermove', (event) => {
        const bounds = heroFocus.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;
        heroFocus.style.setProperty('--pointer-x', `${x}%`);
        heroFocus.style.setProperty('--pointer-y', `${y}%`);
    });

    heroFocus.addEventListener('pointerleave', () => {
        heroFocus.style.setProperty('--pointer-x', '50%');
        heroFocus.style.setProperty('--pointer-y', '50%');
    });
}

function initServiceAccordions() {
    const toggles = document.querySelectorAll('.service-toggle');
    if (toggles.length === 0) return;

    const collapse = (button) => {
        const panelId = button.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);
        if (!panel) return;
        panel.hidden = true;
        button.setAttribute('aria-expanded', 'false');
        const card = button.closest('.service-card');
        if (card) {
            card.classList.remove('is-expanded');
        }
    };

    const expand = (button) => {
        const panelId = button.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);
        if (!panel) return;
        panel.hidden = false;
        button.setAttribute('aria-expanded', 'true');
        const card = button.closest('.service-card');
        if (card) {
            card.classList.add('is-expanded');
        }
    };

    toggles.forEach((button) => {
        if (button.getAttribute('aria-expanded') === 'true') {
            expand(button);
        } else {
            collapse(button);
        }
    });

    toggles.forEach((button) => {
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            toggles.forEach((other) => {
                if (other !== button) {
                    collapse(other);
                }
            });
            if (isExpanded) {
                collapse(button);
            } else {
                expand(button);
            }
        });
    });
}

function initCaseStudyFilter() {
    const filterButtons = document.querySelectorAll('.case-filter-button');
    const cards = document.querySelectorAll('.case-study-card');
    if (filterButtons.length === 0 || cards.length === 0) return;

    const applyFilter = (category) => {
        filterButtons.forEach((button) => {
            const isActive = button.dataset.filter === category;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-selected', String(isActive));
        });

        cards.forEach((card) => {
            const categories = (card.dataset.categories || '').split(',');
            const shouldShow = category === 'all' || categories.includes(category);
            card.classList.toggle('is-hidden', !shouldShow);
        });
    };

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            applyFilter(button.dataset.filter);
        });
    });
}

function initShowreelTimeline() {
    const timelineDots = document.querySelectorAll('.showreel-timeline-dot');
    const panels = document.querySelectorAll('.showreel-panel');
    if (timelineDots.length === 0) return;

    const activate = (segment) => {
        timelineDots.forEach((dot) => {
            const isActive = dot.dataset.segment === segment;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-selected', String(isActive));
        });

        panels.forEach((panel) => {
            const isMatch = panel.dataset.segmentPanel === segment;
            panel.classList.toggle('is-active', isMatch);
            if (isMatch) {
                panel.removeAttribute('hidden');
            } else {
                panel.setAttribute('hidden', '');
            }
        });
    };

    timelineDots.forEach((dot) => {
        dot.addEventListener('click', () => {
            activate(dot.dataset.segment);
        });
    });
}

function initCopyToClipboard() {
    const copyButtons = document.querySelectorAll('[data-copy-target]');
    if (copyButtons.length === 0) return;

    copyButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const text = button.dataset.copyTarget;
            if (!text) return;
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(text);
                } else {
                    const input = document.createElement('input');
                    input.value = text;
                    document.body.appendChild(input);
                    input.select();
                    document.execCommand('copy');
                    document.body.removeChild(input);
                }
                button.classList.add('is-copied');
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.classList.remove('is-copied');
                    button.textContent = 'Copy email';
                }, 1600);
            } catch (error) {
                button.textContent = 'Copy manually';
            }
        });
    });
}

function initParallax() {
    const profileSection = document.getElementById('profile');
    if (!profileSection) return;

    const update = () => {
        const offset = window.scrollY * 0.12;
        profileSection.style.setProperty('--profile-parallax', `${offset}px`);
    };

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                update();
                ticking = false;
            });
            ticking = true;
        }
    });

    update();
}

function setTheme(theme) {
    document.body.classList.remove('theme-minimal', 'theme-retro', 'theme-glass');
    document.body.classList.add('theme-' + theme);
    localStorage.setItem('selectedTheme', theme);
}

function initThemeSwitcher() {
    const switcher = document.getElementById('theme-switcher');
    const switcherMobile = document.getElementById('theme-switcher-mobile');
    const savedTheme = localStorage.getItem('selectedTheme') || 'minimal';
    setTheme(savedTheme);
    if (switcher) switcher.value = savedTheme;
    if (switcherMobile) switcherMobile.value = savedTheme;
    if (switcher) {
        switcher.addEventListener('change', function () {
            setTheme(this.value);
            if (switcherMobile) switcherMobile.value = this.value;
        });
    }
    if (switcherMobile) {
        switcherMobile.addEventListener('change', function () {
            setTheme(this.value);
            if (switcher) switcher.value = this.value;
        });
    }
}

function initPageInteractions() {
    initRevealAnimations();
    initHeroFocus();
    initServiceAccordions();
    initCaseStudyFilter();
    initShowreelTimeline();
    initCopyToClipboard();
    initParallax();
}

document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitcher();
    initPageInteractions();
});
