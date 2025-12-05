/* -----------------------------------------------------------
   1. INTRO LOADER ANIMATION
----------------------------------------------------------- */
let intro = document.querySelector('.intro');
let logo = document.querySelector('.logo-header');
let logoSpan = document.querySelectorAll('.intro-logo');

window.addEventListener('DOMContentLoaded', () => {
    // Only run intro if elements exist (optional check)
    if(logoSpan.length > 0) {
        setTimeout(() => {
            logoSpan.forEach((span, idx) => {
                setTimeout(() => {
                    span.classList.add('active');
                }, (idx + 1) * 150)
            });

            setTimeout(() => {
                logoSpan.forEach((span, idx) => {
                    setTimeout(() => {
                        span.classList.remove('active');
                        span.classList.add('fade');
                    }, (idx + 1) * 50)
                })
            }, 2000);

            setTimeout(() => {
                if(intro) intro.style.top = '-100vh';
            }, 2300);
        });
    }
});

// Reset scroll on reload
window.onload = function () {
    window.scrollTo(0, 0);
};

/* -----------------------------------------------------------
   2. NAVIGATION & HAMBURGER MENU
----------------------------------------------------------- */
function togglemenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");

    if (menu.classList.contains("open")) {
        document.addEventListener("click", closeMenuOnClickOutside);
    } else {
        document.removeEventListener("click", closeMenuOnClickOutside);
    }
}

function closeMenuOnClickOutside(event) {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");

    if (!menu.contains(event.target) && !icon.contains(event.target)) {
        menu.classList.remove("open");
        icon.classList.remove("open");
        document.removeEventListener("click", closeMenuOnClickOutside);
    }
}

/* -----------------------------------------------------------
   3. SCROLL-TO-TOP BUTTON
----------------------------------------------------------- */
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

if (scrollToTopBtn) {
    window.addEventListener("scroll", () => {
        // Show button after scrolling down 500px
        if (window.scrollY > 500) {
            scrollToTopBtn.classList.add("visible");
        } else {
            scrollToTopBtn.classList.remove("visible");
        }
    }, { passive: true });

    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/* -----------------------------------------------------------
   4. SCROLL ANIMATIONS (Reveal + Count Up)
----------------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            
            // Handle Number Count Up
            if (entry.target.classList.contains('metric-number') || entry.target.querySelector('.metric-number')) {
                // Determine if target is the number itself or container
                const numEl = entry.target.classList.contains('metric-number') ? entry.target : entry.target.querySelector('.metric-number');
                if(numEl && !numEl.dataset.done) animateCount(numEl);
            }
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

const hiddenElements = document.querySelectorAll('.hidden, .metric-item');
hiddenElements.forEach((el) => revealObserver.observe(el));

function animateCount(el) {
    // Extract number from text (e.g. "03+" -> 3)
    const originalText = el.innerText; 
    const target = parseInt(originalText.replace(/\D/g, '')); 
    const suffix = originalText.replace(/[0-9]/g, ''); // Keep "+", "%" etc.
    
    if(!target) return; // Guard clause

    const duration = 1500;
    const start = performance.now();

    const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        // Easing function for smooth stop
        const easeOut = 1 - Math.pow(1 - progress, 3); 
        const value = Math.floor(easeOut * target);
        
        // Pad with 0 if original was "03"
        const displayValue = (target < 10 && value < 10 && originalText.startsWith('0')) ? `0${value}` : value;
        
        el.textContent = `${displayValue}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.dataset.done = 'true';
            el.textContent = originalText; // Ensure exact final match
        }
    };
    requestAnimationFrame(step);
}

/* -----------------------------------------------------------
   5. NAVBAR ACTIVE STATE & PROGRESS BAR
----------------------------------------------------------- */
const progressBar = document.getElementById('progress-bar');
const sections = Array.from(document.querySelectorAll('section'));
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));

function setActiveLink(current) {
    navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        const id = href && href.startsWith('#') ? href.slice(1) : '';
        // Only toggle active if it's an anchor link, not external page
        if (id) link.classList.toggle('active', id === current);
    });
}

function handleScroll() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || window.scrollY;
    const docHeight = doc.scrollHeight - doc.clientHeight;
    
    // Progress Bar
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = `${progress}%`;

    // Active Link Logic
    const triggerLine = window.innerHeight * 0.35;
    let currentSection = 'profile'; // Default to top
    
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= triggerLine && rect.bottom >= triggerLine) {
            currentSection = section.id;
        }
    });
    setActiveLink(currentSection);
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll(); // Init on load

/* -----------------------------------------------------------
   6. PROJECT MODAL LOGIC
----------------------------------------------------------- */
const modal = document.getElementById("project-modal");
const closeModal = document.querySelector(".close-modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");

// We create a container for tags inside the modal text area dynamically if it doesn't exist
let modalTagsContainer = document.querySelector(".modal-tags-container");
if (!modalTagsContainer && document.querySelector(".modal-text")) {
    modalTagsContainer = document.createElement("div");
    modalTagsContainer.className = "modal-tags-container";
    // Insert after title, before desc
    modalTitle.parentNode.insertBefore(modalTagsContainer, modalDesc);
}

// Project Data
const projects = {
    "ASL": {
        title: "ASL Logistics Identity",
        img: "./Assets/ASL.jpg",
        desc: "A comprehensive branding project for ASL Logistics. The goal was to create a visual identity that communicates speed, reliability, and global reach. I utilized negative space and bold typography to create a logo that stands out on fleet vehicles and digital platforms.",
        tags: ["Branding", "Identity", "Illustrator"]
    },
    "Lumisnap": {
        title: "Lumisnap Interface Design",
        img: "./Assets/Lumisnap.jpg",
        desc: "UI/UX design for a modern photography portfolio platform. The focus was on a dark-mode first approach to let the photography stand out. Key features include a drag-and-drop gallery manager and seamless client proofing tools.",
        tags: ["UI/UX", "Figma", "App Design"]
    },
    "LaptopOffers": {
        title: "Laptop Offers E-commerce",
        img: "./Assets/2ndoffers.jpg",
        desc: "A high-conversion landing page and e-commerce platform for refurbished electronics. I handled both the UI design and the Front-end development, ensuring the site was responsive and accessible. Sales increased by 40% post-launch.",
        tags: ["Web Dev", "HTML/CSS", "Conversion"]
    }
};

function openModal(projectId) {
    const project = projects[projectId];
    if (!project) return;

    modalImg.src = project.img;
    modalTitle.textContent = project.title;
    modalDesc.textContent = project.desc;

    // Reset and add tags
    if (modalTagsContainer) {
        modalTagsContainer.innerHTML = "";
        // Re-use the 'work-tags' styling or 'tech-tag' styling
        modalTagsContainer.style.display = "flex";
        modalTagsContainer.style.gap = "10px";
        modalTagsContainer.style.marginBottom = "16px";

        project.tags.forEach(tag => {
            const span = document.createElement("span");
            // Inline styles to match the 'tech-tag' look from CSS
            span.style.fontFamily = "var(--font-mono)";
            span.style.fontSize = "0.75rem";
            span.style.color = "var(--accent)";
            span.style.border = "1px solid var(--accent)";
            span.style.padding = "4px 12px";
            span.style.borderRadius = "50px";
            span.textContent = tag;
            modalTagsContainer.appendChild(span);
        });
    }

    modal.style.display = "flex";
    setTimeout(() => {
        modal.classList.add("open");
    }, 10);
    document.body.style.overflow = "hidden"; 
}

function closeModalFunc() {
    modal.classList.remove("open");
    setTimeout(() => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }, 300);
}

if(closeModal) closeModal.addEventListener("click", closeModalFunc);

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModalFunc();
    }
});

// Expose to global scope for HTML onclick
window.openProject = openModal;

/* -----------------------------------------------------------
   7. HERO PARALLAX (Subtle movement)
----------------------------------------------------------- */
const hero = document.getElementById('profile');
const heroPhoto = document.querySelector('.hero-photo-container'); 
const heroImg = document.querySelector('.hero-img');

if (hero && heroPhoto && heroImg) {
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        // Calculate mouse position relative to center
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        
        // Move container slightly
        heroPhoto.style.transform = `translate3d(${x * 15}px, ${y * 15}px, 0)`;
        // Move image slightly more (parallax depth)
        heroImg.style.transform = `translate3d(${x * 25}px, ${y * 25}px, 0) rotate(${x * 2}deg)`;
    });

    hero.addEventListener('mouseleave', () => {
        // Reset
        heroPhoto.style.transform = 'translate3d(0, 0, 0)';
        heroImg.style.transform = 'translate3d(0, 0, 0) rotate(3deg)'; // Back to CSS default
    });
}

/* -----------------------------------------------------------
   8. PARTICLE BACKGROUND (Updated for Dark Theme)
----------------------------------------------------------- */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const particleConfig = {
    count: 80,
    maxVelocity: 0.5,
    linkDistance: 150,
    mouseRadius: 180
};
let particles = [];
const mousePos = { x: null, y: null };

function resizeCanvas() {
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
}

function initParticles() {
    if (!canvas || !ctx) return;
    particles = Array.from({ length: particleConfig.count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * particleConfig.maxVelocity,
        vy: (Math.random() - 0.5) * particleConfig.maxVelocity
    }));
}

function drawParticles() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Update and draw
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

        // Mouse Interact
        if (mousePos.x !== null) {
            const dx = p.x - mousePos.x;
            const dy = p.y - mousePos.y;
            const dist = Math.hypot(dx, dy);
            if (dist < particleConfig.mouseRadius && dist > 0) {
                const force = (particleConfig.mouseRadius - dist) / particleConfig.mouseRadius * 0.03;
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
            }
        }

        // Draw Dot - Using Purple Accent with low opacity
        ctx.fillStyle = 'rgba(157, 78, 221, 0.4)'; 
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw Lines
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist < particleConfig.linkDistance) {
                // Fade out line based on distance
                const alpha = 1 - dist / particleConfig.linkDistance;
                // Line color: very subtle purple/white mix
                ctx.strokeStyle = `rgba(157, 78, 221, ${alpha * 0.15})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(drawParticles);
}

if (canvas && ctx) {
    resizeCanvas();
    initParticles();
    requestAnimationFrame(drawParticles);

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    window.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
        mousePos.x = null;
        mousePos.y = null;
    });
}