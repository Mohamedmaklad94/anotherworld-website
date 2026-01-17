document.addEventListener('DOMContentLoaded', function () {

  let allPhotos = [];
  let wildlifePhotos = [];
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

    wildlifePhotos = allPhotos.filter(p => p.category.toLowerCase() === "wildlife");
    wildlifePhotos = shuffleArray([...wildlifePhotos]);

    // تحميل أول دفعة فقط
    loadMorePhotos();
    lazyLoadImages();

    // إخفاء الزر لو مفيش صور كفاية
    if (wildlifePhotos.length <= photosPerLoad) {
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
    const endIndex = Math.min(currentIndex + photosPerLoad, wildlifePhotos.length);

    for (let i = currentIndex; i < endIndex; i++) {
      createPhotoCard(wildlifePhotos[i], i);
    }

    currentIndex = endIndex;

    if (currentIndex >= wildlifePhotos.length) {
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
    div.addEventListener('click', () => openWLB(photo, index));

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

  // ====== LIGHTBOX (WLB) ======

  const wlb = document.getElementById('wildlifeLightbox');
  const wlbImg = document.getElementById('wlbImg');
  const wlbAuthor = document.getElementById('wlbAuthor');
  const wlbClose = document.getElementById('wlbClose');
  const wlbPrev = document.getElementById('wlbPrev');
  const wlbNext = document.getElementById('wlbNext');

  // افتح اللايت بوكس
  window.openWLB = function(photo, index) {
    wlbImg.src = photo.image;
    wlbAuthor.textContent = photo.author;
    wlb.classList.add('active');
    document.body.style.overflow = 'hidden';
    wlb.dataset.index = index;
  }

  // اقفل اللايت بوكس
  function closeWLB() {
    wlb.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // تنقّل
  function navWLB(dir) {
    let idx = parseInt(wlb.dataset.index);

    if (dir === 'next') idx = (idx + 1) % wildlifePhotos.length;
    else idx = (idx - 1 + wildlifePhotos.length) % wildlifePhotos.length;

    const photo = wildlifePhotos[idx];
    wlbImg.src = photo.image;
    wlbAuthor.textContent = photo.author;
    wlb.dataset.index = idx;
  }

  // Events
  loadMoreBtn.addEventListener('click', loadMorePhotos);
  wlbClose.addEventListener('click', closeWLB);
  wlbPrev.addEventListener('click', () => navWLB('prev'));
  wlbNext.addEventListener('click', () => navWLB('next'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && wlb.classList.contains('active')) closeWLB();
  });


  
  // Start
  loadPhotos();
});
