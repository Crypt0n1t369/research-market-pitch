const deck = document.querySelector('#deck');
const slides = [...document.querySelectorAll('.slide')];
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
const progress = document.querySelector('#progress');
let active = 0;

function go(index) {
  active = Math.max(0, Math.min(slides.length - 1, index));
  slides[active].scrollIntoView({ behavior: 'smooth', block: 'start' });
  update();
}

function update() {
  progress.textContent = `${active + 1} / ${slides.length}`;
  prev.disabled = active === 0;
  next.disabled = active === slides.length - 1;
  history.replaceState(null, '', `#${active + 1}`);
}

function detectActive() {
  const midpoint = deck.scrollTop + window.innerHeight / 2;
  active = slides.findIndex((slide, i) => midpoint >= slide.offsetTop && midpoint < (slides[i + 1]?.offsetTop ?? Infinity));
  if (active < 0) active = 0;
  update();
}

prev.addEventListener('click', () => go(active - 1));
next.addEventListener('click', () => go(active + 1));
deck.addEventListener('scroll', () => requestAnimationFrame(detectActive), { passive: true });
window.addEventListener('keydown', (event) => {
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); go(active + 1); }
  if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); go(active - 1); }
  if (event.key === 'Home') go(0);
  if (event.key === 'End') go(slides.length - 1);
});

const hashIndex = Number(location.hash.replace('#', '')) - 1;
if (Number.isInteger(hashIndex) && hashIndex >= 0) go(hashIndex);
else update();
