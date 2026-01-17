document.addEventListener("DOMContentLoaded", () => {
    const hero = document.querySelector('.weekly-slider-hero');
    const dotsContainer = document.querySelector('.weekly-slider-dots');
    const nextBtn = document.querySelector('.weekly-slider-next');
    const prevBtn = document.querySelector('.weekly-slider-prev');

    const images = [
        'img/weekphotos/01-02-2026-alaa-el-din.jpg',
        'img/weekphotos/01-03-2026-ahmed-rezk.jpg',
        'img/weekphotos/01-06-2026-mohammed-abuelgasim.jpg',
    ];

    let index = 0;

    // Preload
    let loaded = 0;
    const preloaded = [];
    images.forEach(src => {
        const img = new Image();
        img.onload = () => {
            loaded++;
            if (loaded === images.length) startSlider();
        };
        img.src = src;
        preloaded.push(img);
    });

    // Create dots
    images.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dot.dataset.index = i;
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".dot");

    function updateBackground() {
        hero.style.backgroundImage = `url('${images[index]}')`;
        dots.forEach(dot => dot.classList.remove("active"));
        dots[index].classList.add("active");
    }

    function startSlider() {
        updateBackground();
        setInterval(() => {
            index = (index + 1) % images.length;
            updateBackground();
        }, 5000);
    }

    // Buttons
    nextBtn.onclick = () => { index = (index - 1 + images.length) % images.length; updateBackground(); };
    prevBtn.onclick = () => { index = (index + 1) % images.length; updateBackground(); };


    // Dot click
    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            index = parseInt(dot.dataset.index);
            updateBackground();
        });
    });
});
