// Twin Lanterns — mouse and keyboard play.
//
// attachInput(api) wires the two panels and the keyboard to the game's
// actions. `api` is the object game.js hands over:
//   pick(panel, x, y)     a click (or Enter) at panel coordinates
//   hover(panel, x, y)    the pointer moved over a panel (lens + crosshair)
//   leave()               the pointer left both panels
//   nudge(dx, dy)         arrow keys move the crosshair
//   confirm()             Enter / Space checks the crosshair's spot
//   switchPanel()         Tab moves the crosshair to the other panel
//   useHint()             H
//   toggleLens()          M
//   restart()             R
//   toMenu()              Escape
//   selectScene(i)        keys 1-5
// Coordinates are always panel pixels (560x420), whatever the page's scale.

import { PANEL_W, PANEL_H } from './differences.js';

function panelPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * PANEL_W;
  const y = ((event.clientY - rect.top) / rect.height) * PANEL_H;
  return { x, y };
}

export function attachInput(api, leftCanvas, rightCanvas) {
  for (const [canvas, panel] of [[leftCanvas, 'left'], [rightCanvas, 'right']]) {
    canvas.addEventListener('click', (event) => {
      const { x, y } = panelPoint(canvas, event);
      api.pick(panel, x, y);
    });
    canvas.addEventListener('mousemove', (event) => {
      const { x, y } = panelPoint(canvas, event);
      api.hover(panel, x, y);
    });
    canvas.addEventListener('mouseleave', () => api.leave());
  }

  window.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();
      const step = event.shiftKey ? 40 : 12;
      const dx = key === 'ArrowLeft' ? -step : key === 'ArrowRight' ? step : 0;
      const dy = key === 'ArrowUp' ? -step : key === 'ArrowDown' ? step : 0;
      api.nudge(dx, dy);
      return;
    }
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      api.confirm();
      return;
    }
    if (key === 'Tab') {
      event.preventDefault();
      api.switchPanel();
      return;
    }
    const lower = key.toLowerCase();
    if (lower === 'h') api.useHint();
    else if (lower === 'm') api.toggleLens();
    else if (lower === 'r') api.restart();
    else if (key === 'Escape') api.toMenu();
    else if (key >= '1' && key <= '5') api.selectScene(Number(key) - 1);
  });
}
