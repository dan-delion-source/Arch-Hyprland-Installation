/* ==============================
   ARCH LINUX BLOG — INTERACTIVITY
   ============================== */

document.addEventListener('DOMContentLoaded', () => {

    // =============================
    // 1. SCROLL PROGRESS BAR
    // =============================
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = scrollPercent + '%';
    }

    // =============================
    // 2. ACTIVE NAV HIGHLIGHTING
    // =============================
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('.guide-section');
    const sideProgressItems = document.querySelectorAll('.side-progress-item');

    function updateActiveSection() {
        let currentSection = '';
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === currentSection);
        });

        sideProgressItems.forEach(item => {
            item.classList.toggle('active', item.dataset.target === currentSection);
        });
    }

    // =============================
    // 3. FADE-IN ON SCROLL
    // =============================
    const fadeElements = document.querySelectorAll('.fade-in');

    function checkFadeIn() {
        const triggerBottom = window.innerHeight * 0.88;
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < triggerBottom) {
                el.classList.add('visible');
            }
        });
    }

    // Combined scroll handler
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                updateActiveSection();
                checkFadeIn();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial call
    onScroll();

    // =============================
    // 4. COLLAPSIBLE SECTIONS
    // =============================
    const sectionHeaders = document.querySelectorAll('.section-header[data-collapse]');

    sectionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const targetId = header.dataset.collapse;
            const body = document.getElementById(targetId);
            if (!body) return;

            const isOpen = body.classList.contains('open');

            if (isOpen) {
                body.classList.remove('open');
                header.classList.add('collapsed');
            } else {
                body.classList.add('open');
                header.classList.remove('collapsed');
            }
        });
    });

    // =============================
    // 5. COPY BUTTONS
    // =============================
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const textToCopy = btn.dataset.copy;
            if (!textToCopy) return;

            try {
                await navigator.clipboard.writeText(textToCopy);
            } catch {
                // Fallback
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }

            // Show tooltip
            let tooltip = btn.querySelector('.tooltip');
            if (!tooltip) {
                tooltip = document.createElement('span');
                tooltip.className = 'tooltip';
                tooltip.textContent = 'Copied!';
                btn.appendChild(tooltip);
            }

            btn.classList.add('copied');
            const span = btn.querySelector('span:not(.tooltip)');
            const originalText = span ? span.textContent : '';
            if (span) span.textContent = 'Copied!';

            setTimeout(() => {
                btn.classList.remove('copied');
                if (span) span.textContent = originalText;
            }, 2000);
        });
    });

    // =============================
    // 6. THEME TOGGLE
    // =============================
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Load saved theme
    const savedTheme = localStorage.getItem('arch-guide-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('arch-guide-theme', next);
    });

    // =============================
    // 7. MOBILE MENU
    // =============================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksContainer = document.getElementById('navLinks');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinksContainer.classList.remove('open');
        });
    });

    // =============================
    // 8. SIDE PROGRESS CLICK
    // =============================
    sideProgressItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = document.getElementById(item.dataset.target);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // =============================
    // 9. SMOOTH SCROLL FOR ANCHORS
    // =============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
