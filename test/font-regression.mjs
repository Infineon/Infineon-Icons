/**
 * Regression test for all generated build artifacts.
 *
 * Covers:
 *   - TTF / WOFF       — glyph paths, codepoints, font metrics  (via opentype.js)
 *   - WOFF2            — file-size sanity (opentype.js has no WOFF2 decoder)
 *   - infineon-icons.css — icon-name → codepoint mappings
 *   - icons.d.ts       — exported icon names
 *   - icons.js         — SVG content per icon
 *
 * Usage:
 *   1. Save the current build as baseline:
 *        node test/font-regression.mjs --save-baseline
 *   2. Make your changes and rebuild:
 *        pnpm build
 *   3. Run the comparison:
 *        node test/font-regression.mjs   (or: pnpm test:fonts)
 */

import { readFileSync, cpSync, mkdirSync, existsSync } from 'fs';
import { load } from 'opentype.js';

// ─── paths ────────────────────────────────────────────────────────────────────

const BASE_DIR    = new URL('./baseline/', import.meta.url).pathname;
const FONTS_DIR   = new URL('../dist/fonts/', import.meta.url).pathname;
const DIST_DIR    = new URL('../dist/', import.meta.url).pathname;

const FILES = {
  ttf:   { base: `${BASE_DIR}infineon-icons.ttf`,   curr: `${FONTS_DIR}infineon-icons.ttf`   },
  woff:  { base: `${BASE_DIR}infineon-icons.woff`,  curr: `${FONTS_DIR}infineon-icons.woff`  },
  woff2: { base: `${BASE_DIR}infineon-icons.woff2`, curr: `${FONTS_DIR}infineon-icons.woff2` },
  css:   { base: `${BASE_DIR}infineon-icons.css`,   curr: `${FONTS_DIR}infineon-icons.css`   },
  dts:   { base: `${BASE_DIR}icons.d.ts`,           curr: `${DIST_DIR}icons.d.ts`            },
  js:    { base: `${BASE_DIR}icons.js`,             curr: `${DIST_DIR}icons.js`              },
};

// ─── save-baseline mode ───────────────────────────────────────────────────────

if (process.argv.includes('--save-baseline')) {
  mkdirSync(BASE_DIR, { recursive: true });
  for (const { curr, base } of Object.values(FILES)) {
    cpSync(curr, base);
  }
  console.log('Baseline saved to test/baseline/');
  process.exit(0);
}

// ─── helpers ──────────────────────────────────────────────────────────────────

let errors = 0;
let checks = 0;

function pass(label) {
  checks++;
  console.log(`  ✓  ${label}`);
}

function fail(label, detail) {
  errors++;
  checks++;
  console.error(`  ✗  ${label}`);
  if (detail) console.error(`       ${detail}`);
}

const COORD_PRECISION = 1;
function round(n) {
  return Math.round(n * 10 ** COORD_PRECISION) / 10 ** COORD_PRECISION;
}

function glyphPathData(glyph) {
  return glyph.path.commands.map((cmd) => {
    const coords = [cmd.x, cmd.y, cmd.x1, cmd.y1, cmd.x2, cmd.y2]
      .filter((v) => v !== undefined)
      .map(round);
    return `${cmd.type}${coords.join(',')}`;
  }).join(' ');
}

function buildCodepointMap(font) {
  const map = new Map();
  for (let i = 0; i < font.glyphs.length; i++) {
    const g = font.glyphs.get(i);
    if (g.unicode !== undefined) map.set(g.unicode, g);
  }
  return map;
}

// ─── font check (TTF or WOFF) ─────────────────────────────────────────────────

async function checkFont(label, basePath, currPath) {
  console.log(`\n[${label}]`);
  const [baseline, current] = await Promise.all([load(basePath), load(currPath)]);
  const baseMap = buildCodepointMap(baseline);
  const currMap = buildCodepointMap(current);

  // missing glyphs
  for (const [cp, g] of baseMap) {
    if (!currMap.has(cp)) {
      fail(`U+${cp.toString(16).padStart(4, '0')} "${g.name}" missing`);
    }
  }

  // new glyphs (informational only)
  for (const [cp, g] of currMap) {
    if (!baseMap.has(cp)) {
      console.log(`  +  NEW  U+${cp.toString(16).padStart(4, '0')}  "${g.name}"`);
    }
  }

  // glyph paths
  let pathDiffs = 0;
  for (const [cp, baseGlyph] of baseMap) {
    const currGlyph = currMap.get(cp);
    if (!currGlyph) continue;
    if (glyphPathData(baseGlyph) !== glyphPathData(currGlyph)) {
      pathDiffs++;
      fail(
        `Path changed  U+${cp.toString(16).padStart(4, '0')}  "${baseGlyph.name}"`,
        `baseline name: "${baseGlyph.name}"  current name: "${currGlyph.name}"`,
      );
    }
  }
  if (pathDiffs === 0) pass(`All ${baseMap.size} glyph paths match`);

  // font metrics
  for (const key of ['unitsPerEm', 'ascender', 'descender']) {
    const bVal = baseline.tables.os2?.[key] ?? baseline[key];
    const cVal = current.tables.os2?.[key] ?? current[key];
    if (bVal !== cVal) {
      fail(`Metric "${key}"`, `baseline=${bVal}  current=${cVal}`);
    } else {
      pass(`Metric "${key}" = ${bVal}`);
    }
  }
}

// ─── WOFF2 size check ─────────────────────────────────────────────────────────

function checkWoff2(basePath, currPath) {
  console.log('\n[WOFF2]');
  const baseSize = readFileSync(basePath).length;
  const currSize = readFileSync(currPath).length;
  const ratio = currSize / baseSize;
  // allow ±10% size variance (compression may vary slightly across tools)
  if (ratio < 0.90 || ratio > 1.10) {
    fail(`File size changed`, `baseline=${baseSize}B  current=${currSize}B  (${((ratio - 1) * 100).toFixed(1)}%)`);
  } else {
    pass(`File size within ±10%  (baseline=${baseSize}B  current=${currSize}B)`);
  }
}

// ─── CSS check ────────────────────────────────────────────────────────────────

function parseCssCodepoints(css) {
  // Handle both webfont format:    .icon-NAME::before { content: "\eXXX"; }
  // and fantasticon format: .icon.icon-NAME:before {\n    content: "\eXXX";\n}
  const map = new Map();
  for (const [, name, cp] of css.matchAll(/\.icon(?:\.icon)?-([^:{]+):{1,2}before[^{]*\{[^}]*content:\s*["'\\]+([0-9a-fA-F]+)/g)) {
    map.set(name.trim(), cp.toLowerCase());
  }
  return map;
}

function checkCss(basePath, currPath) {
  console.log('\n[CSS — icon codepoint mappings]');
  const baseMap = parseCssCodepoints(readFileSync(basePath, 'utf8'));
  const currMap = parseCssCodepoints(readFileSync(currPath, 'utf8'));

  let diffs = 0;
  for (const [name, cp] of baseMap) {
    if (!currMap.has(name)) {
      fail(`Icon ".icon-${name}" missing`);
      diffs++;
    } else if (currMap.get(name) !== cp) {
      fail(`Codepoint changed for ".icon-${name}"`, `baseline=\\${cp}  current=\\${currMap.get(name)}`);
      diffs++;
    }
  }
  for (const name of currMap.keys()) {
    if (!baseMap.has(name)) console.log(`  +  NEW  .icon-${name}`);
  }
  if (diffs === 0) pass(`All ${baseMap.size} icon CSS classes match`);
}

// ─── icons.d.ts check ─────────────────────────────────────────────────────────

function parseExports(dts) {
  return new Set(
    [...dts.matchAll(/^export const (\w+)/gm)].map(([, name]) => name),
  );
}

function checkDts(basePath, currPath) {
  console.log('\n[icons.d.ts — exported names]');
  const baseNames = parseExports(readFileSync(basePath, 'utf8'));
  const currNames = parseExports(readFileSync(currPath, 'utf8'));
  let diffs = 0;
  for (const name of baseNames) {
    if (!currNames.has(name)) { fail(`Export "${name}" missing`); diffs++; }
  }
  for (const name of currNames) {
    if (!baseNames.has(name)) console.log(`  +  NEW  export "${name}"`);
  }
  if (diffs === 0) pass(`All ${baseNames.size} exports present`);
}

// ─── icons.js check ───────────────────────────────────────────────────────────

function parseSvgMap(js) {
  // extract:  var xxxxxIcon = "<svg ...>";
  const map = new Map();
  for (const [, name, svg] of js.matchAll(/^var (\w+Icon) = ("(?:[^"\\]|\\.)*");/gm)) {
    map.set(name, svg);
  }
  return map;
}

function checkJs(basePath, currPath) {
  console.log('\n[icons.js — SVG content]');
  const baseMap = parseSvgMap(readFileSync(basePath, 'utf8'));
  const currMap = parseSvgMap(readFileSync(currPath, 'utf8'));
  let diffs = 0;
  for (const [name, svg] of baseMap) {
    if (!currMap.has(name)) {
      fail(`Icon "${name}" missing`); diffs++;
    } else if (currMap.get(name) !== svg) {
      fail(`SVG content changed for "${name}"`); diffs++;
    }
  }
  for (const name of currMap.keys()) {
    if (!baseMap.has(name)) console.log(`  +  NEW  "${name}"`);
  }
  if (diffs === 0) pass(`All ${baseMap.size} SVG strings match`);
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  // verify baseline exists
  for (const [key, { base }] of Object.entries(FILES)) {
    if (!existsSync(base)) {
      console.error(`Baseline missing for "${key}": ${base}`);
      console.error('Run: node test/font-regression.mjs --save-baseline');
      process.exit(1);
    }
  }

  await checkFont('TTF',  FILES.ttf.base,  FILES.ttf.curr);
  await checkFont('WOFF', FILES.woff.base, FILES.woff.curr);
  checkWoff2(FILES.woff2.base, FILES.woff2.curr);
  checkCss(FILES.css.base, FILES.css.curr);
  checkDts(FILES.dts.base, FILES.dts.curr);
  checkJs(FILES.js.base, FILES.js.curr);

  console.log(`\n${'─'.repeat(50)}`);
  if (errors === 0) {
    console.log(`✓ All ${checks} checks passed — no regressions.`);
    process.exit(0);
  } else {
    console.error(`✗ ${errors} of ${checks} checks failed.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
