const container = document.getElementById("weeklyGallery");

// هنستخدمهم للـ lightbox
let currentWeekPhotos = [];
let currentWeekIndex = 0;

// 1) نجمع الصور حسب الشهر والأسبوع
const grouped = {};
weeklyPhotos.forEach(photo => {
  if (!grouped[photo.month]) grouped[photo.month] = {};
  if (!grouped[photo.month][photo.week]) grouped[photo.month][photo.week] = [];
  grouped[photo.month][photo.week].push(photo);
});

// 2) (اختياري) لو حابب تضمن ترتيب حسب ترتيب الـ weeklyPhotos نفسه
// احنا أصلاً بندخلهم بالترتيب، فمش هنلعب فيهم بأي sort هنا.
// لو حبيت ترتب حسب التاريخ في الاسم، نقدر نرجع نضيفه بعدين، بس دلوقتي نخليه خام.

// 3) نبني الـ HTML
Object.keys(grouped).forEach(month => {
  const monthDiv = document.createElement("div");
  monthDiv.className = "month-section";

  const monthTitle = document.createElement("h2");
  monthTitle.className = "month-title";
monthTitle.innerHTML = `
  <span class="month-text">${month}</span>
  <i class="month-arrow fas fa-chevron-down"></i>
`;
  monthDiv.appendChild(monthTitle);

  const weeksWrapper = document.createElement("div");
  weeksWrapper.className = "weeks-wrapper";
  weeksWrapper.style.display = "none";
  monthDiv.appendChild(weeksWrapper);

 monthTitle.addEventListener("click", () => {
  const isOpen = weeksWrapper.style.display === "block";
  weeksWrapper.style.display = isOpen ? "none" : "block";

  const arrow = monthTitle.querySelector(".month-arrow");

  if (isOpen) {
    // لو مقفول → خلي السهم يمين
    arrow.classList.remove("fa-chevron-down");
    arrow.classList.add("fa-chevron-right");
  } else {
    // لو مفتوح → خلي السهم لتحت
    arrow.classList.remove("fa-chevron-right");
    arrow.classList.add("fa-chevron-down");
  }
});


  // نخلي ترتيب الأسابيع يمشي حسب ظهورها في Object.keys
  Object.keys(grouped[month]).forEach(week => {
    const weekTitle = document.createElement("h3");
    weekTitle.className = "week-title";
    weekTitle.innerHTML = `
  <span class="week-text">${week}</span>
  <i class="week-arrow fas fa-chevron-down"></i>
`;

    weeksWrapper.appendChild(weekTitle);

    const grid = document.createElement("div");
    grid.className = "week-grid";
    grid.style.display = "none";
    weeksWrapper.appendChild(grid);

    weekTitle.addEventListener("click", () => {
  const isOpen = grid.style.display === "grid";
  grid.style.display = isOpen ? "none" : "grid";

  const arrow = weekTitle.querySelector(".week-arrow");

  if (isOpen) {
    // لو مقفول → خلي السهم يمين
    arrow.classList.remove("fa-chevron-down");
    arrow.classList.add("fa-chevron-right");
  } else {
    // لو مفتوح → خلي السهم لتحت
    arrow.classList.remove("fa-chevron-right");
    arrow.classList.add("fa-chevron-down");
  }
});


    // هنا النقطة الذهبية:
    // بنمشي على grouped[month][week] بنفس ترتيب weeklyPhotos
    grouped[month][week].forEach((photo, i) => {
      const item = document.createElement("div");
      item.className = "week-item";
      item.innerHTML = `
        <img src="${photo.src}" loading="lazy" alt="${photo.author}">
        <div class="week-overlay">
          <span>${photo.author}</span>
        </div>
      `;

      // لما نضغط على الصورة:
      // - نحفظ مصفوفة الأسبوع كما هي
      // - نحفظ index الصورة جوا الأسبوع
      item.onclick = () => {
        currentWeekPhotos = grouped[month][week];
        currentWeekIndex = i;
        openweekly(currentWeekPhotos[currentWeekIndex]);
      };

      grid.appendChild(item);
    });
  });

  container.appendChild(monthDiv);
});

// 4) ستايل الخلفية للجاليري
const style = document.createElement("style");
style.innerHTML = `
  .weekly-gallery {
    background: #e0e0e0;
    padding: 80px 5%;
    color: #111;
  }
`;
document.head.appendChild(style);

// 5) دالة فتح اللايت بوكس
function openweekly(photo) {
  const lightbox = document.getElementById("weeklyLightbox");
  const img = document.getElementById("weeklyImg");
  const author = document.getElementById("weeklyAuthor");

  img.src = photo.src;
  author.textContent = photo.author;

  lightbox.classList.add("active");
}

// 6) إغلاق اللايت بوكس
document.getElementById("weeklyClose").onclick = () => {
  document.getElementById("weeklyLightbox").classList.remove("active");
};

// 7) زر التالي
document.getElementById("weeklyNext").onclick = () => {
  currentWeekIndex = (currentWeekIndex - 1 + currentWeekPhotos.length) % currentWeekPhotos.length;
  openweekly(currentWeekPhotos[currentWeekIndex]);
};

// 8) زر السابق
document.getElementById("weeklyPrev").onclick = () => {
  currentWeekIndex = (currentWeekIndex + 1) % currentWeekPhotos.length;
  openweekly(currentWeekPhotos[currentWeekIndex]);
};


// 9) اغلاق اللايت بوكس عند الضغط على الخلفية
document.getElementById("weeklyLightbox").addEventListener("click", (e) => {
  if (e.target.id === "weeklyLightbox") {
    document.getElementById("weeklyLightbox").classList.remove("active");
  }
});
