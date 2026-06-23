const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const test = require('node:test');
const { validateContent } = require('../src/validator');
const { scoreDeck } = require('../src/qualityReporter');
const { validateImageProvenance } = require('../src/imageCatalog');

test('strict assets turn missing image paths into validation errors', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'slide-builder-assets-'));
  const content = { slides: [{ type: 'image_left', title: 'Missing asset', image: 'assets/missing.png' }] };

  const permissive = validateContent(content, { rootDir: root });
  const strict = validateContent(content, { rootDir: root, strictAssets: true });

  assert.equal(permissive.errors.length, 0);
  assert.equal(permissive.warnings.length, 1);
  assert.equal(strict.warnings.length, 0);
  assert.equal(strict.errors.length, 1);
});

test('quality scoring counts unresolved image references', () => {
  const score = scoreDeck({
    slides: [
      { type: 'title', title: 'Demo', speakerNotes: 'Intro' },
      { type: 'image_left', title: 'Image', image: 'assets/missing.png', imageUnresolved: 'assets/missing.png', speakerNotes: 'Explain image' },
      { type: 'image_grid', title: 'Gallery', images: ['assets/missing-2.png'], imagesUnresolved: ['assets/missing-2.png'], speakerNotes: 'Explain gallery' },
      { type: 'closing', title: 'Done', speakerNotes: 'Close' }
    ]
  });

  assert.equal(score.imageIssues, 2);
  assert.match(score.issues.join('\n'), /missing or unresolved/);
});

test('strict provenance requires a source or generation prompt', () => {
  const catalog = [
    { path: 'assets/unattributed.png' },
    { path: 'assets/generated.png', prompt: 'Editorial office scene' }
  ];
  const permissive = validateImageProvenance(catalog);
  const strict = validateImageProvenance(catalog, { strictProvenance: true });

  assert.equal(permissive.warnings.length, 1);
  assert.equal(strict.errors.length, 1);
});
