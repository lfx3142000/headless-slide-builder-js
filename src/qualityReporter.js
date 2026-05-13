const fs = require('fs');
const path = require('path');
const { analyzeSlideFit } = require('./fitChecker');

function countBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item) || 'unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function scoreDeck(content, fitWarnings = []) {
  const slides = content.slides || [];
  let score = 100;
  const issues = [];
  const layoutCounts = countBy(slides, (s) => s.type);
  const dominant = Object.entries(layoutCounts).sort((a,b)=>b[1]-a[1])[0];
  const slidesWithoutNotes = slides.filter((s) => !s.speakerNotes || (Array.isArray(s.speakerNotes) && s.speakerNotes.length === 0)).length;
  const imageIssues = slides.filter((s) => (s.type || '').includes('image') && !s.image && !s.images).length;
  const noClosing = !slides.some((s) => ['closing', 'summary_checklist'].includes(s.type));
  const noSection = slides.length > 6 && !slides.some((s) => s.type === 'section' || s.type === 'module_intro');

  if (fitWarnings.length) { score -= Math.min(20, fitWarnings.length * 3); issues.push(...fitWarnings); }
  if (dominant && dominant[1] > Math.ceil(slides.length * 0.45)) { score -= 8; issues.push(`Layout repetition: ${dominant[1]} of ${slides.length} slides use '${dominant[0]}'.`); }
  if (slidesWithoutNotes > Math.ceil(slides.length * 0.5)) { score -= 7; issues.push(`${slidesWithoutNotes} slides are missing speaker notes.`); }
  if (imageIssues) { score -= imageIssues * 3; issues.push(`${imageIssues} image-layout slides are missing image assets.`); }
  if (noClosing) { score -= 5; issues.push('Deck does not include a closing or summary checklist slide.'); }
  if (noSection) { score -= 4; issues.push('Deck is longer than 6 slides but has no section/module divider.'); }
  if (content._layoutFallbacks?.count) { score -= Math.min(6, content._layoutFallbacks.count * 2); }
  score = Math.max(0, Math.min(100, Math.round(score)));
  return { score, issues, layoutCounts, slidesWithoutNotes, imageIssues };
}

function generateQualityReport(content, theme, context = {}) {
  const fitWarnings = context.fitWarnings || analyzeSlideFit(content);
  const scoring = scoreDeck(content, fitWarnings);
  const lines = [];
  lines.push(`# Slide Builder Quality Report`);
  lines.push('');
  lines.push(`Deck: ${content.deckTitle || 'Untitled Deck'}`);
  lines.push(`Theme: ${theme.themeName || 'Unnamed Theme'}`);
  lines.push(`Deck type: ${content.deckType || 'not specified'}`);
  lines.push(`Slides: ${(content.slides || []).length}`);
  lines.push(`Quality score: ${scoring.score}/100`);
  lines.push(`Design tokens: ${JSON.stringify(theme.designTokens || {})}`);
  lines.push('');
  lines.push(`## Layout Mix`);
  Object.entries(scoring.layoutCounts).forEach(([type, count]) => lines.push(`- ${type}: ${count}`));
  lines.push('');
  lines.push(`## Checks`);
  lines.push(`- Slides missing speaker notes: ${scoring.slidesWithoutNotes}`);
  lines.push(`- Image layout slides missing assets: ${scoring.imageIssues}`);
  lines.push(`- Layout fallback events: ${content._layoutFallbacks?.count || 0}`);
  lines.push(`- Table formatting entries: ${content._tableFormatting?.tables?.length || 0}`);
  lines.push('');
  if (content._deckTypePlan) {
    lines.push(`## Deck-Type Guidance`);
    lines.push(content._deckTypePlan.guidance || '');
    if (content._deckTypePlan.encourages?.length) lines.push(`Encouraged slide types: ${content._deckTypePlan.encourages.join(', ')}`);
    lines.push('');
  }
  if (content._layoutFallbacks?.events?.length) {
    lines.push(`## Layout Fallbacks Applied`);
    content._layoutFallbacks.events.forEach((e) => lines.push(`- ${e}`));
    lines.push('');
  }
  if (content._tableFormatting?.tables?.length) {
    lines.push(`## Table Auto-Formatting`);
    content._tableFormatting.tables.forEach((t) => lines.push(`- Slide ${t.slideNumber}: ${t.rowCount} rows, ${t.colCount} columns, font ${t.fontSize}pt${t.warning ? ` — ${t.warning}` : ''}`));
    lines.push('');
  }
  lines.push(`## Visual Self-Review Workflow`);
  lines.push('- Open the generated contact sheet or slide PNGs.');
  lines.push('- Use `output/visual_self_review_prompt.md` to ask an AI to recommend JSON/theme/layout edits.');
  lines.push('- Prefer edits to layout variants, image roles, theme tokens, and speaker notes before changing factual content.');
  lines.push('');
  lines.push(`## Issues and Recommendations`);
  if (!scoring.issues.length) lines.push('- No major issues detected.');
  scoring.issues.forEach((issue) => lines.push(`- ${issue}`));
  lines.push('');
  lines.push(`## Slide IDs`);
  (content.slides || []).forEach((s, i) => lines.push(`- ${i + 1}. ${s.id || '(no id)'} — ${s.title || s.type}`));
  lines.push('');
  return lines.join('\n');
}

function writeQualityReport(content, theme, outputPath, context = {}) {
  const resolved = path.resolve(outputPath);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(resolved, generateQualityReport(content, theme, context));
  return resolved;
}

module.exports = { generateQualityReport, writeQualityReport, scoreDeck };
