const loader = document.getElementById('loader');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const sliderTrack = document.getElementById('sliderTrack');
const slider = document.getElementById('gallerySlider');
const prevSlide = document.getElementById('prevSlide');
const nextSlide = document.getElementById('nextSlide');
const sliderDots = document.getElementById('sliderDots');
const orderForm = document.getElementById('orderForm');
const whatsappNumber = '212665196156';
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hide');
    document.body.classList.remove('loading');
  }, 450);
});

document.body.classList.add('loading');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((element) => {
  revealObserver.observe(element);
});

let currentSlide = 0;
let sliderTimer;
const slides = Array.from(document.querySelectorAll('.slide'));

function buildDots() {
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `الصورة ${index + 1}`);
    dot.addEventListener('click', () => {
      goToSlide(index);
      restartSlider();
    });
    sliderDots.appendChild(dot);
  });
}

function updateSlider() {
  sliderTrack.style.transform = `translateX(${currentSlide * 100}%)`;
  Array.from(sliderDots.children).forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function goToSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  updateSlider();
}

function next() {
  goToSlide(currentSlide - 1);
}

function prev() {
  goToSlide(currentSlide + 1);
}

function startSlider() {
  sliderTimer = setInterval(next, 3500);
}

function restartSlider() {
  clearInterval(sliderTimer);
  startSlider();
}

if (slides.length) {
  buildDots();
  updateSlider();
  startSlider();

  nextSlide.addEventListener('click', () => {
    next();
    restartSlider();
  });

  prevSlide.addEventListener('click', () => {
    prev();
    restartSlider();
  });

  slider.addEventListener('mouseenter', () => clearInterval(sliderTimer));
  slider.addEventListener('mouseleave', startSlider);
}

let touchStartX = 0;
let touchEndX = 0;

sliderTrack.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

sliderTrack.addEventListener('touchend', (event) => {
  touchEndX = event.changedTouches[0].screenX;
  const distance = touchEndX - touchStartX;

  if (Math.abs(distance) > 45) {
    if (distance > 0) {
      next();
    } else {
      prev();
    }
    restartSlider();
  }
}, { passive: true });

document.querySelectorAll('.faq-question').forEach((question) => {
  question.addEventListener('click', () => {
    const item = question.parentElement;
    const answer = item.querySelector('.faq-answer');
    const isActive = item.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach((faq) => {
      faq.classList.remove('active');
      faq.querySelector('.faq-answer').style.maxHeight = null;
    });

    if (!isActive) {
      item.classList.add('active');
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});

function updateCountdown() {
  const now = new Date();
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const diff = Math.max(0, end - now);
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

function setError(input, message) {
  input.classList.add('invalid');
  document.getElementById(`${input.id}Error`).textContent = message;
}

function clearError(input) {
  input.classList.remove('invalid');
  document.getElementById(`${input.id}Error`).textContent = '';
}

function validateForm() {
  const name = document.getElementById('name');
  const phone = document.getElementById('phone');
  const city = document.getElementById('city');
  let valid = true;

  [name, phone, city].forEach(clearError);

  if (name.value.trim().length < 3) {
    setError(name, 'المرجو إدخال الاسم الكامل.');
    valid = false;
  }

  const phoneValue = phone.value.trim().replace(/\s/g, '');
  const moroccanPhone = /^(0|\+212|212)(5|6|7)[0-9]{8}$/;
  if (!moroccanPhone.test(phoneValue)) {
    setError(phone, 'المرجو إدخال رقم هاتف مغربي صحيح.');
    valid = false;
  }

  if (city.value.trim().length < 2) {
    setError(city, 'المرجو إدخال المدينة.');
    valid = false;
  }

  return valid;
}

orderForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!validateForm()) {
    const firstInvalid = orderForm.querySelector('.invalid');
    if (firstInvalid) {
      firstInvalid.focus();
    }
    return;
  }

   // 🔥 ADD PIXEL EVENT هنا
  fbq('track', 'Lead');
  

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const city = document.getElementById('city').value.trim();
  const message = `الاسم: ${name}

الهاتف: ${phone}

المدينة: ${city}

أرغب في طلب جهاز قياس ضغط الدم الذكي بسعر 249 درهم.`;

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
});

orderForm.querySelectorAll('input').forEach((input) => {
  input.addEventListener('input', () => clearError(input));
});