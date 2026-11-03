const card = document.querySelector('.business-card');
const cardStage = document.querySelector('.card-stage');
const pageLoader = document.querySelector('.page-loader');
const themeColor = document.querySelector('meta[name="theme-color"]');
const themeToggle = document.querySelector('.theme-toggle');
const sections = document.querySelector('.portfolio-sections');
const sectionButtons = [...sections.querySelectorAll('[data-section]')];
const sectionPanels = [...sections.querySelectorAll('[data-panel]')];
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
  ]) {
    card.style.removeProperty(property);
  }
}

function setExpanded(expanded) {
  resetTilt();

  cardStage.classList.toggle('is-expanded', expanded);
  document.body.classList.toggle('card-expanded', expanded);
  card.setAttribute('aria-label', expanded ? 'Johan Jagalur portfolio' : 'Johan Jagalur business card');
  card.setAttribute('aria-expanded', String(expanded));
}

function selectSection(name) {
  sectionButtons.forEach((button) => {
    const selected = button.dataset.section === name;
    button.classList.toggle('is-selected', selected);
    if (selected) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  sectionPanels.forEach((panel) => { panel.hidden = panel.dataset.panel !== name; });
}

function renderRoute() {
  const expanded = location.hash === '#/projects';
  setExpanded(expanded);
  sections.hidden = !expanded;
  if (expanded) selectSection('about');
}

function closeCard() {
  location.hash = '';
  renderRoute();
  card.focus();
}

card.addEventListener('pointerenter', startTilt);
card.addEventListener('pointermove', queueTilt);
card.addEventListener('pointerleave', resetTilt);
card.addEventListener('pointercancel', resetTilt);
card.addEventListener('click', (event) => {
  if (event.target.closest('a, button')) return;
  if (cardStage.classList.contains('is-expanded')) {
    if (event.target.matches('.business-card, .business-card__contact, .social-links')) closeCard();
    return;
  }
  location.hash = '/projects';
});
card.addEventListener('keydown', (event) => {
  if (event.target === card && !cardStage.classList.contains('is-expanded') &&
      (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    location.hash = '/projects';
  }
});
document.addEventListener('click', (event) => {
  if (cardStage.classList.contains('is-expanded') &&
      !card.contains(event.target) && !themeToggle.contains(event.target)) closeCard();
});
sectionButtons.forEach((button) => {
  button.addEventListener('click', () => selectSection(button.dataset.section));
});
window.addEventListener('hashchange', () => {
  renderRoute();
  if (location.hash !== '#/projects') card.focus();
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && cardStage.classList.contains('is-expanded')) closeCard();
});
reducedMotion.addEventListener('change', resetTilt);
renderRoute();

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
