// Twin Lanterns — spot the difference game, hand-in program (Node 22, stdlib only).
//
// It takes this repository's game/ and screenshots/ and writes them to the
// output directory (MAKEFUN_OUTPUT_DIR outside the grader, /output inside it),
// plus /output/dossier.json, the summary the judge reads, built with the
// vendored make.fun library in vendor/makefun-game.ts. The program is
// deterministic: two runs over the same repository write the same bytes.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// The repository root is where this file lives, never the working directory
// the grader happens to start from.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const gameDir = join(repoRoot, 'game');
const shotsDir = join(repoRoot, 'screenshots');

if (!existsSync(gameDir) || !statSync(gameDir).isDirectory()) {
  throw new Error('hand-in refused: game/ is missing from the repository');
}
if (!existsSync(join(gameDir, 'index.html'))) {
  throw new Error('hand-in refused: game/index.html is missing from the repository');
}
if (!existsSync(shotsDir) || readdirSync(shotsDir).filter((n) => !n.startsWith('.')).length < 3) {
  throw new Error('hand-in refused: screenshots/ needs at least 3 images');
}

mkdirSync(outputDir, { recursive: true });
cpSync(gameDir, join(outputDir, 'game'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(outputDir, 'screenshots'), { recursive: true });

// Same caps the scorer enforces: only text_max_bytes shapes the dossier's
// bytes; the rest make this program refuse exactly where the scorer would.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

// A dossier that was written but holds nothing is a silent failure: refuse
// it here instead of handing the grader an empty summary.
const dossierBytes = statSync(join(outputDir, 'dossier.json')).size;
if (dossierBytes === 0) {
  throw new Error('hand-in refused: dossier.json is empty');
}
