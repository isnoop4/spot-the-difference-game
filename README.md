# Twin Lanterns — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/isnoop4/spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/isnoop4/spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Twin Lanterns is an original spot-the-difference game, built for make.fun's
"Make the best spot the difference game" bounty. Five hand-drawn scenes —
Harbour Dawn, Lantern Lane, Night Market, Coral Reef and Mountain Cabin — each
with 8 fair differences hidden by design, 40 in all. Every picture is drawn
procedurally on canvas in code; there are no copied images, no network
requests, and no build step. Find all differences before the timer runs out,
use hints sparingly, and chase the combo bonus.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Or serve `game/` with any static server and open `index.html`.

## How to play

- **Mouse:** click a difference on either panel. A green ring marks a find;
  a wrong click costs 5 seconds.
- **Keyboard:** arrow keys move the crosshair, Enter or Space checks the spot,
  `H` uses a hint, `M` toggles the magnifier, `1`–`5` jump to a scene,
  `R` restarts the scene, `Esc` back to the menu.
- **Magnifier:** hold the lens over a panel to zoom in on the detail.
- **Hints:** 3 per scene. A hint pulses a ring around one difference you have
  not found yet, then needs 10 seconds to recharge.
- **Scoring:** 100 points per find, plus a combo bonus for finds in a row
  without a mistake, plus a time bonus when a scene is cleared.

## Layout

- `game/index.html` — page, panels, HUD and menu
- `game/styles.css` — all styling
- `game/src/scenes.js` — the five scenes, drawn procedurally on canvas
- `game/src/differences.js` — the difference tables (position, radius, label)
- `game/src/game.js` — state, render loop, markers, timer, scoring, hints
- `game/src/input.js` — mouse and keyboard play
- `game/src/audio.js` — synthesized WebAudio sounds (no audio files)
- `main.ts` — hands the game in: copies `game/` and `screenshots/` to
  `/output` and writes `dossier.json` with the vendored make.fun library

---

<sub>Entered on [make.fun](https://make.fun/?ref=zr9ef9xb&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
