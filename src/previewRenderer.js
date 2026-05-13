Try AI directly in your favorite apps … Use Gemini to generate drafts and refine content, plus get Gemini Pro with access to Google's next-gen AI
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

function which(cmd) {
  try { return execFileSync('which', [cmd], { encoding: 'utf8' }).trim(); } catch (_) { return null; }
}

function renderPreview(pptxPath, outDir = 'output/preview') {
  const absPptx = path.resolve(pptxPath);
  const absOut = path.resolve(outDir);
  if (!fs.existsSync(absPptx)) throw new Error(`Cannot preview missing file: ${absPptx}`);
  fs.mkdirSync(absOut, { recursive: true });

  const soffice = which('soffice');
  const pdftoppm = which('pdftoppm');
  if (!soffice || !pdftoppm) {
    console.log('Preview skipped: requires soffice and pdftoppm on PATH.');
    return null;
  }

  execFileSync(soffice, ['--headless', '--convert-to', 'pdf', '--outdir', absOut, absPptx], { stdio: 'pipe' });
  const pdfPath = path.join(absOut, `${path.basename(absPptx, path.extname(absPptx))}.pdf`);
  if (!fs.existsSync(pdfPath)) throw new Error(`Preview PDF was not created: ${pdfPath}`);
  const pngPrefix = path.join(absOut, 'slide');
  execFileSync(pdftoppm, ['-png', '-r', '120', pdfPath, pngPrefix], { stdio: 'pipe' });
  const pngs = fs.readdirSync(absOut).filter((f) => /^slide-\d+\.png$/.test(f)).sort().map((f) => path.join(absOut, f));
  console.log(`Preview rendered: ${pngs.length} slide images in ${absOut}`);
  return { pdfPath, pngs, outDir: absOut };
}

module.exports = { renderPreview };
