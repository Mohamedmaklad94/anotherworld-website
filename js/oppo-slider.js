const hero = document.querySelector('.oppo-hero');
const dotsContainer = document.querySelector('.oppo-dots');
const nextBtn = document.querySelector('.oppo-next');
const prevBtn = document.querySelector('.oppo-prev');

const images = [
    'img/gallery/oppo-1.jpg',
    'img/gallery/oppo-2.jpg',
    'img/gallery/oppo-3.jpg',
    'img/gallery/oppo-4.jpg',
    'img/gallery/oppo-5.jpg',
    'img/gallery/oppo-6.jpg',
    'img/gallery/oppo-7.jpg',
    'img/gallery/oppo-8.jpg'
];

let index = 0;

// Preload images
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
    }, 8000);
}

// Buttons
nextBtn.onclick = () => {
    index = (index - 1 + images.length) % images.length;
    updateBackground();
};

prevBtn.onclick = () => {
    index = (index + 1) % images.length;
    updateBackground();
};



// Dot click
dots.forEach(dot => {
    dot.addEventListener("click", () => {
        index = parseInt(dot.dataset.index);
        updateBackground();
    });
});
