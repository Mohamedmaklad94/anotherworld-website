document.addEventListener('DOMContentLoaded', function () {

  let allPhotos = [];
  let architecturePhotos  = [];
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

    architecturePhotos = allPhotos.filter(p => p.category.toLowerCase() === "architecture");
    architecturePhotos = shuffleArray([...architecturePhotos]);

    // تحميل أول دفعة فقط
    loadMorePhotos();
    lazyLoadImages();

    // إخفاء الزر لو مفيش صور كفاية
    if (architecturePhotos.length <= photosPerLoad) {
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
    const endIndex = Math.min(currentIndex + photosPerLoad, architecturePhotos.length);

    for (let i = currentIndex; i < endIndex; i++) {
      createPhotoCard(architecturePhotos[i], i);
    }

    currentIndex = endIndex;

    if (currentIndex >= architecturePhotos.length) {
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
    div.addEventListener('click', () => openarchitecture(photo, index));

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

  // ====== LIGHTBOX (architecture) ======

  const architectureLightbox = document.getElementById('architectureLightbox');
  const architectureImg = document.getElementById('architectureImg');
  const architectureAuthor = document.getElementById('architectureAuthor');
  const architectureClose = document.getElementById('architectureClose');
  const architecturePrev = document.getElementById('architecturePrev');
  const architectureNext = document.getElementById('architectureNext');

  // افتح اللايت بوكس
  window.openarchitecture = function(photo, index) {
    architectureImg.src = photo.image;
    architectureAuthor.textContent = photo.author;
    architectureLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    architectureLightbox.dataset.index = index;
  }

  // اقفل اللايت بوكس
  function closearchitecture() {
    architectureLightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // تنقّل
  function navarchitecture(dir) {
    let idx = parseInt(architectureLightbox.dataset.index);

    if (dir === 'next') idx = (idx + 1) % architecturePhotos.length;
    else idx = (idx - 1 + architecturePhotos.length) % architecturePhotos.length;

    const photo = architecturePhotos[idx];
    architectureImg.src = photo.image;
    architectureAuthor.textContent = photo.author;
    architectureLightbox.dataset.index = idx;
  }

  // Events
  loadMoreBtn.addEventListener('click', loadMorePhotos);
  architectureClose.addEventListener('click', closearchitecture);
  architecturePrev.addEventListener('click', () => navarchitecture('prev'));
  architectureNext.addEventListener('click', () => navarchitecture('next'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && architectureLightbox.classList.contains('active')) closearchitecture();
  });


  
  // Start
  loadPhotos();

  architectureLightbox.addEventListener('click', (e) => {
  if (e.target === architectureLightbox) {
    closearchitecture();
  }
});

});
