// Intro Screen

let intro = document.querySelector('.intro');
let logo = document.querySelector('.logo-header');
let logoSpan = document.querySelectorAll('.intro-logo');

window.addEventListener('DOMContentLoaded', () => {
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
        }, 2000)

        setTimeout(() => {
            intro.style.top = '-100vh';
        }, 2300)
    })
})

// Scroll to top upon reload

window.onload = function () {
    window.scrollTo(0, 0);
};

// Hamburger navbar

function togglemenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");

    // If the menu is open, add a click event listener to the document
    if (menu.classList.contains("open")) {
        document.addEventListener("click", closeMenuOnClickOutside);
    } else {
        document.removeEventListener("click", closeMenuOnClickOutside);
    }
}

function closeMenuOnClickOutside(event) {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");

    // Check if the click is outside the menu and the hamburger icon
    if (!menu.contains(event.target) && !icon.contains(event.target)) {
        menu.classList.remove("open");
        icon.classList.remove("open");

        // Remove the event listener after closing the menu
        document.removeEventListener("click", closeMenuOnClickOutside);
    }
}


// Into fade-blur transition

// Scroll Reveal Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, {
    threshold: 0.1 // Trigger when 10% of the element is visible
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// Navbar turns black on scroll

// function changeBG() {
//     var navbar = document.getElementById('desktop-nav');
//     var scrollValue = window.scrollY;
//     if(scrollValue < 25) {
//         navbar.classList.remove('bgcolor')
//     } else {
//         navbar.classList.add('bgcolor')
//     }
// }

// window.addEventListener('scroll', changeBG)

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

document.addEventListener('DOMContentLoaded', initThemeSwitcher);


// Project Modal Logic
const modal = document.getElementById("project-modal");
const closeModal = document.querySelector(".close-modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalTags = document.getElementById("modal-tags");

// Project Data
const projects = {
    "ASL": {
        title: "ASL Logo Design",
        img: "./Assets/ASL.jpg",
        desc: "A modern, minimalist logo design for ASL, focusing on clean lines and geometric shapes to convey stability and innovation. The design process involved multiple iterations to ensure the brand identity was perfectly captured.",
        tags: ["Branding", "Logo Design", "Illustrator"]
    },
    "Lumisnap": {
        title: "Lumisnap Brand Identity",
        img: "./Assets/Lumisnap.jpg",
        desc: "Complete brand identity for Lumisnap, a photography startup. The project included logo design, color palette selection, and marketing collateral. The goal was to create a vibrant and energetic brand that appeals to young creatives.",
        tags: ["Branding", "Identity", "Photoshop"]
    },
    "LaptopOffers": {
        title: "Laptop Offers Campaign",
        img: "./Assets/2ndoffers.jpg",
        desc: "A promotional campaign design for a tech retailer. This project involved creating eye-catching social media graphics and web banners to drive sales for laptop offers. The design focuses on high contrast and clear calls to action.",
        tags: ["Social Media", "Marketing", "Graphic Design"]
    }
};

function openModal(projectId) {
    const project = projects[projectId];
    if (!project) return;

    modalImg.src = project.img;
    modalTitle.textContent = project.title;
    modalDesc.textContent = project.desc;

    // Clear and add tags
    modalTags.innerHTML = "";
    project.tags.forEach(tag => {
        const span = document.createElement("span");
        span.className = "modal-tag";
        span.textContent = tag;
        modalTags.appendChild(span);
    });

    modal.style.display = "flex";
    // Small delay to allow display:flex to apply before adding opacity class for transition
    setTimeout(() => {
        modal.classList.add("open");
    }, 10);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
}

function closeModalFunc() {
    modal.classList.remove("open");
    setTimeout(() => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }, 300); // Wait for transition
}

closeModal.addEventListener("click", closeModalFunc);

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModalFunc();
    }
});

// Expose to global scope for HTML onclick
window.openProject = openModal;

