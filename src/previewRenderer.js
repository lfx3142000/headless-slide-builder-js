const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

function findExecutable(value) {
  if (!value) return null;
  if (path.isAbsolute(value) || value.includes(path.sep)) return fs.existsSync(value) ? value : null;
  const locator = process.platform === 'win32' ? 'where.exe' : 'which';
  try {
    const found = execFileSync(locator, [value], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      .split(/\r?\n/)
      .map((entry) => entry.trim())
      .find(Boolean);
    return found || null;
  } catch (_) {
    return null;
  }
}

function removeStalePreviewFiles(outDir) {
  if (!fs.existsSync(outDir)) return;
  for (const name of fs.readdirSync(outDir)) {
    if (/^slide-\d+\.png$/i.test(name) || /\.pdf$/i.test(name)) {
      fs.rmSync(path.join(outDir, name), { force: true });
    }
  }
}

function renderPreview(pptxPath, outDir = 'output/preview', options = {}) {
  const absPptx = path.resolve(pptxPath);
  const absOut = path.resolve(outDir);
  if (!fs.existsSync(absPptx)) throw new Error(`Cannot preview missing file: ${absPptx}`);
  fs.mkdirSync(absOut, { recursive: true });

  const soffice = findExecutable(options.sofficePath || process.env.SOFFICE_PATH || 'soffice');
  const pdftoppm = findExecutable(options.pdftoppmPath || process.env.PDFTOPPM_PATH || 'pdftoppm');
  if (!soffice || !pdftoppm) {
    console.log('Preview skipped: LibreOffice and Poppler are required. Set SOFFICE_PATH and PDFTOPPM_PATH or add soffice and pdftoppm to PATH.');
    return null;
  }

  removeStalePreviewFiles(absOut);
  execFileSync(soffice, ['--headless', '--convert-to', 'pdf', '--outdir', absOut, absPptx], { stdio: 'pipe' });
  const pdfPath = path.join(absOut, `${path.basename(absPptx, path.extname(absPptx))}.pdf`);
  if (!fs.existsSync(pdfPath)) throw new Error(`Preview PDF was not created: ${pdfPath}`);
  const pngPrefix = path.join(absOut, 'slide');
  execFileSync(pdftoppm, ['-png', '-r', '120', pdfPath, pngPrefix], { stdio: 'pipe' });
  const pngs = fs.readdirSync(absOut)
    .filter((file) => /^slide-\d+\.png$/i.test(file))
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]))
    .map((file) => path.join(absOut, file));
  console.log(`Preview rendered: ${pngs.length} slide images in ${absOut}`);
  return { pdfPath, pngs, outDir: absOut };
}

function createContactSheet(previewDir, outputPath, options = {}) {
  const scriptPath = options.scriptPath || path.resolve(__dirname, '..', 'scripts', 'contact_sheet.py');
  const python = findExecutable(options.pythonPath || process.env.PYTHON_PATH || 'python3') || findExecutable('python');
  if (!python) throw new Error('Contact-sheet generation requires Python. Set PYTHON_PATH or add python3/python to PATH.');
  if (!fs.existsSync(scriptPath)) throw new Error(`Contact-sheet script not found: ${scriptPath}`);
  const resolvedOutput = path.resolve(outputPath);
  fs.mkdirSync(path.dirname(resolvedOutput), { recursive: true });
  execFileSync(python, [scriptPath, path.resolve(previewDir), resolvedOutput], { stdio: 'inherit' });
  if (!fs.existsSync(resolvedOutput)) throw new Error(`Contact sheet was not created: ${resolvedOutput}`);
  return resolvedOutput;
}

module.exports = { createContactSheet, findExecutable, renderPreview };
