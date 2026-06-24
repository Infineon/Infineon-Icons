#!/usr/bin/env node

/**
 * Visual Regression Test for Icon Font
 * Compares font-rendered icons vs SVG originals using Playwright
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const svgDir = path.join(rootDir, 'svg');
const artifactsDir = path.join(rootDir, 'test', '.artifacts', 'visual-regression');
const screenshotsDir = path.join(artifactsDir, 'screenshots');
const reportFile = path.join(artifactsDir, 'report.html');
const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isInteger(parsed) ? parsed : fallback;
};

const toFloat = (value, fallback) => {
  const parsed = Number.parseFloat(value || '');
  return Number.isFinite(parsed) ? parsed : fallback;
};

const CONFIG = {
  viewportSize: toInt(process.env.VISUAL_VIEWPORT_SIZE, 100),
  iconRenderSize: toInt(process.env.VISUAL_ICON_SIZE, 48),
  initialFontWaitMs: toInt(process.env.VISUAL_FONT_WAIT_MS, 1000),
  perIconWaitMs: toInt(process.env.VISUAL_PER_ICON_WAIT_MS, 200),
  pixelmatchThreshold: toFloat(process.env.PIXELMATCH_THRESHOLD, 0.1),
  maxDiffPercent: toFloat(process.env.MAX_DIFF_PERCENT, 3),
};

const isFatalRuntimeError = (error) => {
  const message = String(error?.message || '').toLowerCase();
  return (
    message.includes('target page, context or browser has been closed')
    || message.includes('browser has been closed')
    || message.includes('context was destroyed')
    || message.includes('page has been closed')
    || message.includes('econnreset')
  );
};

const renderCard = (r, headerClass = r.status) => `
          <div class="card">
            <div class="card-header ${headerClass}">
              ${r.iconName}${typeof r.diffPercent === 'number' ? ` (${r.diffPercent.toFixed(2)}%)` : ''}
            </div>
            <div class="card-content">
              ${r.fontScreenshot ? `
                <div class="screenshot">
                  <img src="${r.fontScreenshot}" alt="font">
                  <span class="screenshot-label">Font</span>
                </div>
              ` : '<div></div>'}
              ${r.svgScreenshot ? `
                <div class="screenshot">
                  <img src="${r.svgScreenshot}" alt="svg">
                  <span class="screenshot-label">SVG</span>
                </div>
              ` : '<div></div>'}
              ${r.diffScreenshot ? `
                <div class="screenshot">
                  <img src="${r.diffScreenshot}" alt="diff">
                  <span class="screenshot-label">Diff</span>
                </div>
              ` : '<div></div>'}
            </div>
          </div>
        `;

const renderReport = ({ results, passCount, failCount, skipCount }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visual Regression Report</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
    }
    .header {
      max-width: 1200px;
      margin: 0 auto 30px;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    h1 { margin: 0 0 15px; color: #333; }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 15px;
      margin: 15px 0;
    }
    .stat {
      padding: 12px;
      border-radius: 4px;
      text-align: center;
    }
    .stat.pass { background: #e8f5e9; color: #2e7d32; }
    .stat.fail { background: #ffebee; color: #c62828; }
    .stat.skip { background: #f5f5f5; color: #666; }
    .stat-value { font-size: 24px; font-weight: bold; }
    .stat-label { font-size: 12px; margin-top: 4px; }
    .tabs {
      max-width: 1200px;
      margin: 0 auto;
    }
    .tab-btns {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .tab-btn {
      padding: 8px 16px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }
    .tab-btn.active {
      background: #2196f3;
      color: white;
      border-color: #2196f3;
    }
    .tab { display: none; }
    .tab.active { display: block; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }
    .card {
      background: white;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    .card:hover { transform: translateY(-2px); }
    .card-header {
      padding: 8px;
      font-size: 12px;
      font-weight: 600;
      border-bottom: 1px solid #eee;
    }
    .card-header.pass { background: #e8f5e9; color: #2e7d32; }
    .card-header.fail { background: #ffebee; color: #c62828; }
    .card-header.skip { background: #f5f5f5; color: #999; }
    .card-content {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 4px;
      padding: 4px;
    }
    .screenshot {
      position: relative;
      overflow: hidden;
      aspect-ratio: 1;
      background: #fafafa;
      border: 1px solid #eee;
      border-radius: 3px;
    }
    .screenshot img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .screenshot-label {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 2px 4px;
      font-size: 9px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Visual Regression Report</h1>
    <p>Infineon Icons — Font rendering vs SVG comparison</p>

    <div class="stats">
      <div class="stat pass">
        <div class="stat-value">${passCount}</div>
        <div class="stat-label">Passed</div>
      </div>
      <div class="stat fail">
        <div class="stat-value">${failCount}</div>
        <div class="stat-label">Failed</div>
      </div>
      <div class="stat skip">
        <div class="stat-value">${skipCount}</div>
        <div class="stat-label">Skipped</div>
      </div>
    </div>
  </div>

  <div class="tabs">
    <div class="tab-btns">
      <button class="tab-btn active" onclick="showTab(event, 'all')">All (${results.length})</button>
      <button class="tab-btn" onclick="showTab(event, 'fail')">Failed (${failCount})</button>
    </div>

    <div id="all" class="tab active">
      <div class="grid">
        ${results.map(r => renderCard(r)).join('')}
      </div>
    </div>

    <div id="fail" class="tab">
      <div class="grid">
        ${results.filter(r => r.status === 'fail').map(r => renderCard(r, 'fail')).join('')}
      </div>
    </div>
  </div>

  <script>
    function showTab(evt, name) {
      document.querySelectorAll('.tab').forEach(e => e.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(e => e.classList.remove('active'));
      document.getElementById(name).classList.add('active');
      evt.target.classList.add('active');
    }
  </script>
</body>
</html>`;

// Create output directories
for (const dirPath of [artifactsDir, screenshotsDir]) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const compareScreenshots = (fontBuffer, svgBuffer, diffPath) => {
  const fontPng = PNG.sync.read(fontBuffer);
  const svgPng = PNG.sync.read(svgBuffer);

  if (fontPng.width !== svgPng.width || fontPng.height !== svgPng.height) {
    throw new Error(`Mismatched image dimensions: font ${fontPng.width}x${fontPng.height}, svg ${svgPng.width}x${svgPng.height}`);
  }

  const { width, height } = fontPng;
  const diffPng = new PNG({ width, height });
  const diffPixels = pixelmatch(
    fontPng.data,
    svgPng.data,
    diffPng.data,
    width,
    height,
    {
      threshold: CONFIG.pixelmatchThreshold,
      includeAA: true,
    }
  );

  const totalPixels = width * height;
  const diffPercent = (diffPixels / totalPixels) * 100;
  fs.writeFileSync(diffPath, PNG.sync.write(diffPng));

  return { diffPixels, diffPercent };
};

async function main() {
  console.log('🎨 Visual Regression Test for Infineon Icons\n');

  // Extract icon names from CSS file
  const cssPath = path.join(rootDir, 'dist/fonts/infineon-icons.css');
  if (!fs.existsSync(cssPath)) {
    console.error(`Error: CSS file not found at ${cssPath}`);
    process.exit(1);
  }

  const cssContent = fs.readFileSync(cssPath, 'utf8');
  const fontTtfPath = path.join(rootDir, 'dist/fonts/infineon-icons.ttf');
  if (!fs.existsSync(fontTtfPath)) {
    console.error(`Error: Font file not found at ${fontTtfPath}`);
    process.exit(1);
  }

  // Inline TTF data to guarantee icon font availability in page.setContent.
  const fontBase64 = fs.readFileSync(fontTtfPath).toString('base64');
  const iconCssContent = cssContent.replace(/@font-face\s*\{[\s\S]*?\}\s*/i, '');
  const fontCssContent = `@font-face {
    font-family: "infineon-icons";
    src: url("data:font/truetype;charset=utf-8;base64,${fontBase64}") format("truetype");
    font-weight: normal;
    font-style: normal;
  }\n${iconCssContent}`;
  const iconMatches = cssContent.match(/\.icon\.icon-([a-z0-9-]+):before/gi) || [];
  const iconSet = new Set(
    iconMatches
      .map(m => {
        const match = m.match(/\.icon\.icon-([a-z0-9-]+)/i);
        return match ? match[1] : null;
      })
      .filter(Boolean)
  );
  const requestedIcons = process.env.ICON_ONLY
    ? new Set(process.env.ICON_ONLY.split(',').map(n => n.trim()).filter(Boolean))
    : null;
  const iconLimit = Number.parseInt(process.env.ICON_LIMIT || '', 10);

  let icons = Array.from(iconSet).sort();
  if (requestedIcons) {
    icons = icons.filter(name => requestedIcons.has(name));
  }
  if (Number.isInteger(iconLimit) && iconLimit > 0) {
    icons = icons.slice(0, iconLimit);
  }

  console.log(`Found ${icons.length} icons to test\n`);

  if (icons.length === 0) {
    console.warn('Warning: No icons found in CSS');
    process.exit(1);
  }

  // Create test HTML - single centered icon that we'll iterate through
  const testHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Icon Font Test</title>
  <style>
    ${fontCssContent}
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
    body { display: flex; align-items: center; justify-content: center; background: #fff; }
    .icon { width: ${CONFIG.iconRenderSize}px; height: ${CONFIG.iconRenderSize}px; display: inline-flex; align-items: center; justify-content: center; font-size: ${CONFIG.iconRenderSize}px; line-height: 1; color: #000; }
    .icon:before { display: block; }
  </style>
</head>
<body>
  <span class="icon" id="icon"></span>
</body>
</html>`;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: CONFIG.viewportSize, height: CONFIG.viewportSize },
    deviceScaleFactor: 1,
    colorScheme: 'light',
  });
  const page = await context.newPage();
  const svgPage = await context.newPage();

  try {
    console.log(`Loading test page...`);
    // Set fixed viewport for consistent comparisons
    await page.setViewportSize({ width: CONFIG.viewportSize, height: CONFIG.viewportSize });
    await page.setContent(testHtml);
    await page.waitForLoadState('networkidle');
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
    });
    await page.waitForTimeout(CONFIG.initialFontWaitMs); // Wait for fonts to fully load and render

    await svgPage.setViewportSize({ width: CONFIG.viewportSize, height: CONFIG.viewportSize });

    const results = [];
    let passCount = 0;
    let failCount = 0;
    let skipCount = 0;

    for (let i = 0; i < icons.length; i++) {
      const iconName = icons[i];

      process.stdout.write(`[${i + 1}/${icons.length}] ${iconName.padEnd(30)} `);

      try {
        // Set the icon class dynamically
        await page.evaluate((name) => {
          const el = document.getElementById('icon');
          el.className = `icon icon-${name}`;
        }, iconName);

        await page.waitForTimeout(CONFIG.perIconWaitMs); // Wait for icon to render
        const fontScreenshot = await page.screenshot();

        // Capture SVG
        const svgPath = path.join(svgDir, `${iconName}-16.svg`);
        if (!fs.existsSync(svgPath)) {
          console.log('⊘ SKIP (no SVG)');
          skipCount++;
          results.push({ iconName, status: 'skip', reason: 'SVG file not found' });
          continue;
        }

        const svgContent = fs.readFileSync(svgPath, 'utf8');
        const svgTestHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
    body { display: flex; align-items: center; justify-content: center; background: #fff; color: #000; }
    svg { width: ${CONFIG.iconRenderSize}px; height: ${CONFIG.iconRenderSize}px; color: currentColor; }
  </style>
</head>
<body>${svgContent}</body>
</html>`;

        await svgPage.setContent(svgTestHtml);
        await svgPage.waitForLoadState('networkidle');
        const svgScreenshot = await svgPage.screenshot();

        // Save screenshots
        const fontScreenshotPath = path.join(screenshotsDir, `${iconName}-font.png`);
        const svgScreenshotPath = path.join(screenshotsDir, `${iconName}-svg.png`);
        const diffScreenshotPath = path.join(screenshotsDir, `${iconName}-diff.png`);
        fs.writeFileSync(fontScreenshotPath, fontScreenshot);
        fs.writeFileSync(svgScreenshotPath, svgScreenshot);

        const { diffPixels, diffPercent } = compareScreenshots(fontScreenshot, svgScreenshot, diffScreenshotPath);
        const passed = diffPercent <= CONFIG.maxDiffPercent;
        const status = passed ? 'pass' : 'fail';

        if (passed) passCount++;
        else failCount++;

        console.log(`${status === 'pass' ? '✓ PASS' : '✗ FAIL'} (${diffPercent.toFixed(2)}% diff)`);

        results.push({
          iconName,
          status,
          diffPixels,
          diffPercent,
          fontScreenshot: path.join('screenshots', path.basename(fontScreenshotPath)).replaceAll('\\\\', '/'),
          svgScreenshot: path.join('screenshots', path.basename(svgScreenshotPath)).replaceAll('\\\\', '/'),
          diffScreenshot: path.join('screenshots', path.basename(diffScreenshotPath)).replaceAll('\\\\', '/')
        });

      } catch (error) {
        if (isFatalRuntimeError(error)) {
          throw new Error(`Fatal runtime error at icon "${iconName}": ${error.message}`);
        }
        console.log(`✗ ERROR: ${error.message}`);
        failCount++;
        results.push({ iconName, status: 'fail', reason: error.message });
      }
    }

    await browser.close();

    // Generate report
    const html = renderReport({ results, passCount, failCount, skipCount });

    fs.writeFileSync(reportFile, html);

    console.log(`\n✅ Report generated: ${reportFile}`);
    console.log(`\n📊 Summary:`);
    console.log(`  ✓ Passed:  ${passCount}`);
    console.log(`  ✗ Failed:  ${failCount}`);
    console.log(`  ⊘ Skipped: ${skipCount}`);
    console.log(`  ⚙ Pixel diff threshold: <= ${CONFIG.maxDiffPercent.toFixed(2)}% (pixelmatch threshold ${CONFIG.pixelmatchThreshold})`);

  } catch (error) {
    console.error('Error:', error);
    await browser.close();
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
