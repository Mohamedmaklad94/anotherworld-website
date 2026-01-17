document.addEventListener('DOMContentLoaded', function () {

  let allPhotos = [];
  let productPhotos  = [];
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

    productPhotos = allPhotos.filter(p => p.category.toLowerCase() === "product");
    productPhotos = shuffleArray([...productPhotos]);

    // تحميل أول دفعة فقط
    loadMorePhotos();
    lazyLoadImages();

    // إخفاء الزر لو مفيش صور كفاية
    if (productPhotos.length <= photosPerLoad) {
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
    const endIndex = Math.min(currentIndex + photosPerLoad, productPhotos.length);

    for (let i = currentIndex; i < endIndex; i++) {
      createPhotoCard(productPhotos[i], i);
    }

    currentIndex = endIndex;

    if (currentIndex >= productPhotos.length) {
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
    div.addEventListener('click', () => openproduct(photo, index));

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

  // ====== LIGHTBOX (product) ======

  const productLightbox = document.getElementById('productLightbox');
  const productImg = document.getElementById('productImg');
  const productAuthor = document.getElementById('productAuthor');
  const productClose = document.getElementById('productClose');
  const productPrev = document.getElementById('productPrev');
  const productNext = document.getElementById('productNext');

  // افتح اللايت بوكس
  window.openproduct = function(photo, index) {
    productImg.src = photo.image;
    productAuthor.textContent = photo.author;
    productLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    productLightbox.dataset.index = index;
  }

  // اقفل اللايت بوكس
  function closeproduct() {
    productLightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // تنقّل
  function navproduct(dir) {
    let idx = parseInt(productLightbox.dataset.index);

    if (dir === 'next') idx = (idx + 1) % productPhotos.length;
    else idx = (idx - 1 + productPhotos.length) % productPhotos.length;

    const photo = productPhotos[idx];
    productImg.src = photo.image;
    productAuthor.textContent = photo.author;
    productLightbox.dataset.index = idx;
  }

  // Events
  loadMoreBtn.addEventListener('click', loadMorePhotos);
  productClose.addEventListener('click', closeproduct);
  productPrev.addEventListener('click', () => navproduct('prev'));
  productNext.addEventListener('click', () => navproduct('next'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && productLightbox.classList.contains('active')) closeproduct();
  });



  // Start
  loadPhotos();

productLightbox.addEventListener('click', (e) => {
  if (e.target === productLightbox) {
    closeproduct();
  }
});


});
