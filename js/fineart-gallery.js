document.addEventListener('DOMContentLoaded', function () {

  let allPhotos = [];
  let fineartPhotos  = [];
  let currentIndex = 0;
  const photosPerLoad = 12;

  const photoGrid = document.getElementById('photo-grid');
  const loadMoreBtn = document.getElementById('load-more-btn');

  // 1) Load all photos from JSON
  async function loadPhotos() {
  try {
    const response = await fetch('data/all-photos.json');
    const data = await response.json();
    allPhotos = data.photos || [];

    fineartPhotos = allPhotos.filter(p => p.category.toLowerCase() === "fine-art");
    fineartPhotos = shuffleArray([...fineartPhotos]);

    // تحميل أول دفعة فقط
    loadMorePhotos();
    lazyLoadImages();

    // إخفاء الزر لو مفيش صور كفاية
    if (fineartPhotos.length <= photosPerLoad) {
      loadMoreBtn.classList.add('hidden');
    }

  } catch (error) {
    console.error("Error loading photos:", error);
    photoGrid.innerHTML = "<p style='text-align:center;color:#666;'>حدث خطأ في تحميل الصور</p>";
  }
}


  // Shuffle
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Load More
  function loadMorePhotos() {
    const endIndex = Math.min(currentIndex + photosPerLoad, fineartPhotos.length);

    for (let i = currentIndex; i < endIndex; i++) {
      createPhotoCard(fineartPhotos[i], i);
    }

    currentIndex = endIndex;

    if (currentIndex >= fineartPhotos.length) {
      loadMoreBtn.classList.add('hidden');
    } else {
      loadMoreBtn.classList.remove('hidden');
    }

    lazyLoadImages();
  }

  // Create photo card
  function createPhotoCard(photo, index) {
    const div = document.createElement('div');
    div.className = 'photo-item';
    div.style.cursor = 'pointer';
    div.dataset.index = index;

    div.innerHTML = `
      <img src="img/placeholder.jpg"
           data-src="${photo.image}"
           alt="${photo.author}"
           class="lazy-image"
           style="width:100%; height:100%; object-fit:cover;">
      <div class="photo-info">
        <h4>${photo.author}</h4>
      </div>
    `;

    // افتح اللايت بوكس الجديد
    div.addEventListener('click', () => openfineart(photo, index));

    photoGrid.appendChild(div);
  }

  // Lazy Loading
  function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('.lazy-image');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          setTimeout(() => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }, 100);
        }
      });
    }, { rootMargin: '100px' });

    lazyImages.forEach(img => {
      if (!img.classList.contains('loaded')) {
        observer.observe(img);
      }
    });
  }

  // ====== LIGHTBOX (fineart) ======

  const fineartLightbox = document.getElementById('fineartLightbox');
  const fineartImg = document.getElementById('fineartImg');
  const fineartAuthor = document.getElementById('fineartAuthor');
  const fineartClose = document.getElementById('fineartClose');
  const fineartPrev = document.getElementById('fineartPrev');
  const fineartNext = document.getElementById('fineartNext');

  // افتح اللايت بوكس
  window.openfineart = function(photo, index) {
    fineartImg.src = photo.image;
    fineartAuthor.textContent = photo.author;
    fineartLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    fineartLightbox.dataset.index = index;
  }

  // اقفل اللايت بوكس
  function closefineart() {
    fineartLightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // تنقّل
  function navfineart(dir) {
    let idx = parseInt(fineartLightbox.dataset.index);

    if (dir === 'next') idx = (idx + 1) % fineartPhotos.length;
    else idx = (idx - 1 + fineartPhotos.length) % fineartPhotos.length;

    const photo = fineartPhotos[idx];
    fineartImg.src = photo.image;
    fineartAuthor.textContent = photo.author;
    fineartLightbox.dataset.index = idx;
  }

  // Events
  loadMoreBtn.addEventListener('click', loadMorePhotos);
  fineartClose.addEventListener('click', closefineart);
  fineartPrev.addEventListener('click', () => navfineart('prev'));
  fineartNext.addEventListener('click', () => navfineart('next'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fineartLightbox.classList.contains('active')) closefineart();
  });


  
  // Start
  loadPhotos();


fineartLightbox.addEventListener('click', (e) => {
  if (e.target === fineartLightbox) {
    closefineart();
  }
});

});
