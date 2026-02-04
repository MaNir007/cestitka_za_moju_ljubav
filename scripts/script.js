function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');

    const symbols = ['❤️', '💖', '🌹', '🌺', '🌷', '🌸', '🏵️'];
    heart.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];

    const startLeft = Math.random() * 100;
    const duration = Math.random() * 5 + 8;
    const size = Math.random() * 15 + 15;

    heart.style.left = startLeft + 'vw';
    heart.style.fontSize = size + 'px';
    heart.style.animationDuration = duration + 's';

    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

setInterval(createHeart, 800);

document.addEventListener('DOMContentLoaded', () => {
    const envelopes = document.querySelectorAll('.envelope-wrapper');

    envelopes.forEach(envelope => {
        envelope.addEventListener('click', function (e) {
            if (this.classList.contains('open')) {
                this.classList.remove('open');
                return;
            }

            this.classList.add('open');

            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            burstConfetti(centerX, centerY);
        });
    });
});

function burstConfetti(x, y) {
    const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#ffc6ff', '#f08080'];
    const shapes = ['🌸', '🌺', '•', '•', '•'];

    for (let i = 0; i < 40; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';

        if (Math.random() > 0.5) {
            confetti.innerText = shapes[Math.floor(Math.random() * shapes.length)];
            confetti.style.fontSize = (Math.random() * 10 + 10) + 'px';
        } else {
            confetti.style.width = Math.random() * 6 + 4 + 'px';
            confetti.style.height = Math.random() * 6 + 4 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
        }

        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '100';

        document.body.appendChild(confetti);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 6 + 3;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 3;

        let posX = x;
        let posY = y;
        let opacity = 1;
        let currentVy = vy;
        let rotation = 0;

        const animate = () => {
            posX += vx;
            posY += currentVy;
            currentVy += 0.2;
            opacity -= 0.015;
            rotation += 5;

            confetti.style.left = posX + 'px';
            confetti.style.top = posY + 'px';
            confetti.style.opacity = opacity;
            confetti.style.transform = `rotate(${rotation}deg)`;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };

        requestAnimationFrame(animate);
    }
}