const card = document.querySelector('.business-card');
const pageLoader = document.querySelector('.page-loader');
const themeColor = document.querySelector('meta[name="theme-color"]');
const themeToggle = document.querySelector('.theme-toggle');
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
  ]) {
    card.style.removeProperty(property);
  }
}

card.addEventListener('pointerenter', startTilt);
card.addEventListener('pointermove', queueTilt);
card.addEventListener('pointerleave', resetTilt);
card.addEventListener('pointercancel', resetTilt);
reducedMotion.addEventListener('change', resetTilt);

themeToggle.addEventListener('click', () => {
  const darkThemeEnabled = document.documentElement.classList.toggle('dark-theme');

  themeToggle.setAttribute('aria-pressed', String(darkThemeEnabled));
  themeToggle.setAttribute(
    'aria-label',
    darkThemeEnabled ? 'Switch to light theme' : 'Switch to dark theme',
  );
  themeColor.setAttribute('content', darkThemeEnabled ? '#0c0c0c' : '#f9f6ee');
});

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
