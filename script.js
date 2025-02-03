// Intro Screen

let intro = document.querySelector('.intro');
let logo = document.querySelector('.logo-header');
let logoSpan = document.querySelectorAll('.intro-logo');

window.addEventListener('DOMContentLoaded', ()=>{
    setTimeout(()=>{

        logoSpan.forEach((span, idx)=>{
            setTimeout(()=>{
                span.classList.add('active');
            }, (idx+1)*150)
        });

        setTimeout(()=>{
            logoSpan.forEach((span,idx)=>{
                setTimeout(()=>{
                    span.classList.remove('active');
                    span.classList.add('fade');
                }, (idx+1)*50)
            })
        },2000)

        setTimeout(()=>{
            intro.style.top='-100vh';
        },2300)
    })
})

// Scroll to top upon reload

window.onload = function() {
    window.scrollTo(0, 0);
};

// Hamburger navbar

function togglemenu(){
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

const observer = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        console.log(entry)
        if (entry.isIntersecting){
            entry.target.classList.add('show')
        } 
    });
});

const hiddenElements = document.querySelectorAll('.section__text');
hiddenElements.forEach((el)=>observer.observe(el));

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

