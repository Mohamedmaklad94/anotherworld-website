document.addEventListener('DOMContentLoaded', function () {

  let allPhotos = [];
  let portraitPhotos  = [];
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

    portraitPhotos = allPhotos.filter(p => p.category.toLowerCase() === "portrait");
    portraitPhotos = shuffleArray([...portraitPhotos]);

    // تحميل أول دفعة فقط
    loadMorePhotos();
    lazyLoadImages();

    // إخفاء الزر لو مفيش صور كفاية
    if (portraitPhotos.length <= photosPerLoad) {
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
    const endIndex = Math.min(currentIndex + photosPerLoad, portraitPhotos.length);

    for (let i = currentIndex; i < endIndex; i++) {
      createPhotoCard(portraitPhotos[i], i);
    }

    currentIndex = endIndex;

    if (currentIndex >= portraitPhotos.length) {
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
    div.addEventListener('click', () => openportrait(photo, index));

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

  // ====== LIGHTBOX (portrait) ======

  const portraitLightbox = document.getElementById('portraitLightbox');
  const portraitImg = document.getElementById('portraitImg');
  const portraitAuthor = document.getElementById('portraitAuthor');
  const portraitClose = document.getElementById('portraitClose');
  const portraitPrev = document.getElementById('portraitPrev');
  const portraitNext = document.getElementById('portraitNext');

  // افتح اللايت بوكس
  window.openportrait = function(photo, index) {
    portraitImg.src = photo.image;
    portraitAuthor.textContent = photo.author;
    portraitLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    portraitLightbox.dataset.index = index;
  }

  // اقفل اللايت بوكس
  function closeportrait() {
    portraitLightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // تنقّل
  function navportrait(dir) {
    let idx = parseInt(portraitLightbox.dataset.index);

    if (dir === 'next') idx = (idx + 1) % portraitPhotos.length;
    else idx = (idx - 1 + portraitPhotos.length) % portraitPhotos.length;

    const photo = portraitPhotos[idx];
    portraitImg.src = photo.image;
    portraitAuthor.textContent = photo.author;
    portraitLightbox.dataset.index = idx;
  }

  // Events
  loadMoreBtn.addEventListener('click', loadMorePhotos);
  portraitClose.addEventListener('click', closeportrait);
  portraitPrev.addEventListener('click', () => navportrait('prev'));
  portraitNext.addEventListener('click', () => navportrait('next'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && portraitLightbox.classList.contains('active')) closeportrait();
  });


  
  // Start
  loadPhotos();


portraitLightbox.addEventListener('click', (e) => {
  if (e.target === portraitLightbox) {
    closeportrait();
  }
});

});
