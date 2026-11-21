// Twin Lanterns — the difference tables.
//
// One entry per scene: its name, a one-line blurb, a difficulty in stars,
// and its differences. A difference is a spot on the 560x420 panel:
//   id     the branch the scene painter in scenes.js switches on
//   x, y   the centre of the changed detail, in panel pixels
//   r      the radius that counts as a hit (generous: fair, not pixel-perfect)
//   label  what the player found, shown in the found list and the hint pulse
//
// The left panel is always the original; the right panel applies every
// difference. A difference is "fair" when a careful look reveals it: a colour
// swapped, a small object added or missing, a shape moved or turned.

export const PANEL_W = 560;
export const PANEL_H = 420;

export const SCENES = [
  {
    name: 'Harbour Dawn',
    blurb: 'Fishing boats under a rising sun',
    difficulty: 1,
    diffs: [
      { id: 'sunrays', x: 430, y: 70, r: 42, label: 'Sun rays' },
      { id: 'flag', x: 70, y: 172, r: 16, label: 'Lighthouse flag' },
      { id: 'gull', x: 300, y: 90, r: 15, label: 'Third seagull' },
      { id: 'window', x: 405, y: 320, r: 12, label: 'Lit window' },
      { id: 'stripe', x: 255, y: 298, r: 14, label: 'Sail stripe' },
      { id: 'buoy', x: 480, y: 360, r: 16, label: 'Buoy colour' },
      { id: 'smoke', x: 405, y: 258, r: 18, label: 'Chimney smoke' },
      { id: 'fish', x: 150, y: 348, r: 18, label: 'Jumping fish' },
    ],
  },
  {
    name: 'Lantern Lane',
    blurb: 'A quiet street at dusk',
    difficulty: 2,
    diffs: [
      { id: 'lantern', x: 280, y: 120, r: 16, label: 'Lantern colour' },
      { id: 'cat', x: 120, y: 300, r: 18, label: 'Cat on the wall' },
      { id: 'awning', x: 380, y: 182, r: 18, label: 'Awning stripes' },
      { id: 'basket', x: 200, y: 330, r: 16, label: 'Bicycle basket' },
      { id: 'moon', x: 480, y: 60, r: 26, label: 'The moon' },
      { id: 'sign', x: 430, y: 150, r: 14, label: 'Shop sign' },
      { id: 'puddle', x: 300, y: 380, r: 20, label: 'Puddle reflection' },
      { id: 'star', x: 150, y: 50, r: 12, label: 'A missing star' },
    ],
  },
  {
    name: 'Night Market',
    blurb: 'Stalls, lights and good smells',
    difficulty: 3,
    diffs: [
      { id: 'balloon', x: 90, y: 80, r: 18, label: 'Red balloon' },
      { id: 'fruit', x: 300, y: 300, r: 18, label: 'Fruit in the crate' },
      { id: 'bulb', x: 250, y: 90, r: 12, label: 'A dark bulb' },
      { id: 'hat', x: 420, y: 200, r: 16, label: 'Vendor hat' },
      { id: 'price', x: 180, y: 170, r: 14, label: 'Price tag' },
      { id: 'crate', x: 480, y: 330, r: 18, label: 'Extra crate' },
      { id: 'tail', x: 140, y: 330, r: 16, label: 'Cat tail' },
      { id: 'dots', x: 330, y: 140, r: 18, label: 'Awning pattern' },
    ],
  },
  {
    name: 'Coral Reef',
    blurb: 'Under the waves',
    difficulty: 4,
    diffs: [
      { id: 'turtle', x: 280, y: 200, r: 30, label: 'Turtle direction' },
      { id: 'starfish', x: 100, y: 350, r: 18, label: 'Starfish colour' },
      { id: 'bubbles', x: 450, y: 120, r: 16, label: 'Missing bubble' },
      { id: 'chest', x: 380, y: 340, r: 22, label: 'Treasure chest' },
      { id: 'fish', x: 200, y: 150, r: 16, label: 'Yellow fish' },
      { id: 'seaweed', x: 60, y: 300, r: 18, label: 'Tall seaweed' },
      { id: 'coral', x: 500, y: 260, r: 18, label: 'Coral branch' },
      { id: 'shell', x: 230, y: 380, r: 14, label: 'A small shell' },
    ],
  },
  {
    name: 'Mountain Cabin',
    blurb: 'Snow, silence and woodsmoke',
    difficulty: 5,
    diffs: [
      { id: 'hat', x: 150, y: 300, r: 16, label: 'Snowman hat' },
      { id: 'windows', x: 330, y: 220, r: 18, label: 'Lit windows' },
      { id: 'topper', x: 480, y: 150, r: 14, label: 'Tree topper' },
      { id: 'birds', x: 200, y: 70, r: 16, label: 'Second bird' },
      { id: 'sled', x: 420, y: 360, r: 18, label: 'A red sled' },
      { id: 'moon', x: 80, y: 60, r: 26, label: 'The moon' },
      { id: 'smoke', x: 300, y: 120, r: 18, label: 'Smoke drift' },
      { id: 'marks', x: 250, y: 390, r: 18, label: 'Skate marks' },
    ],
  },
];

/** A scene's differences as a map from id to entry, for the painter. */
export function diffMap(sceneIndex) {
  const map = new Map();
  for (const d of SCENES[sceneIndex].diffs) map.set(d.id, d);
  return map;
}
