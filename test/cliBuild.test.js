const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const test = require('node:test');

test('deck-folder mode builds a self-contained deck and its reports', () => {
  const repoRoot = path.resolve(__dirname, '..');
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'slide-builder-deck-'));
  const deckDir = path.join(workspace, 'example');
  fs.mkdirSync(deckDir);
  fs.writeFileSync(path.join(deckDir, 'content.json'), JSON.stringify({
    deckTitle: 'Deck Folder Test',
    subtitle: 'Self-contained inputs',
    slides: [
      { type: 'title', title: 'Deck Folder Test', subtitle: 'Self-contained inputs' },
      { type: 'closing', title: 'Done', bullets: ['Build completed'] }
    ]
  }));
  fs.writeFileSync(path.join(deckDir, 'theme.json'), JSON.stringify({ themeName: 'Test Theme' }));

  const result = spawnSync(process.execPath, ['src/index.js', '--deck', deckDir, '--no-preview'], {
    cwd: repoRoot,
    encoding: 'utf8'
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(fs.existsSync(path.join(deckDir, 'output', 'generated_deck.pptx')), true);
  assert.equal(fs.existsSync(path.join(deckDir, 'output', 'planned_content.json')), true);
  assert.equal(fs.existsSync(path.join(deckDir, 'output', 'quality_report.md')), true);
});
