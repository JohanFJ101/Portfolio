const card = document.querySelector('.business-card');
const cardStage = document.querySelector('.card-stage');
const learnMore = document.querySelector('.learn-more');
const pageLoader = document.querySelector('.page-loader');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const loaderStartedAt = performance.now();

let cardBounds;
let animationFrame;
let pointerPosition;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function renderTilt() {
  animationFrame = undefined;

  if (!cardBounds || !pointerPosition) return;

  const normalizedX = clamp(
    ((pointerPosition.x - cardBounds.left) / cardBounds.width) * 2 - 1,
    -1,
    1,
  );
  const normalizedY = clamp(
    ((pointerPosition.y - cardBounds.top) / cardBounds.height) * 2 - 1,
    -1,
    1,
  );

  card.style.setProperty('--rotate-x', `${normalizedY * -10}deg`);
  card.style.setProperty('--rotate-y', `${normalizedX * 12}deg`);
  card.style.setProperty('--shadow-x', `${20 - normalizedX * 6}px`);
  card.style.setProperty('--shadow-y', `${22 - normalizedY * 5}px`);
}

function queueTilt(event) {
  if (!card.classList.contains('is-active')) return;

  pointerPosition = { x: event.clientX, y: event.clientY };

  if (!animationFrame) {
    animationFrame = window.requestAnimationFrame(renderTilt);
  }
}

function startTilt(event) {
  if (
    cardStage.classList.contains('is-expanded') ||
    reducedMotion.matches ||
    event.pointerType === 'touch'
  ) {
    return;
  }

  cardBounds = card.getBoundingClientRect();
  card.classList.add('is-active');
  queueTilt(event);
}

function resetTilt() {
  if (animationFrame) {
    window.cancelAnimationFrame(animationFrame);
  }

  animationFrame = undefined;
  cardBounds = undefined;
  pointerPosition = undefined;
  card.classList.remove('is-active');

  for (const property of [
    '--rotate-x',
    '--rotate-y',
    '--shadow-x',
    '--shadow-y',
  ]) {
    card.style.removeProperty(property);
  }
}

function setExpanded(expanded) {
  resetTilt();

  cardStage.classList.toggle('is-expanded', expanded);
  document.body.classList.toggle('card-expanded', expanded);
  learnMore.setAttribute('aria-expanded', String(expanded));
  learnMore.textContent = expanded ? 'Close' : 'Learn more';
}

card.addEventListener('pointerenter', startTilt);
card.addEventListener('pointermove', queueTilt);
card.addEventListener('pointerleave', resetTilt);
card.addEventListener('pointercancel', resetTilt);
learnMore.addEventListener('click', () => {
  setExpanded(!cardStage.classList.contains('is-expanded'));
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && cardStage.classList.contains('is-expanded')) {
    setExpanded(false);
  }
});
reducedMotion.addEventListener('change', resetTilt);

function hidePageLoader() {
  const minimumDisplayTime = reducedMotion.matches ? 0 : 350;
  const remainingTime = Math.max(0, minimumDisplayTime - (performance.now() - loaderStartedAt));

  window.setTimeout(() => {
    pageLoader.classList.add('is-hidden');
    pageLoader.addEventListener('transitionend', () => pageLoader.remove(), { once: true });
  }, remainingTime);
}

if (document.readyState === 'complete') {
  hidePageLoader();
} else {
  window.addEventListener('load', hidePageLoader, { once: true });
}
