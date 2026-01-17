document.addEventListener('DOMContentLoaded', function () {

  let allPhotos = [];
  let streetPhotos  = [];
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

    streetPhotos = allPhotos.filter(p => p.category.toLowerCase() === "street");
    streetPhotos = shuffleArray([...streetPhotos]);

    // تحميل أول دفعة فقط
    loadMorePhotos();
    lazyLoadImages();

    // إخفاء الزر لو مفيش صور كفاية
    if (streetPhotos.length <= photosPerLoad) {
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
    const endIndex = Math.min(currentIndex + photosPerLoad, streetPhotos.length);

    for (let i = currentIndex; i < endIndex; i++) {
      createPhotoCard(streetPhotos[i], i);
    }

    currentIndex = endIndex;

    if (currentIndex >= streetPhotos.length) {
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
    div.addEventListener('click', () => openstreet(photo, index));

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

  // ====== LIGHTBOX (street) ======

  const streetLightbox = document.getElementById('streetLightbox');
  const streetImg = document.getElementById('streetImg');
  const streetAuthor = document.getElementById('streetAuthor');
  const streetClose = document.getElementById('streetClose');
  const streetPrev = document.getElementById('streetPrev');
  const streetNext = document.getElementById('streetNext');

  // افتح اللايت بوكس
  window.openstreet = function(photo, index) {
    streetImg.src = photo.image;
    streetAuthor.textContent = photo.author;
    streetLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    streetLightbox.dataset.index = index;
  }

  // اقفل اللايت بوكس
  function closestreet() {
    streetLightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // تنقّل
  function navstreet(dir) {
    let idx = parseInt(streetLightbox.dataset.index);

    if (dir === 'next') idx = (idx + 1) % streetPhotos.length;
    else idx = (idx - 1 + streetPhotos.length) % streetPhotos.length;

    const photo = streetPhotos[idx];
    streetImg.src = photo.image;
    streetAuthor.textContent = photo.author;
    streetLightbox.dataset.index = idx;
  }

  // Events
  loadMoreBtn.addEventListener('click', loadMorePhotos);
  streetClose.addEventListener('click', closestreet);
  streetPrev.addEventListener('click', () => navstreet('prev'));
  streetNext.addEventListener('click', () => navstreet('next'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && streetLightbox.classList.contains('active')) closestreet();
  });


  
  // Start
  loadPhotos();

streetLightbox.addEventListener('click', (e) => {
  if (e.target === streetLightbox) {
    closestreet();
  }
});
});