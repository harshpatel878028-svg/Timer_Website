
let targetDate = new Date(2026, 2, 9, 0, 0, 0).getTime(); 

// --- ELEMENTS ---
const gateScreen = document.getElementById('gate-screen');
const startBtn = document.getElementById('start-btn');
const timerScreen = document.getElementById('timer-screen');
const tickAudio = document.getElementById('sfx-tick');

if(tickAudio) tickAudio.volume = 0.5; 

// --- LOGIC ---

// 1. User Clicks Start
startBtn.addEventListener('click', () => {
    // Animate Gate Away
    gsap.to(gateScreen, {
        opacity: 0,
        scale: 1.1, 
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
            gateScreen.classList.add('hidden'); 
            gateScreen.style.display = 'none'; 
            
            // Start the Timer Logic
            initTimer();
        }
    });
});

// 2. Initialize Timer Stage
function initTimer() {
    timerScreen.classList.remove('hidden'); 
    timerScreen.style.display = 'flex'; 
    gsap.set(timerScreen, {opacity: 1});

    // Animate Timer Elements In
    gsap.from(".timer-label", { y: -30, opacity: 0, duration: 1, delay: 0.2 });
    gsap.from(".time-box", { 
        y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)"
    });
    
    startCountdownLoop();
}

// 3. Countdown Logic
function startCountdownLoop() {
    const timerInterval = setInterval(() => {
        const currentTime = new Date().getTime();
        const distance = targetDate - currentTime;

        // CHECK: Is the date reached?
        if (distance <= 0) {
            // STOP THE TIMER
            clearInterval(timerInterval);
            
            // Force display to 00
            document.getElementById("days").innerText = "00";
            document.getElementById("hours").innerText = "00";
            document.getElementById("minutes").innerText = "00";
            document.getElementById("seconds").innerText = "00";
            
            // 🔥 THE TEASER MESSAGE 🔥
            const msg = document.getElementById("wait-msg");
            msg.style.color = "#4facfe";
            msg.style.fontSize = "1.5rem";
            msg.innerHTML = `
                ✨ The wait is over! ✨<br><br>
                Please open the <b>Offline Gift Folder</b> I sent you<br>
                and run the program on your laptop now! 🎁
            `;
            
            return; 
        }

        // Standard Math
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = formatTime(days);
        document.getElementById("hours").innerText = formatTime(hours);
        document.getElementById("minutes").innerText = formatTime(minutes);
        
        // Handle Seconds & Tick Sound
        const secElement = document.getElementById("seconds");
        const currentSec = secElement.innerText;
        const newSec = formatTime(seconds);

        if (currentSec !== newSec) {
            secElement.innerText = newSec;
            
            if(tickAudio) {
                tickAudio.currentTime = 0; 
                tickAudio.play().catch(e => {}); // Silent catch for autoplay blocks
            }
            
            gsap.fromTo(secElement, {scale: 1.3}, {scale: 1, duration: 0.2});
        }

    }, 1000);
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}