document.addEventListener("DOMContentLoaded", () => {
    const cursorContainer = document.getElementById("cursor-container");
    const cursor = document.getElementById("cursor");

    let mouseX = 0;
    let mouseY = 0;
    let isIdle = false;
    let lastMouseMoveTimestamp = Date.now();

    document.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        isIdle = false;
        lastMouseMoveTimestamp = Date.now();
    });

    document.addEventListener("mouseenter", () => {
        cursorContainer.classList.add("hovering");
    });

    document.addEventListener("mouseleave", () => {
        cursorContainer.classList.remove("hovering");
    });

    document.addEventListener("dragstart", () => {
        cursorContainer.classList.add("dragging");
    });

    document.addEventListener("dragend", () => {
        cursorContainer.classList.remove("dragging");
    });

    function createParticle(x, y) {
        const particle = document.createElement("div");
        particle.classList.add("particle");
        cursorContainer.appendChild(particle);

        const deltaX = x - window.innerWidth / 2;
        const deltaY = y - window.innerHeight / 2;

        Object.assign(particle.style, {
            left: `${x}px`,
            top: `${y}px`,
            transform: `translate(-50%, -50%) translate(${deltaX}px, ${deltaY}px)`,
            opacity: "0",
        });

        setTimeout(() => {
            Object.assign(particle.style, {
                transform: `translate(-50%, -50%) translate(${deltaX}px, ${deltaY}px) scale(2)`,
                opacity: "0.5",
            });
        }, 10);

        setTimeout(() => {
            cursorContainer.removeChild(particle);
        }, 500);
    }

    function revertToIdlePosition() {
        const scale = 0.5;

        Object.assign(cursor.style, {
            transform: `translate(-50%, -50%) translate(${mouseX}px, ${mouseY}px) scale(${scale})`,
        });
    }

    function updateCursor() {
        if (isIdle) {
            revertToIdlePosition();
        } else {
            const deltaX = mouseX - window.innerWidth / 2;
            const deltaY = mouseY - window.innerHeight / 2;

            const cursorSpeed =
                Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) /
                (Date.now() - lastMouseMoveTimestamp);
            const maxScale = 0.8;
            const scale = Math.min(1 + cursorSpeed * 0.02, maxScale);

            Object.assign(cursor.style, {
                transform: `translate(-50%, -50%) translate(${mouseX}px, ${mouseY}px) scale(${scale})`,
                boxShadow: "none",
            });
        }

        requestAnimationFrame(updateCursor);
    }

    updateCursor();

    const idleDuration = 30;
    setInterval(() => {
        isIdle = true;
    }, idleDuration);
});
