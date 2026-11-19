const world = document.querySelector('#world');
const cameraPath = document.querySelector('#camera-path');
const miniPath = document.querySelector('#mini-path');
const mapDot = document.querySelector('#map-dot');
const routeToggle = document.querySelector('#route-toggle');
const introPanel = document.querySelector('#intro-panel');
const progressValue = document.querySelector('#progress-value');
const progressFill = document.querySelector('#progress-fill');
const stageIndex = document.querySelector('#stage-index');
const stageTitle = document.querySelector('#stage-title');
const stageDescription = document.querySelector('#stage-description');
const directionArrow = document.querySelector('#direction-arrow');
const directionLabel = document.querySelector('#direction-label');

const pathLength = cameraPath.getTotalLength();
const miniPathLength = miniPath.getTotalLength();
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const stages = [
  { at: 0, title: '正面｜頭部', description: '鏡頭從正面人物的頭部開始。' },
  { at: .18, title: '正面｜向下', description: '沿著正面人物向下巡覽。' },
  { at: .38, title: '正面｜腳部', description: '抵達正面人物的腳部。' },
  { at: .46, title: '側面｜向上', description: '橫向切換到側身，再往上移動。' },
  { at: .88, title: '返回｜頭部', description: '從側面頭部回到正面起點。' }
];

let targetProgress = 0;
let displayProgress = 0;
let previousPoint = cameraPath.getPointAtLength(0);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function readScroll() {
  const distance = document.documentElement.scrollHeight - innerHeight;
  targetProgress = distance > 0 ? clamp(scrollY / distance, 0, 1) : 0;
}

function cameraTranslation(point) {
  const toolbarHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--toolbar-height')) || 0;
  const viewportHeight = innerHeight - toolbarHeight;
  const maxX = Math.max(world.offsetWidth - innerWidth, 0);
  const maxY = Math.max(world.offsetHeight - viewportHeight, 0);

  return {
    x: -clamp(point.x - innerWidth / 2, 0, maxX),
    y: -clamp(point.y - viewportHeight / 2, 0, maxY)
  };
}

function updateStage(progress) {
  let current = stages[0];
  let currentIndex = 0;

  stages.forEach((stage, index) => {
    if (progress >= stage.at) {
      current = stage;
      currentIndex = index;
    }
  });

  stageIndex.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(stages.length).padStart(2, '0')}`;
  stageTitle.textContent = current.title;
  stageDescription.textContent = current.description;
}

function updateDirection(point) {
  const dx = point.x - previousPoint.x;
  const dy = point.y - previousPoint.y;

  if (Math.hypot(dx, dy) < .01) return;

  if (Math.abs(dx) > Math.abs(dy) * 1.6) {
    directionArrow.textContent = dx >= 0 ? '→' : '←';
    directionLabel.textContent = dx >= 0 ? 'RIGHT' : 'LEFT';
  } else if (Math.abs(dy) > Math.abs(dx) * 1.6) {
    directionArrow.textContent = dy >= 0 ? '↓' : '↑';
    directionLabel.textContent = dy >= 0 ? 'DOWN' : 'UP';
  } else {
    directionArrow.textContent = dy >= 0 ? '↘' : '↖';
    directionLabel.textContent = 'DIAGONAL';
  }

  previousPoint = point;
}

function render() {
  displayProgress += (targetProgress - displayProgress) * (reduceMotion ? 1 : .085);

  const point = cameraPath.getPointAtLength(pathLength * displayProgress);
  const miniPoint = miniPath.getPointAtLength(miniPathLength * displayProgress);
  const translation = cameraTranslation(point);
  const percent = Math.round(displayProgress * 100);

  world.style.transform = `translate3d(${translation.x}px, ${translation.y}px, 0)`;
  mapDot.setAttribute('cx', miniPoint.x);
  mapDot.setAttribute('cy', miniPoint.y);
  progressValue.textContent = `${String(percent).padStart(3, '0')}%`;
  progressFill.style.width = `${displayProgress * 100}%`;
  introPanel.style.opacity = String(clamp(1 - displayProgress * 9, 0, 1));

  updateStage(displayProgress);
  updateDirection(point);
  requestAnimationFrame(render);
}

routeToggle.addEventListener('click', () => {
  const isVisible = world.classList.toggle('show-route');
  routeToggle.setAttribute('aria-pressed', String(isVisible));
  routeToggle.textContent = isVisible ? '隱藏路線' : '顯示路線';
});

addEventListener('scroll', readScroll, { passive: true });
addEventListener('resize', readScroll);
readScroll();
render();
