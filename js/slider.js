// ===============================
// Slider with Arrows + Dots + Auto Play
// ===============================

let slides = document.querySelectorAll(".slide-wrapper");
let dotsContainer = document.querySelector(".slider-dots");
let prevBtn = document.querySelector(".prev");
let nextBtn = document.querySelector(".next");
const slider = document.querySelector('.slider');

let current = 0;

// Auto play (ONE interval only)
let sliderInterval = setInterval(nextSlide, 5000);

// Hover stop
slider.addEventListener('mouseenter', () => {
  clearInterval(sliderInterval);
});

slider.addEventListener('mouseleave', () => {
  sliderInterval = setInterval(nextSlide, 5000);
});

// Create dots dynamically
slides.forEach((_, i) => {
  let dot = document.createElement("span");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active-dot");
  dot.dataset.index = i;
  dotsContainer.appendChild(dot);
});

let dots = document.querySelectorAll(".dot");

// Show slide function
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle("active-dot", i === index);
  });
}

// Next slide
function nextSlide() {
  current = (current + 1) % slides.length;
  showSlide(current);
}

// Previous slide
function prevSlide() {
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
}

// Dot click
dots.forEach(dot => {
  dot.addEventListener("click", () => {
    current = parseInt(dot.dataset.index);
    showSlide(current);
  });
});

// Buttons
nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

// First slide
showSlide(current);
