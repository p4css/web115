const world = document.querySelector('#world');
const cameraPath = document.querySelector('#camera-path');
const routeButton = document.querySelector('#route-button');
const progressValue = document.querySelector('#progress-value');
const progressFill = document.querySelector('#progress-fill');
const sceneName = document.querySelector('#scene-name');
const mapDot = document.querySelector('#map-dot');
const directionArrow = document.querySelector('#direction-arrow');
const directionLabel = document.querySelector('#direction-label');
const scenes = [...document.querySelectorAll('[data-scene]')];

const pathLength = cameraPath.getTotalLength();
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const miniPath = document.querySelector('.mini-map path');
const miniPathLength = miniPath.getTotalLength();

let targetProgress = 0;
let displayProgress = 0;
let previousPoint = cameraPath.getPointAtLength(0);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function readScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  targetProgress = scrollable > 0 ? clamp(scrollY / scrollable, 0, 1) : 0;
}

function getCameraTranslation(point) {
  const viewportTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--toolbar-height')) || 0;
  const viewportWidth = innerWidth;
  const viewportHeight = innerHeight - viewportTop;
  const maxX = world.offsetWidth - viewportWidth;
  const maxY = world.offsetHeight - viewportHeight;

  return {
    x: -clamp(point.x - viewportWidth / 2, 0, Math.max(maxX, 0)),
    y: -clamp(point.y - viewportHeight / 2, 0, Math.max(maxY, 0))
  };
}

function updateDirection(point) {
  const dx = point.x - previousPoint.x;
  const dy = point.y - previousPoint.y;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  if (Math.hypot(dx, dy) < 0.01) {
    previousPoint = point;
    return;
  } else if (Math.abs(dx) > Math.abs(dy) * 1.8) {
    directionArrow.textContent = dx >= 0 ? '→' : '←';
    directionLabel.textContent = dx >= 0 ? 'RIGHT' : 'LEFT';
  } else if (Math.abs(dy) > Math.abs(dx) * 1.8) {
    directionArrow.textContent = dy >= 0 ? '↓' : '↑';
    directionLabel.textContent = dy >= 0 ? 'DOWN' : 'UP';
  } else {
    directionArrow.textContent = dy >= 0 ? '↘' : '↖';
    directionLabel.textContent = `DIAGONAL ${Math.round(angle)}°`;
  }

  previousPoint = point;
}

function updateSceneLabel(point) {
  let nearestScene = scenes[0];
  let nearestDistance = Infinity;

  scenes.forEach(scene => {
    const x = scene.offsetLeft + scene.offsetWidth / 2;
    const y = scene.offsetTop + scene.offsetHeight / 2;
    const distance = Math.hypot(point.x - x, point.y - y);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestScene = scene;
    }
  });

  sceneName.textContent = nearestScene.dataset.scene;
}

function render() {
  displayProgress += (targetProgress - displayProgress) * (reduceMotion ? 1 : 0.09);

  const point = cameraPath.getPointAtLength(pathLength * displayProgress);
  const translation = getCameraTranslation(point);
  const miniPoint = miniPath.getPointAtLength(miniPathLength * displayProgress);
  const percent = Math.round(displayProgress * 100);

  world.style.transform = `translate3d(${translation.x}px, ${translation.y}px, 0)`;
  progressValue.textContent = `${String(percent).padStart(3, '0')}%`;
  progressFill.style.width = `${displayProgress * 100}%`;
  mapDot.setAttribute('cx', miniPoint.x);
  mapDot.setAttribute('cy', miniPoint.y);

  updateDirection(point);
  updateSceneLabel(point);
  requestAnimationFrame(render);
}

routeButton.addEventListener('click', () => {
  const isVisible = world.classList.toggle('show-route');
  routeButton.setAttribute('aria-pressed', String(isVisible));
  routeButton.textContent = isVisible ? '隱藏完整路線' : '顯示完整路線';
});

addEventListener('scroll', readScrollProgress, { passive: true });
addEventListener('resize', readScrollProgress);
readScrollProgress();
render();
