document.addEventListener("scroll", () => {
    const scrolled = window.scrollY;

    document.querySelectorAll('.parallax-layer').forEach((layer, index) => {
        const baseDepth = (index + 1) * 0.2;
        const chaosFactor = Math.sin(scrolled * 0.001 * (index + 1)) * 30;
        const offset = scrolled * baseDepth + chaosFactor;

        layer.style.transform = `translateY(${offset}px)`;
    });
});

