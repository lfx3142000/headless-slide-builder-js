const fs = require('fs');
const path = require('path');
const { buildDeck, writeDeck } = require('./deckBuilder');
const { exportSpeakerNotes } = require('./notesExporter');
const { mergeTheme } = require('./theme');
const { applyDesignPlan } = require('./designPlanner');
const { buildImageCatalog } = require('./imageCatalog');
const { writeQualityReport } = require('./qualityReporter');
const { writeAdditionalReports } = require('./reportExporter');

function readJson(filePath) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) throw new Error(`Required file not found: ${resolved}`);
  try {
    return JSON.parse(fs.readFileSync(resolved, 'utf8'));
  } catch (err) {
    throw new Error(`Could not parse JSON file ${resolved}: ${err.message}`);
  }
}

function getArgValue(args, name, fallback) {
  const idx = args.indexOf(name);
  if (idx >= 0 && args[idx + 1]) return args[idx + 1];
  return fallback;
}

async function main() {
  const args = process.argv.slice(2);
  const validateOnly = args.includes('--validate-only');
  const noDesign = args.includes('--no-design');
  const noDeckDesign = args.includes('--no-deck-design');

  const contentPath = getArgValue(args, '--content', process.env.CONTENT_JSON || 'input/content.json');
  const themePath = getArgValue(args, '--theme', process.env.THEME_JSON || 'input/theme.json');
  const outputPath = getArgValue(args, '--out', process.env.OUTPUT_PPTX || 'output/generated_deck.pptx');
  const plannedContentPath = getArgValue(args, '--plan-out', process.env.PLANNED_CONTENT_JSON || null);
  const notesPath = getArgValue(args, '--notes', process.env.NOTES_MD || null);
  const imageCatalogPath = getArgValue(args, '--image-catalog', process.env.IMAGE_CATALOG_JSON || null);
  const previewDir = getArgValue(args, '--preview', process.env.PREVIEW_DIR || null);
  const contactSheetPath = getArgValue(args, '--contact-sheet', process.env.CONTACT_SHEET || null);

  console.log('Headless Slide Builder');
  console.log('----------------------');
  console.log(`Content: ${contentPath}`);
  console.log(`Theme: ${themePath}`);
  if (!validateOnly) console.log(`Output: ${outputPath}`);

  const content = readJson(contentPath);
  const theme = readJson(themePath);

  if (imageCatalogPath) {
    const mergedForCatalog = mergeTheme(theme);
    const catalog = buildImageCatalog(mergedForCatalog).map(({ absPath, tokens, ...rest }) => rest);
    fs.mkdirSync(path.dirname(path.resolve(imageCatalogPath)), { recursive: true });
    fs.writeFileSync(path.resolve(imageCatalogPath), JSON.stringify({ generatedAt: new Date().toISOString(), images: catalog }, null, 2));
    console.log(`Image catalog exported to ${path.resolve(imageCatalogPath)} (${catalog.length} images)`);
  }

  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  const pptx = buildDeck(content, theme, { validateOnly, noDesign, noDeckDesign, plannedContentPath });
  const plannedForOutputs = pptx?._slideBuilder?.plannedContent || null;
  const mergedForOutputs = pptx?._slideBuilder?.theme || mergeTheme(theme);

  if (notesPath && plannedForOutputs) {
    const notesWritten = exportSpeakerNotes(plannedForOutputs, notesPath);
    console.log(`Speaker notes exported to ${notesWritten}`);
  }

  if (!validateOnly) {
    const written = await writeDeck(pptx, outputPath);
    if (plannedForOutputs) {
      const qualityPath = path.join(path.dirname(path.resolve(outputPath)), 'quality_report.md');
      const qualityWritten = writeQualityReport(plannedForOutputs, mergedForOutputs, qualityPath, pptx._slideBuilder || {});
      console.log(`Quality report exported to ${qualityWritten}`);
      const reports = writeAdditionalReports(plannedForOutputs, mergedForOutputs, path.dirname(path.resolve(outputPath)), pptx._slideBuilder || {});
      console.log(`Deck summary exported to ${reports.deckSummary}`);
      console.log(`References report exported to ${reports.references}`);
      console.log(`Visual self-review prompt exported to ${reports.visualReviewPrompt}`);
    }
    console.log(`\nSuccess: deck generated at ${written}`);
    if (previewDir) {
      const { renderPreview } = require('./previewRenderer');
      const preview = renderPreview(written, previewDir);
      if (preview && contactSheetPath) {
        const { execFileSync } = require('child_process');
        execFileSync('python3', ['scripts/contact_sheet.py', preview.outDir, contactSheetPath], { stdio: 'inherit' });
      }
    }
  }
}

main().catch((err) => {
  console.error('\nBuild failed.');
  console.error(err.message);
  process.exit(1);
});
