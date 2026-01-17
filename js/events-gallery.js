document.addEventListener('DOMContentLoaded', function () {

  let allPhotos = [];
  let eventsPhotos  = [];
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

    eventsPhotos = allPhotos.filter(p => p.category.toLowerCase() === "events");
    eventsPhotos = shuffleArray([...eventsPhotos]);

    // تحميل أول دفعة فقط
    loadMorePhotos();
    lazyLoadImages();

    // إخفاء الزر لو مفيش صور كفاية
    if (eventsPhotos.length <= photosPerLoad) {
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
    const endIndex = Math.min(currentIndex + photosPerLoad, eventsPhotos.length);

    for (let i = currentIndex; i < endIndex; i++) {
      createPhotoCard(eventsPhotos[i], i);
    }

    currentIndex = endIndex;

    if (currentIndex >= eventsPhotos.length) {
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
    div.addEventListener('click', () => openevents(photo, index));

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

  // ====== LIGHTBOX (events) ======

  const eventsLightbox = document.getElementById('eventsLightbox');
  const eventsImg = document.getElementById('eventsImg');
  const eventsAuthor = document.getElementById('eventsAuthor');
  const eventsClose = document.getElementById('eventsClose');
  const eventsPrev = document.getElementById('eventsPrev');
  const eventsNext = document.getElementById('eventsNext');

  // افتح اللايت بوكس
  window.openevents = function(photo, index) {
    eventsImg.src = photo.image;
    eventsAuthor.textContent = photo.author;
    eventsLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    eventsLightbox.dataset.index = index;
  }

  // اقفل اللايت بوكس
  function closeevents() {
    eventsLightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // تنقّل
  function navevents(dir) {
    let idx = parseInt(eventsLightbox.dataset.index);

    if (dir === 'next') idx = (idx + 1) % eventsPhotos.length;
    else idx = (idx - 1 + eventsPhotos.length) % eventsPhotos.length;

    const photo = eventsPhotos[idx];
    eventsImg.src = photo.image;
    eventsAuthor.textContent = photo.author;
    eventsLightbox.dataset.index = idx;
  }

  // Events
  loadMoreBtn.addEventListener('click', loadMorePhotos);
  eventsClose.addEventListener('click', closeevents);
  eventsPrev.addEventListener('click', () => navevents('prev'));
  eventsNext.addEventListener('click', () => navevents('next'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && eventsLightbox.classList.contains('active')) closeevents();
  });


  
  // Start
  loadPhotos();


eventsLightbox.addEventListener('click', (e) => {
  if (e.target === eventsLightbox) {
    closeevents();
  }
});

});
