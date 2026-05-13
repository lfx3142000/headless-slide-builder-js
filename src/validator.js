const fs = require('fs');
const path = require('path');

const VALID_SLIDE_TYPES = new Set([
  'module_intro',
  'concept_explanation',
  'procedure_walkthrough',
  'common_mistakes',
  'summary_checklist',
  'compliance_matrix',
  'references',
  'answer_reveal',
  'title',
  'section',
  'content',
  'two_column',
  'image_left',
  'image_right',
  'comparison',
  'process',
  'quote',
  'closing',
  'agenda',
  'executive_summary',
  'three_cards',
  'callout',
  'big_number',
  'metric_grid',
  'timeline',
  'table',
  'full_bleed_image',
  'image_grid',
  'bar_chart',
  'line_chart',
  'risk_matrix',
  'learning_objectives',
  'knowledge_check',
  'scenario',
  'case_study',
  'answer_explanation'
]);

function getImagePathCandidate(imageRef) {
  if (!imageRef) return null;
  if (typeof imageRef === 'string') return imageRef;
  if (typeof imageRef === 'object') return imageRef.path || imageRef.file || imageRef.src || null;
  return null;
}

function looksLikeExplicitPath(value) {
  return typeof value === 'string' && /\.(png|jpe?g|webp|gif)$/i.test(value);
}

function pathExistsMaybe(relPath) {
  if (!relPath || !looksLikeExplicitPath(relPath)) return true;
  const abs = path.isAbsolute(relPath) ? relPath : path.resolve(process.cwd(), relPath);
  return fs.existsSync(abs);
}

function validateContent(content) {
  const errors = [];
  const warnings = [];

  if (!content || typeof content !== 'object') {
    errors.push('content.json must contain a JSON object.');
    return { errors, warnings };
  }

  if (!Array.isArray(content.slides)) {
    errors.push('content.json must include a slides array.');
    return { errors, warnings };
  }

  if (content.density) warnings.push('The density option has been removed and will be ignored. Use content plus theme design settings instead.');

  content.slides.forEach((slide, idx) => {
    const label = `Slide ${idx + 1}`;

    if (!slide || typeof slide !== 'object') {
      errors.push(`${label} must be an object.`);
      return;
    }

    if (!slide.type) {
      errors.push(`${label} is missing required field: type.`);
    } else if (!VALID_SLIDE_TYPES.has(slide.type)) {
      errors.push(`${label} has unknown type "${slide.type}". Valid types: ${Array.from(VALID_SLIDE_TYPES).join(', ')}.`);
    }

    if (slide.density) warnings.push(`${label} includes density, but density has been removed and will be ignored.`);
    if (slide.variant && typeof slide.variant !== 'string') warnings.push(`${label} variant should be a string if used.`);

    if (!slide.title && ['content', 'two_column', 'comparison', 'process', 'image_left', 'image_right', 'closing', 'agenda', 'executive_summary', 'three_cards', 'callout', 'big_number', 'metric_grid', 'timeline', 'table', 'image_grid', 'bar_chart', 'line_chart', 'risk_matrix', 'learning_objectives', 'knowledge_check', 'scenario', 'case_study', 'answer_explanation', 'answer_reveal', 'module_intro', 'concept_explanation', 'procedure_walkthrough', 'common_mistakes', 'summary_checklist', 'compliance_matrix', 'references'].includes(slide.type)) {
      warnings.push(`${label} does not have a title.`);
    }

    if (Array.isArray(slide.bullets) && slide.bullets.length > 8) warnings.push(`${label} has many bullets. The builder will shrink text to fit, but consider using speakerNotes.`);

    if (Array.isArray(slide.cards) && slide.cards.length > 3 && ['executive_summary', 'three_cards'].includes(slide.type)) warnings.push(`${label} has more cards than the layout displays. Extra cards will be ignored.`);

    if (Array.isArray(slide.metrics) && slide.metrics.length > 4) warnings.push(`${label} has more metrics than the layout displays. Extra metrics will be ignored.`);

    if (Array.isArray(slide.images) && slide.images.length > 4) warnings.push(`${label} has more images than the image_grid layout displays. Extra images will be ignored.`);

    if ((slide.type === 'bar_chart' || slide.type === 'line_chart') && Array.isArray(slide.data) && slide.data.length > 8) warnings.push(`${label} has more chart data points than the current layout is optimized for.`);

    if (slide.type === 'risk_matrix' && Array.isArray(slide.items) && slide.items.length > 12) warnings.push(`${label} has more risk items than the current layout is optimized for.`);

    const imagePathCandidate = getImagePathCandidate(slide.image);
    if (imagePathCandidate && !pathExistsMaybe(imagePathCandidate)) warnings.push(`${label} image path not found: ${imagePathCandidate}. A placeholder will be rendered.`);

    if (Array.isArray(slide.images)) {
      slide.images.forEach((img, i) => {
        const imgPath = getImagePathCandidate(img);
        if (imgPath && !pathExistsMaybe(imgPath)) warnings.push(`${label} image ${i + 1} path not found: ${imgPath}. A placeholder will be rendered.`);
      });
    }
  });

  return { errors, warnings };
}

function validateTheme(theme) {
  const errors = [];
  const warnings = [];

  if (!theme || typeof theme !== 'object') {
    errors.push('theme.json must contain a JSON object.');
    return { errors, warnings };
  }

  if (theme.style && theme.style.defaultDensity) warnings.push('theme.style.defaultDensity has been removed and will be ignored.');

  if (theme.colors) {
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (typeof value !== 'string' || !/^#?[0-9A-Fa-f]{6}$/.test(value.trim())) warnings.push(`theme.colors.${key} should be a 6-character hex color.`);
    });
  }

  return { errors, warnings };
}

module.exports = {
  VALID_SLIDE_TYPES,
  validateContent,
  validateTheme
};
