document.addEventListener('DOMContentLoaded', () => {
    const countdown = () => {
        const countDate = new Date('January 18, 2026 11:00:00').getTime();
        const now = new Date().getTime();
        const gap = countDate - now;

        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const textDay = Math.floor(gap / day);
        const textHour = Math.floor((gap % day) / hour);
        const textMinute = Math.floor((gap % hour) / minute);
        const textSecond = Math.floor((gap % minute) / second);

        document.getElementById('timer').innerText = `${textDay}일 ${textHour}시간 ${textMinute}분 ${textSecond}초`;

        if (gap < 0) {
            clearInterval(interval);
            document.getElementById('timer').innerText = "결혼식 당일입니다!";
        }
    };

    // const interval = setInterval(countdown, 1000);

    /* Petal Animation */
    const petalContainer = document.createElement('div');
    petalContainer.id = 'petal-container';
    document.body.appendChild(petalContainer);

    const piledPetals = [];
    const maxPiledPetals = 100;

    function createPetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');

        const animationDuration = Math.random() * 7 + 8; // 8 to 15 seconds
        const startPosition = Math.random() * window.innerWidth;

        petal.style.left = `${startPosition}px`;
        petal.style.animationDuration = `${animationDuration}s`;

        petal.addEventListener('animationend', () => {
            petal.style.animation = 'none';

            const pileHeight = 50;
            const randomOffset = Math.random() * pileHeight;
            petal.style.top = `${window.innerHeight - randomOffset}px`;

            piledPetals.push(petal);

            if (piledPetals.length > maxPiledPetals) {
                const oldestPetal = piledPetals.shift();
                if (oldestPetal) {
                    oldestPetal.remove();
                }
            }
        });

        petalContainer.appendChild(petal);
    }

    // setInterval(createPetal, 300);

    /* FAB and Particle Animation */
    const fab = document.getElementById('fab');
    const particleContainer = document.createElement('div');
    particleContainer.id = 'particle-container';
    document.body.appendChild(particleContainer);

    const setParticleContainerHeight = () => {
        particleContainer.style.height = `${document.body.scrollHeight}px`;
    };
    setParticleContainerHeight();
    window.addEventListener('resize', setParticleContainerHeight);

    const particleColors = ['#ffb7c5', '#ffc2d1', '#fde2e4', '#ffffff'];
    const piledParticles = [];
    const maxPiledParticles = 200;
    const activeParticles = [];

    fab.addEventListener('click', () => {
        const fabRect = fab.getBoundingClientRect();
        for (let i = 0; i < 50; i++) {
            createParticle(fabRect);
        }
        if (activeParticles.length > 0 && !animationRunning) {
            runAnimation();
        }
    });

    function createParticle(fabRect) {
        const element = document.createElement('div');
        element.classList.add('particle');
        particleContainer.appendChild(element);

        const size = Math.random() * 5 + 8; // Petals are a bit larger
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.backgroundColor = particleColors[Math.floor(Math.random() * particleColors.length)];

        const x = fabRect.left + window.scrollX + fabRect.width / 2;
        const y = fabRect.top + window.scrollY + fabRect.height / 2;

        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;
        const angleToCenter = Math.atan2(screenCenterY - (fabRect.top + fabRect.height / 2), screenCenterX - (fabRect.left + fabRect.width / 2));
        
        const spread = Math.PI / 2;
        const angle = angleToCenter + (Math.random() - 0.5) * spread;

        const speed = Math.random() * 15 + 8;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const gravity = 0.2; // Lighter petals fall slower
        
        let rotation = Math.random() * 360;
        const rotationSpeed = Math.random() * 10 - 5;

        const pileHeight = 50;
        const randomYOffset = Math.random() * pileHeight;
        const finalY = document.body.scrollHeight - randomYOffset;

        activeParticles.push({ element, x, y, vx, vy, gravity, finalY, size, rotation, rotationSpeed });
    }

    let lastTime = 0;
    let animationRunning = false;
    function runAnimation(currentTime) {
        if (!lastTime) {
            lastTime = currentTime;
        }
        const deltaTime = (currentTime - lastTime) / 16.67; // Normalize to a 60fps baseline
        lastTime = currentTime;
        animationRunning = true;

        const screenWidth = document.documentElement.clientWidth;
        
        for (let i = activeParticles.length - 1; i >= 0; i--) {
            const p = activeParticles[i];

            p.vy += p.gravity * deltaTime;
            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;
            p.rotation += p.rotationSpeed * deltaTime;

            if (p.x < -p.size || p.x > screenWidth) {
                p.element.remove();
                activeParticles.splice(i, 1);
            } else if (p.y >= p.finalY) {
                p.element.style.transform = `translate3d(${p.x}px, ${p.finalY}px, 0) rotate(${p.rotation}deg)`;
                piledParticles.push(p.element);
                if (piledParticles.length > maxPiledParticles) {
                    const oldestParticle = piledParticles.shift();
                    if (oldestParticle) {
                        oldestParticle.remove();
                    }
                }
                activeParticles.splice(i, 1);
            } else {
                p.element.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotation}deg)`;
            }
        }

        if (activeParticles.length > 0) {
            requestAnimationFrame(runAnimation);
        } else {
            animationRunning = false;
            lastTime = 0; // Reset for the next animation trigger
        }
    }

    /* Gallery */
    const galleryContainer = document.querySelector('.gallery-images');
    const imageViewer = document.getElementById('image-viewer');
    const fullImage = document.getElementById('full-image');
    const closeViewer = document.querySelector('.close-viewer');

    imageFiles.forEach(fileName => {
        const img = document.createElement('img');
        img.src = `assets/album/${fileName}`;
        img.alt = 'Wedding photo';
        galleryContainer.appendChild(img);

        img.addEventListener('click', () => {
            imageViewer.style.display = 'block';
            fullImage.src = img.src;
        });
    });

    closeViewer.addEventListener('click', () => {
        imageViewer.style.display = 'none';
    });

    imageViewer.addEventListener('click', (e) => {
        if (e.target === imageViewer) {
            imageViewer.style.display = 'none';
        }
    });
});
