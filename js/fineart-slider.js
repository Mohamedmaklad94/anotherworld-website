const hero = document.querySelector('.fineart-hero');
const dotsContainer = document.querySelector('.fineart-dots');
const nextBtn = document.querySelector('.fineart-next');
const prevBtn = document.querySelector('.fineart-prev');

const images = [
    'img/gallery/fine-art-1.jpg',
    'img/gallery/fine-art-2.jpg',
    'img/gallery/fine-art-3.jpg',
    /*'img/gallery/fine-art-4.jpg',
    'img/gallery/fine-art-5.jpg',
    'img/gallery/fine-art-6.jpg'*/
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
    }, 5000);
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
