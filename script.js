const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionContainer = document.getElementById('questionContainer');
const flowerContainer = document.getElementById('flowerContainer');
const loveMessage = document.getElementById('loveMessage');
const confettiCanvas = document.getElementById('confettiCanvas');
const fireworksCanvas = document.getElementById('fireworksCanvas');
const cursorTrail = document.getElementById('cursorTrail');
const particlesContainer = document.getElementById('particles');
const hearts3dContainer = document.getElementById('hearts3d');
const flowerGarden = document.getElementById('flowerGarden');
const bgMusic = document.getElementById('bgMusic');

// Initialize canvases
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;
fireworksCanvas.width = window.innerWidth;
fireworksCanvas.height = window.innerHeight;

const confettiCtx = confettiCanvas.getContext('2d');
const fireworksCtx = fireworksCanvas.getContext('2d');

// Typewriter effect
function typeWriter(element, text, speed = 30) {
    let i = 0;
    element.textContent = '';
    const cursor = element.querySelector('::after') || element;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            setTimeout(() => {
                element.style.removeProperty('--cursor');
            }, 500);
        }
    }
    type();
}

// Start typewriter on load
window.addEventListener('load', () => {
    const text = loveMessage.getAttribute('data-text');
    typeWriter(loveMessage, text);
    
    // Try to play music on load
    bgMusic.play().catch(e => {
        console.log('Autoplay blocked, will play on first interaction');
        // Play on first user interaction
        document.body.addEventListener('click', () => {
            bgMusic.play();
        }, { once: true });
    });
});

// Confetti system
class Confetti {
    constructor() {
        this.particles = [];
        this.colors = ['#ff6b9d', '#ffa6c9', '#ff1744', '#f50057', '#ffd700', '#ff4081'];
    }
    
    create() {
        for (let i = 0; i < 150; i++) {
            this.particles.push({
                x: Math.random() * confettiCanvas.width,
                y: -20,
                size: Math.random() * 8 + 4,
                speedY: Math.random() * 3 + 2,
                speedX: Math.random() * 4 - 2,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 10 - 5
            });
        }
    }
    
    animate() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        this.particles.forEach((p, index) => {
            confettiCtx.save();
            confettiCtx.translate(p.x, p.y);
            confettiCtx.rotate(p.rotation * Math.PI / 180);
            confettiCtx.fillStyle = p.color;
            confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            confettiCtx.restore();
            
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;
            
            if (p.y > confettiCanvas.height) {
                this.particles.splice(index, 1);
            }
        });
        
        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        }
    }
}

// Fireworks system
class Fireworks {
    constructor() {
        this.fireworks = [];
        this.particles = [];
    }
    
    create() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.addFirework();
            }, i * 400);
        }
    }
    
    addFirework() {
        const x = Math.random() * fireworksCanvas.width;
        const y = Math.random() * fireworksCanvas.height * 0.5 + 100;
        const colors = ['#ff6b9d', '#ffa6c9', '#ff1744', '#ffd700', '#ff4081', '#fff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        for (let i = 0; i < 50; i++) {
            const angle = (Math.PI * 2 * i) / 50;
            const speed = Math.random() * 4 + 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                color: color,
                size: Math.random() * 3 + 2
            });
        }
    }
    
    animate() {
        fireworksCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        fireworksCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
        
        this.particles.forEach((p, index) => {
            fireworksCtx.beginPath();
            fireworksCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            fireworksCtx.fillStyle = p.color;
            fireworksCtx.globalAlpha = p.life;
            fireworksCtx.fill();
            
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // gravity
            p.life -= 0.01;
            
            if (p.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
        
        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
        }
    }
}

// When she clicks Yes
yesBtn.addEventListener('click', () => {
    // Ensure music is playing
    if (bgMusic.paused) {
        bgMusic.play().catch(e => console.log('Audio play failed:', e));
    }
    
    // Screen shake
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 500);
    
    // Start confetti
    const confetti = new Confetti();
    confetti.create();
    confetti.animate();
    
    // Start fireworks
    const fireworks = new Fireworks();
    fireworks.create();
    fireworks.animate();
    
    // Create 3D hearts
    createFloating3DHearts();
    
    // Create more flowers
    createMultipleFlowers();
    
    questionContainer.style.animation = 'fadeOut 0.5s ease forwards';
    
    setTimeout(() => {
        questionContainer.style.display = 'none';
        flowerContainer.classList.add('show');
    }, 500);
});

// Make the No button run away when hovering
noBtn.addEventListener('mouseover', () => {
    const maxX = window.innerWidth - noBtn.offsetWidth - 100;
    const maxY = window.innerHeight - noBtn.offsetHeight - 100;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
});

// Sparkle cursor trail
let lastSparkleTime = 0;
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSparkleTime > 50) {
        createSparkle(e.clientX, e.clientY);
        lastSparkleTime = now;
    }
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-trail';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    cursorTrail.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 800);
}

// Ambient particles
function createAmbientParticles() {
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');
        particlesContainer.appendChild(particle);
    }
}

// 3D floating hearts
function createFloating3DHearts() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-3d';
            heart.innerHTML = '<div class="heart-core"></div>';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = Math.random() * 100 + '%';
            heart.style.animationDelay = Math.random() * 2 + 's';
            heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
            hearts3dContainer.appendChild(heart);
            
            setTimeout(() => heart.remove(), 10000);
        }, i * 200);
    }
}

// Create multiple flowers
function createMultipleFlowers() {
    const originalFlower = flowerGarden.querySelector('.flower');
    
    for (let i = 0; i < 2; i++) {
        setTimeout(() => {
            const newFlower = originalFlower.cloneNode(true);
            newFlower.style.animationDelay = (i * 0.5) + 's';
            newFlower.style.transform = `scale(${0.7 + Math.random() * 0.3})`;
            flowerGarden.appendChild(newFlower);
        }, i * 1000);
    }
}

// Parallax effect on container
questionContainer.addEventListener('mousemove', (e) => {
    const rect = questionContainer.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    questionContainer.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
});

questionContainer.addEventListener('mouseleave', () => {
    questionContainer.style.transform = '';
});

// Initialize ambient particles
createAmbientParticles();

// Add fadeOut animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: scale(0.8) rotateY(90deg);
        }
    }
`;
document.head.appendChild(style);

// Handle window resize
window.addEventListener('resize', () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
});
