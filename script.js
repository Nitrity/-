// Навигация по слайдам портфолио
const slides = Array.from(document.querySelectorAll('.slide'));
const menuBtns = Array.from(document.querySelectorAll('.menu-btn'));
const dotsBox = document.getElementById('dots');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
let current = 0;

// Точки-индикаторы
slides.forEach((_, i) => {
  const d = document.createElement('button');
  d.className = 'dot';
  d.setAttribute('aria-label', 'Слайд ' + (i + 1));
  d.addEventListener('click', () => goTo(i));
  dotsBox.appendChild(d);
});
const dots = Array.from(dotsBox.children);

function goTo(index) {
  if (index < 0 || index >= slides.length || index === current) return;
  const old = slides[current];
  old.classList.remove('active');
  old.classList.add('leaving');
  setTimeout(() => old.classList.remove('leaving'), 500);

  // Останавливаем видео при уходе со слайда
  old.querySelectorAll('video').forEach(v => v.pause());

  current = index;
  render();
  history.replaceState(null, '', '#' + slides[current].id);
}

function render() {
  slides.forEach((s, i) => s.classList.toggle('active', i === current));
  menuBtns.forEach((b, i) => b.classList.toggle('active', i === current));
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === slides.length - 1;
}

// Кнопки «назад/вперёд»
prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));

// Любые элементы с data-goto (меню, кнопки на слайдах, логотип)
document.querySelectorAll('[data-goto]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    goTo(Number(el.dataset.goto));
  });
});

// Клавиатура
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'PageDown') goTo(current + 1);
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') goTo(current - 1);
  if (e.key === 'Home') goTo(0);
  if (e.key === 'End') goTo(slides.length - 1);
});

// Свайпы на телефоне
let startX = null;
document.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => {
  if (startX === null) return;
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 60) goTo(current + (dx < 0 ? 1 : -1));
  startX = null;
});

// Открытие нужного слайда по ссылке вида ...#skills
const hash = location.hash.slice(1);
const startIndex = slides.findIndex(s => s.id === hash);
if (startIndex > 0) current = startIndex;
render();
