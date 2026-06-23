const fs = require('fs');
const path = require('path');
const { buildDeck, writeDeck } = require('./deckBuilder');
const { exportSpeakerNotes } = require('./notesExporter');
const { mergeTheme } = require('./theme');
const { applyDesignPlan } = require('./designPlanner');
const { buildImageCatalog } = require('./imageCatalog');
const { writeQualityReport } = require('./qualityReporter');
const { writeAdditionalReports } = require('./reportExporter');
const { renderPreview, createContactSheet } = require('./previewRenderer');
const { resolveRunConfig, usage } = require('./runConfig');

function readJson(filePath) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) throw new Error(`Required file not found: ${resolved}`);
  try {
    return JSON.parse(fs.readFileSync(resolved, 'utf8'));
  } catch (err) {
    throw new Error(`Could not parse JSON file ${resolved}: ${err.message}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log(usage());
    return;
  }
  const config = resolveRunConfig(args);
  if (config.deckMode) process.chdir(config.deckRoot);

  console.log('Headless Slide Builder');
  console.log('----------------------');
  if (config.deckMode) console.log(`Deck root: ${config.deckRoot}`);
  console.log(`Content: ${config.contentPath}`);
  console.log(`Theme: ${config.themePath}`);
  if (!config.validateOnly) console.log(`Output: ${config.outputPath}`);

  const content = readJson(config.contentPath);
  const theme = readJson(config.themePath);

  if (config.imageCatalogPath) {
    const mergedForCatalog = mergeTheme(theme);
    const catalog = buildImageCatalog(mergedForCatalog).map(({ absPath, tokens, ...rest }) => rest);
    fs.mkdirSync(path.dirname(path.resolve(config.imageCatalogPath)), { recursive: true });
    fs.writeFileSync(path.resolve(config.imageCatalogPath), JSON.stringify({ generatedAt: new Date().toISOString(), images: catalog }, null, 2));
    console.log(`Image catalog exported to ${path.resolve(config.imageCatalogPath)} (${catalog.length} images)`);
  }

  fs.mkdirSync(path.dirname(path.resolve(config.outputPath)), { recursive: true });
  const pptx = buildDeck(content, theme, {
    validateOnly: config.validateOnly,
    noDesign: config.noDesign,
    noDeckDesign: config.noDeckDesign,
    strictAssets: config.strictAssets,
    strictProvenance: config.strictProvenance,
    plannedContentPath: config.plannedContentPath
  });
  const plannedForOutputs = pptx?._slideBuilder?.plannedContent || null;
  const mergedForOutputs = pptx?._slideBuilder?.theme || mergeTheme(theme);

  if (config.notesPath && plannedForOutputs) {
    const notesWritten = exportSpeakerNotes(plannedForOutputs, config.notesPath);
    console.log(`Speaker notes exported to ${notesWritten}`);
  }

  if (!config.validateOnly) {
    const written = await writeDeck(pptx, config.outputPath);
    if (plannedForOutputs) {
      const outputDir = path.dirname(path.resolve(config.outputPath));
      const qualityPath = path.join(outputDir, 'quality_report.md');
      const qualityWritten = writeQualityReport(plannedForOutputs, mergedForOutputs, qualityPath, pptx._slideBuilder || {});
      console.log(`Quality report exported to ${qualityWritten}`);
      const reports = writeAdditionalReports(plannedForOutputs, mergedForOutputs, outputDir, pptx._slideBuilder || {});
      console.log(`Deck summary exported to ${reports.deckSummary}`);
      console.log(`References report exported to ${reports.references}`);
      console.log(`Visual self-review prompt exported to ${reports.visualReviewPrompt}`);
    }
    console.log(`\nSuccess: deck generated at ${written}`);
    if (config.previewDir) {
      const preview = renderPreview(written, config.previewDir);
      if (preview && config.contactSheetPath) {
        const contactSheet = createContactSheet(preview.outDir, config.contactSheetPath);
        console.log(`Contact sheet created at ${contactSheet}`);
      }
    }
  }
}

main().catch((err) => {
  console.error('\nBuild failed.');
  console.error(err.message);
  process.exit(1);
});
