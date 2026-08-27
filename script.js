// ============ MENÚ MÓVIL ============
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ============ NAV: LINK ACTIVO SEGÚN SCROLL ============
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav__link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

sections.forEach(section => navObserver.observe(section));

// ============ BARRA DE PROGRESO DE SCROLL ============
const progressLine = document.getElementById('progressLine');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressLine.style.width = `${pct}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// ============ REVEAL AL HACER SCROLL ============
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // pequeño desfasaje para que entren en cascada
      setTimeout(() => entry.target.classList.add('is-visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// ============ CUENTA REGRESIVA AL EVENTO ============
// El evento empieza el 13 de noviembre de 2026, 09:00 (hora Argentina, UTC-3)
const eventDate = new Date('2026-11-13T09:00:00-03:00').getTime();

function updateCountdown() {
  const now = Date.now();
  const diff = eventDate - now;

  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins = document.getElementById('cd-mins');
  const elSecs = document.getElementById('cd-secs');
  if (!elDays) return;

  if (diff <= 0) {
    elDays.textContent = '0';
    elHours.textContent = '0';
    elMins.textContent = '0';
    elSecs.textContent = '0';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  elDays.textContent = days;
  elHours.textContent = String(hours).padStart(2, '0');
  elMins.textContent = String(mins).padStart(2, '0');
  elSecs.textContent = String(secs).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ============ SATÉLITE SOBRE LA CURVA DE LA AGENDA ============
const orbitCurve = document.getElementById('orbitCurve');
const orbitSat = document.getElementById('orbitSat');
const orbitWrapper = document.querySelector('.orbit');

if (orbitCurve && orbitSat && orbitWrapper) {
  const pathLength = orbitCurve.getTotalLength();
  let satProgress = 0;
  let satAnimating = false;

  function placeSatAt(progress) {
    const point = orbitCurve.getPointAtLength(progress * pathLength);
    // convertimos coordenadas del viewBox (1000x140) a porcentaje del contenedor
    const xPct = (point.x / 1000) * 100;
    const yPct = (point.y / 140) * 100;
    orbitSat.style.left = `${xPct}%`;
    orbitSat.style.top = `${yPct}%`;
  }

  function animateSat() {
    satProgress += 0.0022;
    if (satProgress > 1) satProgress = 0;
    placeSatAt(satProgress);
    requestAnimationFrame(animateSat);
  }

  placeSatAt(0);

  const orbitObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !satAnimating) {
        satAnimating = true;
        requestAnimationFrame(animateSat);
      }
    });
  }, { threshold: 0.2 });
  orbitObserver.observe(orbitWrapper);
}

// ============ CAMPO DE ESTRELLAS (CANVAS) ============
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  generateStars();
}

function generateStars() {
  const density = 0.00012; // estrellas por pixel²
  const count = Math.floor(canvas.width * canvas.height * density);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.3 + 0.2,
    baseAlpha: Math.random() * 0.6 + 0.2,
    twinkleSpeed: Math.random() * 0.02 + 0.005,
    phase: Math.random() * Math.PI * 2,
  }));
}

function drawStars(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(star => {
    const twinkle = prefersReducedMotion
      ? star.baseAlpha
      : star.baseAlpha + Math.sin(time * star.twinkleSpeed + star.phase) * 0.25;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(237, 238, 242, ${Math.max(0, Math.min(1, twinkle))})`;
    ctx.fill();
  });
  if (!prefersReducedMotion) {
    requestAnimationFrame(drawStars);
  }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
requestAnimationFrame(drawStars);

// ============ CARRUSEL · HACKATHONS ANTERIORES ============
// Todo modificado

const pastTrack = document.getElementById('pastTrack');
const pastPrev = document.getElementById('pastPrev');
const pastNext = document.getElementById('pastNext');
const pastDots = document.querySelectorAll('#pastDots button');

if (pastTrack && pastPrev && pastNext) {

  function getCardWidth() {
    const card = pastTrack.querySelector('.past-event');

    if (!card) return 0;

    const gap = 20;

    return card.offsetWidth + gap;
  }

  function getMaxScroll() {
    return pastTrack.scrollWidth - pastTrack.clientWidth;
  }

  function getCurrentDotIndex() {
    const maxScroll = getMaxScroll();

    if (maxScroll <= 0 || pastDots.length <= 1) {
      return 0;
    }

    const position = pastTrack.scrollLeft;

    return Math.round(
      (position / maxScroll) * (pastDots.length - 1)
    );
  }


  function scrollToDot(index) {
    const maxScroll = getMaxScroll();

    if (pastDots.length <= 1) {
      pastTrack.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
      return;
    }

    const position =
      (maxScroll / (pastDots.length - 1)) * index;

    pastTrack.scrollTo({
      left: position,
      behavior: 'smooth'
    });
  }


  pastNext.addEventListener('click', () => {

    const currentIndex = getCurrentDotIndex();

    const nextIndex = Math.min(
      currentIndex + 1,
      pastDots.length - 1
    );

    scrollToDot(nextIndex);

  });


  pastPrev.addEventListener('click', () => {

    const currentIndex = getCurrentDotIndex();

    const prevIndex = Math.max(
      currentIndex - 1,
      0
    );

    scrollToDot(prevIndex);

  });



  pastDots.forEach((dot, index) => {

    dot.addEventListener('click', () => {
      scrollToDot(index);
    });

  });


  pastTrack.addEventListener('scroll', () => {

    const maxScroll = getMaxScroll();

    if (maxScroll <= 0) return;

    const position = pastTrack.scrollLeft;

    const index = Math.round(
      (position / maxScroll) * (pastDots.length - 1)
    );

    pastDots.forEach((dot, i) => {
      dot.classList.toggle(
        'is-active',
        i === index
      );
    });

  });

}
