// Twin Lanterns — game state, render loop, markers, timer, scoring, hints.
//
// One scene at a time: the left panel is the original, the right panel
// applies every difference. A click (or Enter on the crosshair) on either
// panel checks the spot. Finds earn 100 points plus a combo bonus; a wrong
// click costs 5 seconds. Three hints per scene, a magnifier lens, and a
// 2:30 countdown per scene.
//
// Screenshot states come from the URL, so a real browser render can show
// any moment of play: ?scene=0&found=0,1,2 marks three differences found,
// &hint=4 pulses a hint ring, &state=win shows the scene-complete card,
// &state=over the time-up card.

import { SCENES, PANEL_W, PANEL_H } from './differences.js';
import { paintScene } from './scenes.js';
import { sfx } from './audio.js';
import { attachInput } from './input.js';

const SCENE_TIME_MS = 150000;
const HINT_MS = 2500;
const HINT_COOLDOWN_MS = 10000;
const WRONG_PENALTY_MS = 5000;

const $ = (id) => document.getElementById(id);
const leftCanvas = $('leftCanvas');
const rightCanvas = $('rightCanvas');
const lensCanvas = $('lens');
const leftCtx = leftCanvas.getContext('2d');
const rightCtx = rightCanvas.getContext('2d');
const lensCtx = lensCanvas.getContext('2d');

const state = {
  scene: 0,
  status: 'menu', // menu | playing | won | lost
  found: new Set(),
  score: 0,
  combo: 0,
  hintsLeft: 3,
  hintReadyAt: 0,
  hintPulse: null, // { id, until }
  wrongFlash: null, // { panel, x, y, until }
  endAt: 0,
  lensOn: false,
  mouse: { panel: 'left', x: PANEL_W / 2, y: PANEL_H / 2, inside: false },
  crosshair: { panel: 'left', x: PANEL_W / 2, y: PANEL_H / 2, visible: false },
};

const allIds = (scene) => new Set(SCENES[scene].diffs.map((d) => d.id));
const sceneDiffs = () => SCENES[state.scene].diffs;
const remaining = () => sceneDiffs().length - state.found.size;
const timeLeftMs = () => Math.max(0, state.endAt - performance.now());

// ---------------------------------------------------------------- HUD

function fmtTime(ms) {
  const s = Math.ceil(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function updateHud() {
  const scene = SCENES[state.scene];
  $('sceneName').textContent = scene.name;
  $('foundCount').textContent = `${state.found.size} / ${scene.diffs.length}`;
  $('remainingCount').textContent = String(remaining());
  $('scoreText').textContent = String(state.score);
  $('comboText').textContent = `x${state.combo + 1}`;
  $('hintsLeft').textContent = String(state.hintsLeft);
  const ms = state.status === 'playing' ? timeLeftMs() : SCENE_TIME_MS;
  $('timeText').textContent = fmtTime(ms);
  const fill = $('timeFill');
  fill.style.width = `${(ms / SCENE_TIME_MS) * 100}%`;
  fill.classList.toggle('low', ms < 30000);
  const dots = $('levelDots');
  dots.innerHTML = SCENES.map((_, i) => {
    const cls = i < state.scene ? 'done' : i === state.scene ? 'now' : '';
    return `<i class="${cls}"></i>`;
  }).join('');
}

// ---------------------------------------------------------------- drawing

function drawMarker(ctx, diff, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, diff.r + 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(diff.x - diff.r * 0.45, diff.y);
  ctx.lineTo(diff.x - diff.r * 0.1, diff.y + diff.r * 0.4);
  ctx.lineTo(diff.x + diff.r * 0.5, diff.y - diff.r * 0.4);
  ctx.stroke();
}

function drawCrosshair(ctx, cross) {
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cross.x, cross.y, 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cross.x - 22, cross.y);
  ctx.lineTo(cross.x - 8, cross.y);
  ctx.moveTo(cross.x + 8, cross.y);
  ctx.lineTo(cross.x + 22, cross.y);
  ctx.moveTo(cross.x, cross.y - 22);
  ctx.lineTo(cross.x, cross.y - 8);
  ctx.moveTo(cross.x, cross.y + 8);
  ctx.lineTo(cross.x, cross.y + 22);
  ctx.stroke();
}

function drawPanels() {
  paintScene(leftCtx, state.scene, new Set(), PANEL_W, PANEL_H);
  paintScene(rightCtx, state.scene, allIds(state.scene), PANEL_W, PANEL_H);
  const now = performance.now();
  for (const diff of sceneDiffs()) {
    if (state.found.has(diff.id)) {
      drawMarker(leftCtx, diff, '#2ecc71');
      drawMarker(rightCtx, diff, '#2ecc71');
    }
  }
  if (state.hintPulse && now < state.hintPulse.until) {
    const diff = sceneDiffs().find((d) => d.id === state.hintPulse.id);
    if (diff && !state.found.has(diff.id)) {
      const pulse = 6 + 4 * Math.sin(now / 180);
      const ring = { ...diff, r: diff.r + pulse };
      drawMarker(leftCtx, ring, '#ffd166');
      drawMarker(rightCtx, ring, '#ffd166');
    }
  }
  if (state.wrongFlash && now < state.wrongFlash.until) {
    const ctx = state.wrongFlash.panel === 'left' ? leftCtx : rightCtx;
    const { x, y } = state.wrongFlash;
    ctx.strokeStyle = '#ff5a4e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 12, y - 12);
    ctx.lineTo(x + 12, y + 12);
    ctx.moveTo(x + 12, y - 12);
    ctx.lineTo(x - 12, y + 12);
    ctx.stroke();
  }
  if (state.crosshair.visible && state.status === 'playing') {
    const ctx = state.crosshair.panel === 'left' ? leftCtx : rightCtx;
    drawCrosshair(ctx, state.crosshair);
  }
}

function drawLens() {
  if (!state.lensOn || !state.mouse.inside || state.status !== 'playing') {
    lensCanvas.hidden = true;
    return;
  }
  const source = state.mouse.panel === 'left' ? leftCanvas : rightCanvas;
  const sx = Math.max(0, Math.min(PANEL_W - 100, state.mouse.x - 50));
  const sy = Math.max(0, Math.min(PANEL_H - 100, state.mouse.y - 50));
  lensCtx.clearRect(0, 0, 200, 200);
  lensCtx.drawImage(source, sx, sy, 100, 100, 0, 0, 200, 200);
  lensCtx.strokeStyle = '#ffd166';
  lensCtx.lineWidth = 3;
  lensCtx.beginPath();
  lensCtx.arc(100, 100, 97, 0, Math.PI * 2);
  lensCtx.stroke();
  const stage = $('stage');
  const stageRect = stage.getBoundingClientRect();
  const canvas = state.mouse.panel === 'left' ? leftCanvas : rightCanvas;
  const rect = canvas.getBoundingClientRect();
  let left = rect.left - stageRect.left + state.mouse.x * (rect.width / PANEL_W) + 24;
  let top = rect.top - stageRect.top + state.mouse.y * (rect.height / PANEL_H) + 24;
  left = Math.min(left, stageRect.width - 210);
  top = Math.min(top, stageRect.height - 210);
  lensCanvas.style.left = `${Math.max(0, left)}px`;
  lensCanvas.style.top = `${Math.max(0, top)}px`;
  lensCanvas.hidden = false;
}

function frame() {
  if (state.status === 'playing' && timeLeftMs() <= 0) {
    timeUp();
  }
  drawPanels();
  drawLens();
  updateHud();
  requestAnimationFrame(frame);
}

// ---------------------------------------------------------------- play

function nearestUnfound(x, y) {
  let best = null;
  let bestD = Infinity;
  for (const diff of sceneDiffs()) {
    if (state.found.has(diff.id)) continue;
    const d = Math.hypot(diff.x - x, diff.y - y);
    if (d <= diff.r && d < bestD) {
      best = diff;
      bestD = d;
    }
  }
  return best;
}

function pick(panel, x, y) {
  if (state.status !== 'playing') return;
  const diff = nearestUnfound(x, y);
  if (diff) {
    state.found.add(diff.id);
    state.combo += 1;
    state.score += 100 + (state.combo - 1) * 10;
    sfx.find();
    if (state.found.size === sceneDiffs().length) sceneComplete();
  } else {
    state.combo = 0;
    state.endAt -= WRONG_PENALTY_MS;
    state.wrongFlash = { panel, x, y, until: performance.now() + 600 };
    sfx.wrong();
  }
}

function useHint() {
  if (state.status !== 'playing') return;
  const now = performance.now();
  if (state.hintsLeft <= 0 || now < state.hintReadyAt) return;
  const left = sceneDiffs().filter((d) => !state.found.has(d.id));
  if (left.length === 0) return;
  const diff = left[Math.floor(Math.random() * left.length)];
  state.hintPulse = { id: diff.id, until: now + HINT_MS };
  state.hintsLeft -= 1;
  state.hintReadyAt = now + HINT_COOLDOWN_MS;
  sfx.hint();
}

function sceneComplete() {
  state.status = 'won';
  const bonus = Math.ceil(timeLeftMs() / 1000) * 5;
  state.score += bonus;
  sfx.win();
  const last = state.scene === SCENES.length - 1;
  $('endTitle').textContent = last ? 'You found them all!' : 'Scene complete!';
  $('endText').textContent = last
    ? `All 40 differences across 5 scenes — time bonus +${bonus}.`
    : `${SCENES[state.scene].name} cleared with ${fmtTime(timeLeftMs())} to spare — time bonus +${bonus}.`;
  $('endScore').textContent = String(state.score);
  $('nextBtn').textContent = last ? 'Play again' : 'Next scene';
  $('endOverlay').hidden = false;
}

function timeUp() {
  state.status = 'lost';
  state.combo = 0;
  sfx.wrong();
  $('endTitle').textContent = "Time's up!";
  $('endText').textContent = `${SCENES[state.scene].name}: ${state.found.size} of ${sceneDiffs().length} found. The lanterns burned down.`;
  $('endScore').textContent = String(state.score);
  $('nextBtn').textContent = 'Try again';
  $('endOverlay').hidden = false;
}

function startScene(index) {
  state.scene = index;
  state.found = new Set();
  state.combo = 0;
  state.hintsLeft = 3;
  state.hintReadyAt = 0;
  state.hintPulse = null;
  state.wrongFlash = null;
  state.endAt = performance.now() + SCENE_TIME_MS;
  state.status = 'playing';
  state.crosshair = { panel: 'left', x: PANEL_W / 2, y: PANEL_H / 2, visible: false };
  $('menuOverlay').hidden = true;
  $('endOverlay').hidden = true;
  updateHud();
}

function toMenu() {
  state.status = 'menu';
  $('menuOverlay').hidden = false;
  $('endOverlay').hidden = true;
  updateHud();
}

// ---------------------------------------------------------------- wiring

function buildMenu() {
  const list = $('sceneList');
  list.innerHTML = '';
  SCENES.forEach((scene, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = `<span>${i + 1}. ${scene.name} <small>— ${scene.blurb}</small></span>` +
      `<span class="stars">${'★'.repeat(scene.difficulty)}${'☆'.repeat(5 - scene.difficulty)}</span>`;
    btn.addEventListener('click', () => {
      sfx.click();
      startScene(i);
    });
    list.appendChild(btn);
  });
}

$('hintBtn').addEventListener('click', useHint);
$('lensBtn').addEventListener('click', () => {
  state.lensOn = !state.lensOn;
  $('lensBtn').classList.toggle('active', state.lensOn);
});
$('soundBtn').addEventListener('click', () => {
  sfx.setMuted(!sfx.isMuted());
  $('soundBtn').textContent = sfx.isMuted() ? 'Muted' : 'Sound';
});
$('restartBtn').addEventListener('click', () => startScene(state.scene));
$('menuBtn').addEventListener('click', toMenu);
$('nextBtn').addEventListener('click', () => {
  if (state.status === 'lost') {
    startScene(state.scene);
  } else if (state.scene === SCENES.length - 1) {
    startScene(0);
  } else {
    startScene(state.scene + 1);
  }
});
$('againBtn').addEventListener('click', () => {
  state.score = 0;
  startScene(0);
});

attachInput(
  {
    pick,
    hover(panel, x, y) {
      state.mouse = { panel, x, y, inside: true };
      state.crosshair = { panel, x, y, visible: state.crosshair.visible };
    },
    leave() {
      state.mouse.inside = false;
    },
    nudge(dx, dy) {
      const c = state.crosshair;
      c.visible = true;
      let x = c.x + dx;
      let y = c.y + dy;
      if (x < 0) {
        if (c.panel === 'right') { c.panel = 'left'; x = PANEL_W + x; } else x = 0;
      }
      if (x > PANEL_W) {
        if (c.panel === 'left') { c.panel = 'right'; x -= PANEL_W; } else x = PANEL_W;
      }
      c.x = Math.max(0, Math.min(PANEL_W, x));
      c.y = Math.max(0, Math.min(PANEL_H, y));
    },
    confirm() {
      state.crosshair.visible = true;
      pick(state.crosshair.panel, state.crosshair.x, state.crosshair.y);
    },
    switchPanel() {
      state.crosshair.panel = state.crosshair.panel === 'left' ? 'right' : 'left';
      state.crosshair.visible = true;
    },
    useHint,
    toggleLens() {
      state.lensOn = !state.lensOn;
      $('lensBtn').classList.toggle('active', state.lensOn);
    },
    restart() {
      startScene(state.scene);
    },
    toMenu,
    selectScene(i) {
      if (i >= 0 && i < SCENES.length) startScene(i);
    },
  },
  leftCanvas,
  rightCanvas,
);

// ---------------------------------------------------------------- boot

buildMenu();
updateHud();
drawPanels();

const params = new URLSearchParams(location.search);
const demoScene = Number(params.get('scene') ?? 0);
if (params.get('muted') === '1') {
  sfx.setMuted(true);
  $('soundBtn').textContent = 'Muted';
}
if (params.has('scene') || params.has('found') || params.has('state')) {
  startScene(Number.isInteger(demoScene) && demoScene >= 0 && demoScene < SCENES.length ? demoScene : 0);
  const foundParam = params.get('found');
  if (foundParam) {
    for (const n of foundParam.split(',')) {
      const diff = sceneDiffs()[Number(n)];
      if (diff) state.found.add(diff.id);
    }
  }
  const hintParam = params.get('hint');
  if (hintParam !== null) {
    const diff = sceneDiffs()[Number(hintParam)];
    if (diff) state.hintPulse = { id: diff.id, until: performance.now() + 60000 };
  }
  if (params.get('state') === 'win') {
    for (const diff of sceneDiffs()) state.found.add(diff.id);
    sceneComplete();
  } else if (params.get('state') === 'over') {
    state.endAt = performance.now();
    timeUp();
  }
  updateHud();
  drawPanels();
}

requestAnimationFrame(frame);
