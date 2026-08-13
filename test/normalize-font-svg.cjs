const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const nodePath = require('node:path');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');

const execFileAsync = promisify(execFile);

const main = async () => {
  const normalizedDir = await fs.mkdtemp(nodePath.join(os.tmpdir(), 'ifx-icons-test-'));
  try {
    await execFileAsync(process.env.PYTHON || 'python3', [
      nodePath.join(__dirname, '../build/normalize_font_svgs.py'),
      nodePath.join(__dirname, '../svg'),
      normalizedDir,
    ]);

    const sourceFiles = (await fs.readdir('./svg')).filter((file) => file.endsWith('.svg'));
    const normalizedFiles = (await fs.readdir(normalizedDir)).filter((file) => file.endsWith('.svg'));
    assert.equal(normalizedFiles.length, sourceFiles.length);

    await Promise.all(sourceFiles.map(async (sourceFile) => {
      const normalizedSvg = await fs.readFile(nodePath.join(normalizedDir, sourceFile), 'utf8');
      assert.match(normalizedSvg, /<path\b/, `${sourceFile}: normalized SVG has no path`);
      assert.doesNotMatch(
        normalizedSvg,
        /fill-rule=["']evenodd|clip-rule=["']evenodd|<clipPath\b|transform=/,
        `${sourceFile}: unsupported font construct remains`,
      );
    }));

    console.log(`picosvg font SVG normalization verified for ${sourceFiles.length} icons.`);
  } finally {
    await fs.rm(normalizedDir, { recursive: true, force: true });
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
