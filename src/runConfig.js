const fs = require('fs');
const path = require('path');

function getArgValue(args, name, fallback = null) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

function hasFlag(args, name) {
  return args.includes(name);
}

function requireDirectory(directory, cwd) {
  const resolved = path.resolve(cwd, directory);
  if (!fs.existsSync(resolved)) throw new Error(`Deck directory not found: ${resolved}`);
  if (!fs.statSync(resolved).isDirectory()) throw new Error(`Deck path is not a directory: ${resolved}`);
  return resolved;
}

function resolveRunConfig(args = [], env = process.env, cwd = process.cwd()) {
  const deckArg = getArgValue(args, '--deck', env.DECK_DIR || null);
  const deckRoot = deckArg ? requireDirectory(deckArg, cwd) : cwd;
  const deckMode = Boolean(deckArg);
  const noPreview = hasFlag(args, '--no-preview');
  const defaultPath = (standard, deckRelative) => deckMode ? deckRelative : standard;

  return {
    deckRoot,
    deckMode,
    validateOnly: hasFlag(args, '--validate-only'),
    noDesign: hasFlag(args, '--no-design'),
    noDeckDesign: hasFlag(args, '--no-deck-design'),
    strictAssets: hasFlag(args, '--strict-assets') || env.STRICT_ASSETS === '1',
    strictProvenance: hasFlag(args, '--strict-provenance') || env.STRICT_PROVENANCE === '1',
    contentPath: getArgValue(args, '--content', env.CONTENT_JSON || defaultPath('input/content.json', 'content.json')),
    themePath: getArgValue(args, '--theme', env.THEME_JSON || defaultPath('input/theme.json', 'theme.json')),
    outputPath: getArgValue(args, '--out', env.OUTPUT_PPTX || 'output/generated_deck.pptx'),
    plannedContentPath: getArgValue(args, '--plan-out', env.PLANNED_CONTENT_JSON || (deckMode ? 'output/planned_content.json' : null)),
    notesPath: getArgValue(args, '--notes', env.NOTES_MD || (deckMode ? 'output/speaker_notes.md' : null)),
    imageCatalogPath: getArgValue(args, '--image-catalog', env.IMAGE_CATALOG_JSON || (deckMode ? 'output/image_catalog.json' : null)),
    previewDir: noPreview ? null : getArgValue(args, '--preview', env.PREVIEW_DIR || (deckMode ? 'output/preview' : null)),
    contactSheetPath: noPreview ? null : getArgValue(args, '--contact-sheet', env.CONTACT_SHEET || (deckMode ? 'output/contact_sheet.pdf' : null))
  };
}

function usage() {
  return [
    'Usage: node src/index.js [options]',
    '',
    'Options:',
    '  --deck <directory>       Build a self-contained deck folder with content.json and theme.json.',
    '  --content <path>         Content JSON path.',
    '  --theme <path>           Theme JSON path.',
    '  --out <path>             Output PowerPoint path.',
    '  --strict-assets           Fail when an image reference cannot be resolved.',
    '  --strict-provenance       Fail when available image assets have no provenance metadata.',
    '  --preview <directory>    Render slide PNGs when renderer dependencies are available.',
    '  --contact-sheet <path>   Create a contact-sheet PDF from rendered PNGs.',
    '  --no-preview              Skip preview and contact-sheet rendering.',
    '  --validate-only           Validate inputs without generating a deck.',
    '  --help                    Show this message.'
  ].join('\n');
}

module.exports = { getArgValue, resolveRunConfig, usage };
