var swiper = new Swiper('.mySwiper', {
    loop: false,// اختیاری است، اگر می‌خواهید اسلایدها به طور حلقه‌ای اجرا شوند
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
// سایر گزینه‌های Swiper که ممکن است نیاز داشته باشید مانند slidesPerView، spaceBetween و غیره
});
document.getElementById('dropdown-toggle').addEventListener('click', function() {
    const menu = document.getElementById('navbar-language');
    menu.classList.toggle('hidden'); // Toggle visibility
});
