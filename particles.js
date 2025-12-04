// Particle Network Animation
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// Mouse position
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80)
}

window.addEventListener('mousemove',
    function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

// Create Particle
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    // Method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(210, 205, 193, 0.3)'; // Reduced opacity
        ctx.fill();
    }
    // Check particle position, check mouse position, move the particle, draw the particle
    update() {
        // Check if particle is still within canvas
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Check collision detection - mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10;
            }
        }
        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;
        // Draw particle
        this.draw();
    }
}

// Helper to get CSS variable value
function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Create particle array
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 20000;
    let color = getCssVar('--particle-color'); // Get initial color

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Check if particles are close enough to draw line between them
function connect() {
    let opacityValue = 1;
    let lineColor = getCssVar('--particle-line-color'); // Get current line color

    // Parse rgba from the variable to inject opacity
    // Assuming variable is like "rgba(r, g, b, a)" or hex. 
    // For simplicity, let's just use the variable directly but we need dynamic opacity.
    // A robust way is to store the base RGB in CSS.
    // Hack: Let's just use the variable as base.

    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);

                // We need to apply opacity to the CSS variable color.
                // Since parsing is complex, let's rely on the fact that we updated the variable in CSS
                // and just set the strokeStyle. But wait, opacity varies by distance.
                // Let's use the particle color and modify alpha.

                ctx.strokeStyle = lineColor.replace(')', `, ${opacityValue})`).replace('rgb', 'rgba').replace('rgbaa', 'rgba');
                // This is a bit hacky. Let's try a cleaner approach.
                // We will just set globalAlpha.

                ctx.globalAlpha = opacityValue;
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
                ctx.globalAlpha = 1; // Reset
            }
        }
    }
}

// Update particles on theme change
window.updateParticlesTheme = function () {
    let newColor = getCssVar('--particle-color');
    particlesArray.forEach(p => p.color = newColor);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Resize event
window.addEventListener('resize',
    function () {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height / 80) * (canvas.height / 80));
        init();
    }
);

// Mouse out event
window.addEventListener('mouseout',
    function () {
        mouse.x = undefined;
        mouse.y = undefined;
    }
)

init();
animate();
