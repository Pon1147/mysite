// ==================== CONFETTI.JS ====================

function triggerConfetti(particleCount = 120) {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const colors = ["#ff4d94", "#c026d3", "#ffd166", "#4cc9f0", "#ffffff"];

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resize();

    const pieces = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.4,
        r: 4 + Math.random() * 6,
        d: 1 + Math.random() * 2,
        tilt: Math.random() * 10 - 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: -1 + Math.random() * 2,
        vy: 2 + Math.random() * 3
    }));

    let frame = 0;
    const maxFrames = 180;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach((p) => {
            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.r, p.r * 0.6 + Math.abs(p.tilt * 0.1));
        });
    }

    function update() {
        pieces.forEach((p) => {
            p.x += p.vx + Math.sin((frame + p.d) * 0.04);
            p.y += p.vy;
            p.tilt += 0.2;
        });
    }

    function animate() {
        frame += 1;
        update();
        draw();
        if (frame < maxFrames) {
            requestAnimationFrame(animate);
        } else {
            canvas.remove();
        }
    }

    requestAnimationFrame(animate);
}

window.triggerConfetti = triggerConfetti;
