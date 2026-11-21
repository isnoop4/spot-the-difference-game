// Twin Lanterns — the five scenes, drawn procedurally on canvas.
//
// paintScene(ctx, sceneIndex, applied, W, H) draws one scene. `applied` is
// the Set of difference ids the right panel applies: every branch below
// switches on it, so the left panel (empty set) is the original and the
// right panel (all ids) is the changed picture. Nothing is loaded from a
// file: every sky, sea, roof and lantern is canvas code.
//
// Panel space is 560x420. Coordinates here match the tables in
// differences.js, so a click on a changed detail lands on its hit circle.

function disc(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function box(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function tri(ctx, x1, y1, x2, y2, x3, y3, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function star5(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function gull(ctx, x, y, s) {
  line(ctx, x - 8 * s, y, x, y - 5 * s, '#3a3a3a', 2);
  line(ctx, x, y - 5 * s, x + 8 * s, y, '#3a3a3a', 2);
}

function sky(ctx, W, H, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function label(ctx, text, x, y, size, color, font = 'bold sans-serif') {
  ctx.fillStyle = color;
  ctx.font = `${size}px ${font}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

// ---------------------------------------------------------------- scene 0

function paintHarbour(ctx, applied, W, H) {
  sky(ctx, W, H, '#ffd9a0', '#ffe9c4');
  // Sun, top right.
  disc(ctx, 430, 70, 34, '#fff3b0');
  if (!applied.has('sunrays')) {
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      line(ctx, 430 + Math.cos(a) * 42, 70 + Math.sin(a) * 42,
        430 + Math.cos(a) * 56, 70 + Math.sin(a) * 56, '#f5c542', 3);
    }
  }
  // Clouds and gulls.
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath(); ctx.ellipse(150, 60, 46, 14, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(330, 45, 36, 11, 0, 0, Math.PI * 2); ctx.fill();
  gull(ctx, 220, 80, 1);
  gull(ctx, 260, 68, 0.9);
  if (!applied.has('gull')) gull(ctx, 300, 90, 1);
  // Sea.
  const sea = ctx.createLinearGradient(0, 330, 0, H);
  sea.addColorStop(0, '#3d8fb5');
  sea.addColorStop(1, '#1d5f86');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 330, W, H - 330);
  line(ctx, 0, 330, W, 330, '#7ec8e3', 2);
  for (const [x, y] of [[120, 355], [330, 375], [500, 350], [210, 395]]) {
    line(ctx, x - 22, y, x + 22, y, 'rgba(255,255,255,0.35)', 2);
  }
  // Lighthouse, left.
  box(ctx, 52, 180, 36, 150, '#f5f0e6');
  box(ctx, 52, 210, 36, 10, '#d94f3d');
  box(ctx, 52, 260, 36, 10, '#d94f3d');
  box(ctx, 52, 305, 36, 10, '#d94f3d');
  box(ctx, 46, 168, 48, 14, '#33415c');
  disc(ctx, 70, 175, 6, '#ffe08a');
  line(ctx, 70, 168, 70, 148, '#33415c', 3);
  tri(ctx, 70, 148, 70, 162, 92, 155, applied.has('flag') ? '#3d7bd9' : '#d94f3d');
  // Fisherman's house, right.
  box(ctx, 370, 300, 100, 60, '#e8b04b');
  tri(ctx, 360, 300, 480, 300, 425, 262, '#8a4a2b');
  box(ctx, 400, 268, 10, 26, '#5c3a21');
  if (!applied.has('smoke')) {
    disc(ctx, 405, 258, 7, 'rgba(255,255,255,0.75)');
    disc(ctx, 412, 246, 9, 'rgba(255,255,255,0.6)');
    disc(ctx, 420, 232, 11, 'rgba(255,255,255,0.45)');
  }
  box(ctx, 395, 312, 20, 20, applied.has('window') ? '#3a3348' : '#ffe08a');
  box(ctx, 435, 312, 20, 20, '#ffe08a');
  // Sailboat, centre.
  tri(ctx, 225, 335, 285, 335, 255, 285, '#fff7e6');
  if (!applied.has('stripe')) tri(ctx, 255, 285, 262, 320, 248, 320, '#d94f3d');
  line(ctx, 255, 285, 255, 340, '#5c3a21', 3);
  box(ctx, 222, 335, 66, 12, '#8a4a2b');
  // Buoy.
  disc(ctx, 480, 360, 12, applied.has('buoy') ? '#f5d90a' : '#e86a1c');
  disc(ctx, 480, 352, 4, '#fff');
  // A fish jumps, only on the changed panel.
  if (applied.has('fish')) {
    ctx.strokeStyle = '#2b6a8a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(150, 348, 14, Math.PI, 0);
    ctx.stroke();
    tri(ctx, 162, 336, 172, 340, 162, 346, '#2b6a8a');
  }
}

// ---------------------------------------------------------------- scene 1

function paintLanternLane(ctx, applied, W, H) {
  sky(ctx, W, H, '#2b2a4a', '#7a4a6b');
  // Stars and moon.
  for (const [x, y] of [[60, 40], [110, 90], [200, 30], [340, 55], [420, 30], [520, 90], [90, 130]]) {
    disc(ctx, x, y, 2.5, '#fff8d6');
  }
  if (!applied.has('star')) disc(ctx, 150, 50, 2.5, '#fff8d6');
  if (applied.has('moon')) {
    disc(ctx, 480, 60, 24, '#f5ead0');
  } else {
    disc(ctx, 480, 60, 24, '#f5ead0');
    disc(ctx, 492, 54, 22, '#2b2a4a');
  }
  // Street and buildings.
  box(ctx, 0, 360, W, 60, '#241d33');
  box(ctx, 0, 150, 130, 210, '#1d1830');
  box(ctx, 440, 130, 120, 230, '#241d38');
  // Shop awning and sign, right building.
  const stripes = applied.has('awning') ? 4 : 5;
  for (let i = 0; i < stripes; i++) {
    box(ctx, 360 + i * 24, 170, 24, 22, i % 2 === 0 ? '#d94f3d' : '#f5ead8');
  }
  box(ctx, 360, 192, 120, 6, '#5c3a21');
  if (applied.has('sign')) disc(ctx, 430, 150, 10, '#7ee081');
  else star5(ctx, 430, 150, 11, '#ffd166');
  box(ctx, 460, 230, 60, 90, '#3a2f5c');
  box(ctx, 470, 245, 40, 40, '#ffe08a');
  // Lantern string across the lane.
  line(ctx, 40, 100, 520, 100, '#0f0c1c', 2);
  const lanternXs = [80, 160, 240, 280, 360, 440, 500];
  for (const x of lanternXs) {
    line(ctx, x, 100, x, 108, '#0f0c1c', 1);
    const colour = x === 280 && applied.has('lantern') ? '#7ee081' : '#ff5a4e';
    disc(ctx, x, 120, 11, colour);
    disc(ctx, x, 120, 5, '#ffd166');
  }
  // Wall and cat, left.
  box(ctx, 60, 300, 140, 60, '#3a2f5c');
  if (!applied.has('cat')) {
    ctx.fillStyle = '#14101f';
    ctx.beginPath();
    ctx.ellipse(120, 292, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    disc(ctx, 138, 282, 8, '#14101f');
    tri(ctx, 132, 276, 136, 268, 140, 276, '#14101f');
    tri(ctx, 140, 276, 144, 268, 148, 276, '#14101f');
  }
  // Bicycle, centre.
  ctx.strokeStyle = '#c9b8e8';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(185, 335, 16, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(225, 335, 16, 0, Math.PI * 2); ctx.stroke();
  line(ctx, 185, 335, 205, 312, '#c9b8e8', 3);
  line(ctx, 205, 312, 225, 335, '#c9b8e8', 3);
  line(ctx, 205, 312, 195, 300, '#c9b8e8', 3);
  if (!applied.has('basket')) {
    ctx.strokeStyle = '#8a6d3b';
    ctx.lineWidth = 2;
    ctx.strokeRect(160, 312, 22, 16);
  }
  // Puddle with a lantern reflection.
  if (!applied.has('puddle')) {
    ctx.fillStyle = 'rgba(255,209,102,0.35)';
    ctx.beginPath();
    ctx.ellipse(300, 380, 46, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---------------------------------------------------------------- scene 2

function paintNightMarket(ctx, applied, W, H) {
  sky(ctx, W, H, '#1a1440', '#3d2a6b');
  for (const [x, y] of [[50, 40], [150, 70], [300, 35], [450, 55], [520, 100]]) {
    disc(ctx, x, y, 2, '#fff8d6');
  }
  // String lights.
  line(ctx, 20, 70, 540, 70, '#0f0c1c', 2);
  for (let i = 0; i < 9; i++) {
    const x = 60 + i * 50;
    line(ctx, x, 70, x, 80, '#0f0c1c', 1);
    const dark = i === 4 && applied.has('bulb');
    disc(ctx, x, 90, 7, dark ? '#3a3348' : '#ffd166');
  }
  // Balloon, top left.
  if (!applied.has('balloon')) {
    disc(ctx, 90, 80, 16, '#ff5a4e');
    tri(ctx, 90, 96, 84, 106, 96, 106, '#ff5a4e');
    line(ctx, 90, 106, 90, 140, '#c9b8e8', 1);
  }
  // Stalls.
  box(ctx, 40, 200, 180, 130, '#5c3a21');
  box(ctx, 300, 180, 200, 150, '#4a2f1d');
  // Left stall awning: dots or stripes.
  box(ctx, 30, 140, 200, 34, '#f5ead8');
  if (applied.has('dots')) {
    for (let i = 0; i < 5; i++) box(ctx, 34 + i * 40, 140, 20, 34, '#d94f3d');
  } else {
    for (const [x, y] of [[60, 152], [110, 162], [160, 152], [210, 162]]) disc(ctx, x, y, 6, '#d94f3d');
  }
  // Price sign on the left stall.
  box(ctx, 160, 150, 40, 40, '#241a3d');
  label(ctx, applied.has('price') ? '6' : '5', 180, 170, 24, '#ffd166');
  // Fruit crate, centre.
  box(ctx, 270, 290, 70, 40, '#7a5a2b');
  for (let i = 0; i < 5; i++) {
    disc(ctx, 282 + i * 12, 288, 8, applied.has('fruit') ? '#f58a1c' : '#d94f3d');
  }
  disc(ctx, 290, 278, 8, applied.has('fruit') ? '#f58a1c' : '#d94f3d');
  disc(ctx, 312, 276, 8, applied.has('fruit') ? '#f58a1c' : '#d94f3d');
  // Vendor behind the right stall.
  disc(ctx, 420, 190, 16, '#e8b98a');
  box(ctx, 398, 206, 44, 46, '#3d7bd9');
  tri(ctx, 398, 192, 442, 192, 420, 168, applied.has('hat') ? '#2e9e5b' : '#2b4a8a');
  // Jars on the right stall.
  for (const [x, c] of [[320, '#7ee081'], [350, '#ff8a7a'], [470, '#ffd166']]) {
    box(ctx, x, 300, 22, 30, c);
    box(ctx, x - 2, 294, 26, 8, '#8a6d3b');
  }
  // Cat by the left stall, tail up or down.
  ctx.fillStyle = '#14101f';
  ctx.beginPath(); ctx.ellipse(140, 330, 20, 9, 0, 0, Math.PI * 2); ctx.fill();
  disc(ctx, 156, 320, 7, '#14101f');
  if (applied.has('tail')) line(ctx, 122, 326, 112, 344, '#14101f', 4);
  else line(ctx, 122, 326, 112, 306, '#14101f', 4);
  // Extra crate, right, only on the original.
  if (!applied.has('crate')) {
    box(ctx, 462, 330, 36, 26, '#7a5a2b');
    line(ctx, 462, 343, 498, 343, '#5c3a21', 2);
  }
  // Ground.
  box(ctx, 0, 360, W, 60, '#241d33');
}

// ---------------------------------------------------------------- scene 3

function paintCoralReef(ctx, applied, W, H) {
  const water = ctx.createLinearGradient(0, 0, 0, H);
  water.addColorStop(0, '#0b7ea8');
  water.addColorStop(1, '#062a4a');
  ctx.fillStyle = water;
  ctx.fillRect(0, 0, W, H);
  // Light rays.
  ctx.fillStyle = 'rgba(255,255,220,0.08)';
  for (const x of [120, 260, 420]) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 40, 0);
    ctx.lineTo(x + 90, 380);
    ctx.lineTo(x + 30, 380);
    ctx.closePath();
    ctx.fill();
  }
  // Sand.
  ctx.fillStyle = '#d9c08a';
  ctx.beginPath();
  ctx.ellipse(280, 430, 340, 60, 0, Math.PI, 0);
  ctx.fill();
  // Seaweed, left.
  const weedH = applied.has('seaweed') ? 60 : 100;
  ctx.strokeStyle = '#2e9e5b';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(60, 390);
  ctx.quadraticCurveTo(50, 340, 62, 390 - weedH);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(80, 390);
  ctx.quadraticCurveTo(92, 350, 78, 310);
  ctx.stroke();
  // Coral, right.
  ctx.strokeStyle = '#ff7a9e';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(500, 380);
  ctx.quadraticCurveTo(490, 320, 500, 260);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(497, 310);
  ctx.quadraticCurveTo(470, 290, 460, 270);
  ctx.stroke();
  if (!applied.has('coral')) {
    ctx.beginPath();
    ctx.moveTo(500, 300);
    ctx.quadraticCurveTo(530, 280, 535, 255);
    ctx.stroke();
  }
  // Turtle, centre.
  const facingRight = applied.has('turtle');
  const tx = 280;
  const ty = 200;
  ctx.fillStyle = '#4a9e6b';
  ctx.beginPath(); ctx.ellipse(tx, ty, 42, 26, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#7ee081';
  ctx.beginPath(); ctx.ellipse(tx, ty - 6, 26, 14, 0, 0, Math.PI * 2); ctx.fill();
  disc(ctx, facingRight ? tx + 46 : tx - 46, ty - 4, 12, '#4a9e6b');
  disc(ctx, facingRight ? tx + 50 : tx - 50, ty - 8, 3, '#14101f');
  for (const [fx, fy] of [[-30, 18], [30, 18], [-28, -18], [28, -18]]) {
    ctx.fillStyle = '#4a9e6b';
    ctx.beginPath(); ctx.ellipse(tx + fx, ty + fy, 12, 6, 0, 0, Math.PI * 2); ctx.fill();
  }
  // Fish school.
  const fishColour = applied.has('fish') ? '#3d7bd9' : '#ffd166';
  for (const [x, y, s] of [[200, 150, 1], [170, 130, 0.8], [230, 120, 0.7], [350, 90, 0.9]]) {
    ctx.fillStyle = x === 200 ? fishColour : '#ff8a7a';
    ctx.beginPath(); ctx.ellipse(x, y, 16 * s, 8 * s, 0, 0, Math.PI * 2); ctx.fill();
    tri(ctx, x - 14 * s, y, x - 24 * s, y - 8 * s, x - 24 * s, y + 8 * s, x === 200 ? fishColour : '#ff8a7a');
  }
  // Bubbles, top right.
  const bubbles = applied.has('bubbles') ? 4 : 5;
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 2;
  for (let i = 0; i < bubbles; i++) {
    ctx.beginPath();
    ctx.arc(440 + i * 8, 130 - i * 14, 6 - i * 0.5, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Treasure chest.
  box(ctx, 350, 330, 60, 30, '#7a5a2b');
  if (applied.has('chest')) {
    box(ctx, 350, 322, 60, 10, '#7a5a2b');
  } else {
    ctx.fillStyle = '#5c3a21';
    ctx.beginPath();
    ctx.arc(380, 330, 30, Math.PI, 0);
    ctx.fill();
    for (const [x, y] of [[368, 318], [380, 312], [392, 318]]) disc(ctx, x, y, 5, '#ffd166');
  }
  // Starfish.
  star5(ctx, 100, 350, 16, applied.has('starfish') ? '#f58a1c' : '#ff7a9e');
  // A small shell, only on the changed panel.
  if (applied.has('shell')) {
    ctx.fillStyle = '#f5ead8';
    ctx.beginPath();
    ctx.arc(230, 380, 12, Math.PI, 0);
    ctx.fill();
    line(ctx, 222, 380, 238, 380, '#d9c08a', 2);
  }
}

// ---------------------------------------------------------------- scene 4

function paintMountainCabin(ctx, applied, W, H) {
  sky(ctx, W, H, '#101830', '#3a4a7a');
  // Moon.
  if (applied.has('moon')) {
    disc(ctx, 80, 60, 24, '#f5ead0');
  } else {
    disc(ctx, 80, 60, 24, '#f5ead0');
    disc(ctx, 92, 54, 22, '#101830');
  }
  // Birds.
  gull(ctx, 200, 70, 1);
  if (!applied.has('birds')) gull(ctx, 232, 58, 0.9);
  // Snow ground and frozen lake.
  ctx.fillStyle = '#e8eef7';
  ctx.fillRect(0, 340, W, 80);
  ctx.fillStyle = '#a8c8e8';
  ctx.beginPath();
  ctx.ellipse(260, 392, 120, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  if (applied.has('marks')) {
    ctx.strokeStyle = '#5c7a9e';
    ctx.lineWidth = 2;
    for (const [x, y] of [[210, 388], [240, 396], [280, 386], [310, 394]]) {
      line(ctx, x, y, x + 18, y + 4, '#5c7a9e', 2);
    }
  }
  // Pines.
  const pine = (x, base, h, topper) => {
    ctx.fillStyle = '#1d4a2b';
    tri(ctx, x - 26, base, x + 26, base, x, base - h, '#1d4a2b');
    tri(ctx, x - 20, base - h * 0.55, x + 20, base - h * 0.55, x, base - h, '#2e6b3d');
    box(ctx, x - 4, base, 8, 12, '#5c3a21');
    if (topper) star5(ctx, x, base - h - 8, 8, '#ffd166');
  };
  pine(60, 350, 90, false);
  pine(140, 355, 70, false);
  pine(480, 350, 100, !applied.has('topper'));
  pine(520, 355, 70, false);
  // Cabin.
  box(ctx, 280, 220, 100, 100, '#8a5a2b');
  tri(ctx, 268, 220, 392, 220, 330, 180, '#5c3a21');
  ctx.fillStyle = '#fff';
  tri(ctx, 268, 220, 392, 220, 330, 180, 'rgba(255,255,255,0.9)');
  tri(ctx, 268, 220, 392, 220, 330, 180, '#5c3a21');
  ctx.fillStyle = '#e8eef7';
  ctx.beginPath();
  ctx.moveTo(268, 220); ctx.lineTo(392, 220); ctx.lineTo(330, 180); ctx.closePath();
  ctx.fill();
  box(ctx, 318, 268, 24, 52, '#3a2410');
  box(ctx, 292, 232, 18, 18, applied.has('windows') ? '#3a3348' : '#ffe08a');
  box(ctx, 350, 232, 18, 18, '#ffe08a');
  // Chimney and smoke.
  box(ctx, 360, 190, 14, 30, '#5c3a21');
  const drift = applied.has('smoke') ? 1 : -1;
  disc(ctx, 367 + drift * 8, 178, 6, 'rgba(255,255,255,0.7)');
  disc(ctx, 367 + drift * 16, 164, 8, 'rgba(255,255,255,0.55)');
  disc(ctx, 367 + drift * 26, 148, 10, 'rgba(255,255,255,0.4)');
  // Snowman.
  disc(ctx, 150, 330, 22, '#fff');
  disc(ctx, 150, 300, 16, '#fff');
  disc(ctx, 150, 278, 11, '#fff');
  disc(ctx, 146, 276, 2, '#14101f');
  disc(ctx, 154, 276, 2, '#14101f');
  tri(ctx, 150, 280, 168, 283, 150, 286, '#e86a1c');
  if (!applied.has('hat')) {
    box(ctx, 140, 262, 20, 6, '#14101f');
    box(ctx, 144, 250, 12, 14, '#14101f');
  }
  // Sled, only on the changed panel.
  if (applied.has('sled')) {
    box(ctx, 400, 356, 44, 8, '#d94f3d');
    line(ctx, 404, 364, 396, 374, '#8a4a2b', 3);
    line(ctx, 440, 364, 448, 374, '#8a4a2b', 3);
  }
}

// ---------------------------------------------------------------- entry

const PAINTERS = [paintHarbour, paintLanternLane, paintNightMarket, paintCoralReef, paintMountainCabin];

/** Draw scene `sceneIndex` on `ctx`; `applied` holds the difference ids the right panel shows. */
export function paintScene(ctx, sceneIndex, applied, W, H) {
  ctx.clearRect(0, 0, W, H);
  PAINTERS[sceneIndex](ctx, applied, W, H);
}
