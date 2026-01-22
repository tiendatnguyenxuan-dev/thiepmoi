// Get elements
const acceptBtn = document.getElementById('acceptBtn');
const declineBtn = document.getElementById('declineBtn');
const successModal = document.getElementById('successModal');
const buttonsContainer = document.querySelector('.buttons-container');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

// Music state
let isMusicPlaying = false;

// Autoplay workaround: Start muted, then unmute
window.addEventListener('load', () => {
    console.log('🎵 Initializing autoplay music...');

    // Music is already playing muted due to autoplay attribute
    // Now we'll unmute it after a short delay
    setTimeout(() => {
        bgMusic.muted = false;
        bgMusic.volume = 0.3; // 30% volume for gentle background music
        isMusicPlaying = true;
        musicToggle.textContent = '🔊';
        musicToggle.classList.remove('muted');
        console.log('✅ Music playing automatically! 🎵');
    }, 500); // Short delay to ensure browser has started playback

    // Fallback: If autoplay failed, try playing manually
    bgMusic.play().catch(err => {
        console.log('⚠️ Autoplay prevented, waiting for user interaction...');
        // Fallback to click event
        document.addEventListener('click', () => {
            if (!isMusicPlaying) {
                bgMusic.muted = false;
                bgMusic.volume = 0.3;
                bgMusic.play().then(() => {
                    isMusicPlaying = true;
                    musicToggle.textContent = '🔊';
                    musicToggle.classList.remove('muted');
                    console.log('✅ Music started after user click! 🎵');
                }).catch(e => console.error('Failed to play:', e));
            }
        }, { once: true });
    });
});

// Music toggle functionality
musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.textContent = '🔇';
        musicToggle.classList.add('muted');
        isMusicPlaying = false;
        console.log('Music paused ⏸️');
    } else {
        bgMusic.play().then(() => {
            musicToggle.textContent = '🔊';
            musicToggle.classList.remove('muted');
            isMusicPlaying = true;
            console.log('Music playing 🎵');
        }).catch(err => {
            console.error('Failed to play music:', err);
            alert('Không thể phát nhạc. Vui lòng kiểm tra kết nối internet!');
        });
    }
});

// Simple sound effects using Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, type = 'sine') {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function playSuccessSound() {
    // Happy ascending notes
    playSound(523.25, 0.15); // C5
    setTimeout(() => playSound(659.25, 0.15), 100); // E5
    setTimeout(() => playSound(783.99, 0.3), 200); // G5
}

function playDeclineSound() {
    // Quick boop sound
    playSound(200, 0.1, 'square');
}

// Track decline button click attempts
let declineAttempts = 0;

// Handle accept button click
acceptBtn.addEventListener('click', () => {
    playSuccessSound();
    successModal.classList.add('active');

    // Create confetti effect
    createConfetti();
});

// Handle decline button - make it run away!
declineBtn.addEventListener('mouseenter', () => {
    playDeclineSound();
    moveDeclineButton();
});

declineBtn.addEventListener('click', (e) => {
    e.preventDefault();
    playDeclineSound();
    moveDeclineButton();
});

// Function to move decline button to random position
function moveDeclineButton() {
    declineAttempts++;

    const card = document.querySelector('.invitation-card');
    const cardRect = card.getBoundingClientRect();
    const btnRect = declineBtn.getBoundingClientRect();

    // Calculate maximum movement area within the card
    const maxX = cardRect.width - btnRect.width - 100; // 100px padding
    const maxY = 150; // Vertical movement range

    // Generate random position
    let randomX = Math.random() * maxX - (maxX / 2);
    let randomY = Math.random() * maxY - (maxY / 2);

    // Make it move faster and more erratically with each attempt
    const speedMultiplier = 1 + (declineAttempts * 0.2);
    randomX *= speedMultiplier;
    randomY *= speedMultiplier;

    // Apply the movement with requestAnimationFrame for smooth 60fps
    requestAnimationFrame(() => {
        declineBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
    });

    // Change button text after a few attempts
    if (declineAttempts === 3) {
        declineBtn.textContent = 'Đừng mà 🙈';
    } else if (declineAttempts === 5) {
        declineBtn.textContent = 'Thôi đi 😢';
    } else if (declineAttempts === 7) {
        declineBtn.textContent = 'Huhu 😭';
    } else if (declineAttempts >= 10) {
        declineBtn.textContent = 'Okela 😢';
        requestAnimationFrame(() => {
            declineBtn.style.opacity = '0.5';
            // Keep existing transform
            const currentTransform = declineBtn.style.transform;
            declineBtn.style.transform = `${currentTransform} scale(0.8)`;
        });
        declineBtn.style.cursor = 'not-allowed';
    }

    // Add shake effect to the button
    declineBtn.style.animation = 'shake 0.3s ease-in-out';
    setTimeout(() => {
        declineBtn.style.animation = '';
    }, 300);
}

// Create confetti effect
function createConfetti() {
    const colors = ['#f093fb', '#f5576c', '#ffd3a5', '#667eea', '#764ba2'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -20px;
                opacity: 1;
                border-radius: 50%;
                z-index: 9999;
                animation: fallConfetti ${2 + Math.random() * 2}s linear forwards;
            `;
            document.body.appendChild(confetti);

            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }, i * 30);
    }
}

// Add confetti animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fallConfetti {
        to {
            top: 100vh;
            transform: translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 360}deg);
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px) rotate(-5deg); }
        75% { transform: translateX(10px) rotate(5deg); }
    }
`;
document.head.appendChild(style);

// Click outside modal to close
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('active');
    }
});

// Add heart particles on mouse move (throttled for performance)
let lastHeartTime = 0;
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastHeartTime > 800) { // Increased throttle for better performance
        lastHeartTime = now;
        requestAnimationFrame(() => {
            createHeartParticle(e.clientX, e.clientY);
        });
    }
});

function createHeartParticle(x, y) {
    const heart = document.createElement('div');
    heart.textContent = '💕';
    heart.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: 20px;
        pointer-events: none;
        z-index: 9999;
        animation: floatUp 2s ease-out forwards;
    `;
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 2000);
}

// Add float up animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes floatUp {
        to {
            transform: translateY(-100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);
