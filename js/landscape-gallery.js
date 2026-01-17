document.addEventListener('DOMContentLoaded', function () {

  let allPhotos = [];
  let landscapePhotos  = [];
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

    landscapePhotos = allPhotos.filter(p => p.category.toLowerCase() === "landscape");
    landscapePhotos = shuffleArray([...landscapePhotos]);

    // تحميل أول دفعة فقط
    loadMorePhotos();
    lazyLoadImages();

    // إخفاء الزر لو مفيش صور كفاية
    if (landscapePhotos.length <= photosPerLoad) {
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
    const endIndex = Math.min(currentIndex + photosPerLoad, landscapePhotos.length);

    for (let i = currentIndex; i < endIndex; i++) {
      createPhotoCard(landscapePhotos[i], i);
    }

    currentIndex = endIndex;

    if (currentIndex >= landscapePhotos.length) {
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
    div.addEventListener('click', () => openlandscape(photo, index));

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

  // ====== LIGHTBOX (landscape) ======

  const landscapeLightbox = document.getElementById('landscapeLightbox');
  const landscapeImg = document.getElementById('landscapeImg');
  const landscapeAuthor = document.getElementById('landscapeAuthor');
  const landscapeClose = document.getElementById('landscapeClose');
  const landscapePrev = document.getElementById('landscapePrev');
  const landscapeNext = document.getElementById('landscapeNext');

  // افتح اللايت بوكس
  window.openlandscape = function(photo, index) {
    landscapeImg.src = photo.image;
    landscapeAuthor.textContent = photo.author;
    landscapeLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    landscapeLightbox.dataset.index = index;
  }

  // اقفل اللايت بوكس
  function closelandscape() {
    landscapeLightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // تنقّل
  function navlandscape(dir) {
    let idx = parseInt(landscapeLightbox.dataset.index);

    if (dir === 'next') idx = (idx + 1) % landscapePhotos.length;
    else idx = (idx - 1 + landscapePhotos.length) % landscapePhotos.length;

    const photo = landscapePhotos[idx];
    landscapeImg.src = photo.image;
    landscapeAuthor.textContent = photo.author;
    landscapeLightbox.dataset.index = idx;
  }

  // Events
  loadMoreBtn.addEventListener('click', loadMorePhotos);
  landscapeClose.addEventListener('click', closelandscape);
  landscapePrev.addEventListener('click', () => navlandscape('prev'));
  landscapeNext.addEventListener('click', () => navlandscape('next'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && landscapeLightbox.classList.contains('active')) closelandscape();
  });


  
  // Start
  loadPhotos();

landscapeLightbox.addEventListener('click', (e) => {
  if (e.target === landscapeLightbox) {
    closelandscape();
  }
});

});
