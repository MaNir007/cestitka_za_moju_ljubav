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

const bgMusic = document.getElementById('bgMusic');
const paperSound = document.getElementById('paperSound');

document.body.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(e => console.log('Audio autoplay prevented'));
    }
}, { once: true });

document.addEventListener('DOMContentLoaded', () => {
    const envelopes = document.querySelectorAll('.envelope-wrapper');
    const timerDisplay = document.getElementById('timerDisplay');

    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    function updateTimer() {
        const now = new Date();
        const diff = now - startDate;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        timerDisplay.innerHTML = `${days} dana, ${hours} sati, ${minutes} min, ${seconds} sec`;
    }

    setInterval(updateTimer, 1000);
    updateTimer();

    const envelopePhotos = [
        [
            'https://picsum.photos/200/200?random=1',
            'https://picsum.photos/200/200?random=2',
            'https://picsum.photos/200/200?random=3'
        ],
        [
            'https://picsum.photos/200/200?random=4',
            'https://picsum.photos/200/200?random=5',
            'https://picsum.photos/200/200?random=6'
        ]
    ];

    envelopes.forEach((envelope, index) => {
        const letterContent = envelope.querySelector('.letter-content');
        envelope.dataset.originalContent = letterContent.innerHTML;

        envelope.addEventListener('click', function (e) {
            if (e.target.closest('.polaroid')) return;

            const isOpen = this.classList.contains('open');

            if (isOpen) {
                this.classList.remove('open');

                const polaroids = document.querySelectorAll(`.polaroid[data-envelope="${index}"]`);
                polaroids.forEach(p => {
                    p.style.animation = 'polaroidRetract 0.5s forwards';
                    setTimeout(() => p.remove(), 500);
                });

                letterContent.dataset.typed = 'false';
                letterContent.innerHTML = envelope.dataset.originalContent;

            } else {
                envelopes.forEach((env, i) => {
                    if (env !== this && env.classList.contains('open')) {
                        env.click();
                    }
                });

                this.classList.add('open');

                paperSound.currentTime = 0;
                paperSound.play().catch(e => console.log('Audio error'));

                const rect = this.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                burstConfetti(centerX, centerY);

                setTimeout(() => {
                    spawnPolaroids(centerX, centerY, envelopePhotos[index], index);
                    typeWriterEffect(letterContent);
                }, 400);
            }
        });
    });
});

document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.85) {
        const dust = document.createElement('div');
        dust.classList.add('dust-particle');
        dust.style.left = e.pageX + 'px';
        dust.style.top = e.pageY + 'px';
        document.body.appendChild(dust);
        setTimeout(() => dust.remove(), 1500);
    }
});


function spawnPolaroids(x, y, images, envelopeIndex) {
    const isMobile = window.innerWidth < 600;

    images.forEach((imgSrc, i) => {
        setTimeout(() => {
            const polaroid = document.createElement('div');
            polaroid.classList.add('polaroid');
            polaroid.dataset.envelope = envelopeIndex;

            let targetX, targetY;

            if (isMobile) {
                if (i === 0) {
                    targetX = x - 80;
                    targetY = y + 220;
                } else if (i === 1) {
                    targetX = x + 80;
                    targetY = y + 220;
                } else {
                    targetX = x;
                    targetY = y + 340;
                }

                targetX = Math.max(60, Math.min(window.innerWidth - 60, targetX));

            } else {
                const offset = 280;

                if (i === 0) {
                    targetX = x - offset - (Math.random() * 50);
                    targetY = y + (Math.random() * 100 - 50);
                } else if (i === 1) {
                    targetX = x + offset + (Math.random() * 50);
                    targetY = y + (Math.random() * 100 - 50);
                } else {
                    const side = Math.random() > 0.5 ? 1 : -1;
                    targetX = x + (side * (offset + 20 + Math.random() * 50));
                    targetY = y + 150 + (Math.random() * 50);
                }
            }

            const vw = (targetX / window.innerWidth) * 100;
            const vh = (targetY / window.innerHeight) * 100;

            polaroid.style.setProperty('--left', `${vw}vw`);
            polaroid.style.setProperty('--top', `${vh}vh`);
            polaroid.style.setProperty('--angle', `${Math.random() * 30 - 15}deg`);

            polaroid.style.left = x + 'px';
            polaroid.style.top = y + 'px';

            polaroid.innerHTML = `
                <div class="polaroid-img" style="background-image: url('${imgSrc}')"></div>
                <div>Uspomena #${i + 1}</div>
            `;

            document.body.appendChild(polaroid);
        }, i * 200);
    });
}

function typeWriterEffect(element) {
    if (!element || element.dataset.typed === 'true') return;
    element.dataset.typed = 'true';

    const content = element.innerHTML;
    element.innerHTML = '';
    element.style.opacity = '1';

    const speed = 10;

    function type(target, htmlString, index) {
        if (!target.parentNode) return;

        if (index < htmlString.length) {
            let char = htmlString.charAt(index);

            if (char === '<') {
                let tag = '';
                while (htmlString.charAt(index) !== '>' && index < htmlString.length) {
                    tag += htmlString.charAt(index);
                    index++;
                }
                tag += '>';
                index++;
                target.innerHTML += tag;
                type(target, htmlString, index);
            } else {
                target.innerHTML += char;
                target.scrollTop = target.scrollHeight;
                setTimeout(() => type(target, htmlString, index + 1), speed);
            }
        }
    }

    type(element, content, 0);
}

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

document.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;

    const corners = document.querySelectorAll('.floral-corner');
    corners.forEach(corner => {
        corner.style.transform = `translateX(${x}px) translateY(${y}px) ${corner.classList.contains('bottom-right') ? 'rotate(180deg)' : ''}`;
    });

    const envelopes = document.querySelectorAll('.envelope-wrapper:not(.open)');
    envelopes.forEach(env => {
        const rect = env.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / 30;
        const deltaY = (e.clientY - centerY) / 30;

        env.style.setProperty('--rx', `${-deltaY}deg`);
        env.style.setProperty('--ry', `${deltaX}deg`);
    });
});