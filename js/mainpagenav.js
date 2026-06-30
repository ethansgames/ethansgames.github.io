let deferredPrompt;

const installBtn = document.getElementById("pwainstall");
installBtn.disabled = true;
installBtn.hidden = true;

window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.disabled = false;
    installBtn.hidden = false;
});

installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
        location.href = "/sites/pwaHub/pwahub.html";
    }

    deferredPrompt = null;
    installBtn.disabled = true;
    installBtn.hidden = true;
});

const cubeButton = document.getElementById("robbieIcon");
const sideMenu = document.getElementById("sideMenu");
const titleGameSpan = document.getElementById("titleGameSpan");
function toggleMenu() {
    cubeButton.classList.toggle("open");
    sideMenu.classList.toggle("show");
}

cubeButton.addEventListener("click", toggleMenu);
titleGameSpan.addEventListener("click", toggleMenu);

document.querySelectorAll(".menu a").forEach(link => {
    link.addEventListener("click", () => {
    cubeButton.classList.remove("open");
    sideMenu.classList.remove("show");
    });
});
let currentRotation = 0;
function lerp(start, end, amt) {
return (1 - amt) * start + amt * end;
}
function triggerLerp() {
    const el = document.getElementById('robbieIcon');
        
    currentRotation += 90;
    
    // Configuration
    const startY = 0;
    const peakY = -150; // Pixels to move up
    const duration = 350; // Total time in ms
    
    const startTime = performance.now();

        function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    let currentY;
    if (progress <= 0.5) {
        // Going up: Map 0.0-0.5 to a 0.0-1.0 range
        const upProgress = progress * 2;
        
        // "Ease-Out" curve: fast start, slow at the top
        const easeUp = 1 - Math.pow(1 - upProgress, 2); 
        
        currentY = lerp(startY, peakY, easeUp);
    } else {
        // Coming down: Map 0.5-1.0 to a 0.0-1.0 range
        const downProgress = (progress - 0.5) * 2;
        
        // "Ease-In" curve: slow start at top, fast crash down
        const easeDown = Math.pow(downProgress, 2); 
        
        currentY = lerp(peakY, startY, easeDown);
    }

    el.style.transform = `translateY(${currentY}px) rotate(${currentRotation}deg)`;

    if (progress < 1) {
        requestAnimationFrame(animate);
    }
}


requestAnimationFrame(animate);
}