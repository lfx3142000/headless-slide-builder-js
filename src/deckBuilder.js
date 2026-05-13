const path = require('path');
const pptxgen = require('pptxgenjs');
const { mergeTheme } = require('./theme');
const { layouts } = require('./layouts');
const { validateContent, validateTheme } = require('./validator');
const { applyDesignPlan } = require('./designPlanner');
const { applyDeckDesignPass } = require('./deckDesigner');
const { analyzeSlideFit } = require('./fitChecker');
const { resolveDeckImages, buildImageCatalog } = require('./imageCatalog');
const { applyDeckTypeIntelligence } = require('./deckTypes');
const { applyLayoutFallbacks } = require('./layoutFallbacks');
const { applyTableFormatting } = require('./tableFormatter');
const { ensureSlideIds } = require('./revisionTracker');

function logIssues(kind, issues) {
  if (!issues || issues.length === 0) return;
  console.log(`\n${kind}:`);
  issues.forEach((issue) => console.log(`- ${issue}`));
}

function buildDeck(content, rawTheme, options = {}) {
  const theme = mergeTheme(rawTheme);
  const imageCatalog = buildImageCatalog(theme);
  if (imageCatalog.length) console.log(`Images available: ${imageCatalog.length} scanned from asset folders`);
  const contentWithIds = ensureSlideIds(content);
  const deckTypedContent = applyDeckTypeIntelligence(contentWithIds, theme);
  const contentWithImages = resolveDeckImages(deckTypedContent, theme);
  const slidePlannedContent = applyDesignPlan(contentWithImages, theme, { design: !options.noDesign });
  const deckDesignedContent = applyDeckDesignPass(slidePlannedContent, theme, { deckDesign: !options.noDeckDesign, references: options.references !== false });
  const fallbackContent = applyLayoutFallbacks(deckDesignedContent, theme);
  const plannedContent = applyTableFormatting(fallbackContent, theme);
  const themeValidation = validateTheme(rawTheme);
  const contentValidation = validateContent(plannedContent);
  const fitWarnings = analyzeSlideFit(plannedContent);
  logIssues('Theme warnings', themeValidation.warnings);
  logIssues('Content warnings', contentValidation.warnings);
  logIssues('Fit warnings', fitWarnings);
  const errors = [...themeValidation.errors, ...contentValidation.errors];
  if (errors.length > 0) {
    logIssues('Errors', errors);
    throw new Error('Deck validation failed. Fix the errors above and rerun the builder.');
  }
  if (options.validateOnly) {
    console.log('Validation passed. No deck generated because --validate-only was used.');
    return null;
  }
  if (options.plannedContentPath) {
    const fs = require('fs');
    fs.mkdirSync(path.dirname(path.resolve(options.plannedContentPath)), { recursive: true });
    fs.writeFileSync(path.resolve(options.plannedContentPath), JSON.stringify(plannedContent, null, 2));
    console.log(`Planned content written to ${path.resolve(options.plannedContentPath)}`);
  }
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = plannedContent.presenter || 'Headless Slide Builder';
  pptx.company = 'Headless Slide Builder';
  pptx.subject = plannedContent.subtitle || '';
  pptx.title = plannedContent.deckTitle || 'Generated Deck';
  pptx.lang = 'en-US';
  pptx.theme = { headFontFace: theme.fonts.heading, bodyFontFace: theme.fonts.body, lang: 'en-US' };
  console.log(`Building deck: ${pptx.title}`);
  console.log(`Theme: ${theme.themeName}`);
  if (theme.designerIntent) console.log(`Designer intent: ${theme.designerIntent}`);
  console.log('Formatting: automatic clean typography, spacing, layout fitting, theme-driven design variants, deck-wide rhythm planning, fallback layouts, and table auto-formatting');
  if (plannedContent._deckDesignPlan?.enabled) console.log(`Deck design pass: ${plannedContent._deckDesignPlan.visualRhythm}; references: ${plannedContent._deckDesignPlan.referenceCount || 0}`);
  pptx._slideBuilder = { plannedContent, theme, fitWarnings, contentValidation, themeValidation };
  plannedContent.slides.forEach((slideData, index) => {
    const slideNumber = index + 1;
    const layoutFn = layouts[slideData.type];
    if (!layoutFn) throw new Error(`No layout function found for slide type: ${slideData.type}`);
    layoutFn(pptx, plannedContent, slideData, theme, slideNumber);
  });
  return pptx;
}

async function writeDeck(pptx, outputPath) {
  if (!pptx) return null;
  const resolved = path.resolve(outputPath);
  await pptx.writeFile({ fileName: resolved });
  return resolved;
}

module.exports = { buildDeck, writeDeck };
