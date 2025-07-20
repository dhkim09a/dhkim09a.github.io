document.addEventListener('DOMContentLoaded', () => {
    const countdown = () => {
        const countDate = new Date('October 25, 2025 14:00:00').getTime();
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

        document.getElementById('timer').innerText = `${textDay}d ${textHour}h ${textMinute}m ${textSecond}s`;

        if (gap < 0) {
            clearInterval(interval);
            document.getElementById('timer').innerText = "The day is here!";
        }
    };

    const interval = setInterval(countdown, 1000);

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

    // setInterval(createPetal, 3000);
});
