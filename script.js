const slides = [...document.querySelectorAll('.slide')];
const deck = document.querySelector('.deck');
const count = document.querySelector('#count');
let active = 0;

function go(index) {
  active = Math.max(0, Math.min(slides.length - 1, index));
  slides[active].scrollIntoView({ behavior: 'smooth', block: 'start' });
  count.textContent = `${active + 1} / ${slides.length}`;
}

document.querySelector('#prev').addEventListener('click', () => go(active - 1));
document.querySelector('#next').addEventListener('click', () => go(active + 1));
window.addEventListener('keydown', (event) => {
  if (['ArrowRight', 'PageDown', ' '].includes(event.key)) go(active + 1);
  if (['ArrowLeft', 'PageUp'].includes(event.key)) go(active - 1);
});

deck.addEventListener('scroll', () => {
  const next = slides.reduce((best, slide, index) => {
    const delta = Math.abs(slide.getBoundingClientRect().top);
    return delta < best.delta ? { index, delta } : best;
  }, { index: active, delta: Infinity }).index;
  if (next !== active) {
    active = next;
    count.textContent = `${active + 1} / ${slides.length}`;
  }
}, { passive: true });
