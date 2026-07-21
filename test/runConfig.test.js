const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const test = require('node:test');
const { resolveRunConfig } = require('../src/runConfig');

test('deck mode uses deck-local inputs and full artifact defaults', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'slide-builder-config-'));
  const deck = path.join(root, 'my-deck');
  fs.mkdirSync(deck);

  const config = resolveRunConfig(['--deck', 'my-deck'], {}, root);

  assert.equal(config.deckMode, true);
  assert.equal(config.deckRoot, deck);
  assert.equal(config.contentPath, 'content.json');
  assert.equal(config.themePath, 'theme.json');
  assert.equal(config.plannedContentPath, 'output/planned_content.json');
  assert.equal(config.previewDir, 'output/preview');
  assert.equal(config.contactSheetPath, 'output/contact_sheet.pdf');
});

test('strict flags and explicit output paths are preserved', () => {
  const config = resolveRunConfig(
    ['--strict-assets', '--strict-provenance', '--out', 'artifacts/final.pptx', '--no-preview'],
    {},
    process.cwd()
  );

  assert.equal(config.strictAssets, true);
  assert.equal(config.strictProvenance, true);
  assert.equal(config.outputPath, 'artifacts/final.pptx');
  assert.equal(config.previewDir, null);
  assert.equal(config.contactSheetPath, null);
});
