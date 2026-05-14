const fs = require('fs');
const path = require('path');
const { scoreDeck } = require('./qualityReporter');

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
}

function stringifyRef(ref, idx) {
  if (typeof ref === 'string') return `${idx + 1}. ${ref}`;
  const label = ref.label || ref.title || ref.citation || `Reference ${idx + 1}`;
  const details = [ref.source, ref.url, ref.note,
    ref.usedOnSlides?.length ? `Slides ${ref.usedOnSlides.join(', ')}` : null,
    ref.slideNumber ? `Slide ${ref.slideNumber}` : null].filter(Boolean).join(' — ');
  return `${idx + 1}. ${label}${details ? ` — ${details}` : ''}`;
}

function writeReferencesReport(content, outputPath) {
  const refs = content.references || [];
  const lines = ['# References', '', `Deck: ${content.deckTitle || 'Untitled Deck'}`, ''];
  if (!refs.length) lines.push('No structured references were provided or collected.');
  refs.forEach((ref, idx) => lines.push(stringifyRef(ref, idx)));
  ensureDir(outputPath);
  fs.writeFileSync(path.resolve(outputPath), lines.join('\n'));
  return path.resolve(outputPath);
}

function writeDeckSummary(content, theme, outputPath, context = {}) {
  const slides = content.slides || [];
  const score = scoreDeck(content, context.fitWarnings || []);
  const lines = [
    '# Deck Summary', '',
    `Deck: ${content.deckTitle || 'Untitled Deck'}`,
    `Subtitle: ${content.subtitle || ''}`,
    `Audience / deck type: ${content.deckType || 'not specified'}`,
    `Theme: ${theme.themeName || 'Unnamed theme'}`,
    `Designer intent: ${theme.designerIntent || ''}`,
    `Slides: ${slides.length}`,
    `Quality score: ${score.score}/100`,
    '', '## Design System',
    `- Title mood: ${theme.designTokens?.titleSlideMood || 'default'}`,
    `- Image style: ${theme.designTokens?.imageStyle || 'default'}`,
    `- Card density: ${theme.designTokens?.cardDensity || 'default'}`,
    `- Table style: ${theme.designTokens?.tableStyle || 'default'}`,
    `- Brand logo: ${theme.brand?.logo || 'none'}`,
    '', '## Layout Sequence'
  ];
  slides.forEach((s, i) => lines.push(`- ${i + 1}. ${s.type}${s.variant ? ` / ${s.variant}` : ''} — ${s.title || s.id || ''}`);
  lines.push('', '## Recommended Review Items');
  if (!score.issues.length) lines.push('- No major automated review issues detected.');
  score.issues.forEach(issue => lines.push(`- ${issue}`));
  ensureDir(outputPath);
  fs.writeFileSync(path.resolve(outputPath), lines.join('\n'));
  return path.resolve(outputPath);
}

function generateVisualReviewPrompt(content, theme) {
  const slideLines = (content.slides || []).map((s, i) =>
    `${i + 1}. ${s.type}${s.variant ? `/${s.variant}` : ''}: ${s.title || '(untitled)'}`).join('\n');
  return `# Visual Self-Review Prompt\n\nUse this prompt after generating a deck preview/contact sheet. Review the slide images visually and propose edits to content JSON, theme JSON, or layout variants.\n\n## Guardrails\n\n- Do not change factual content unless the user explicitly asks.\n- Prefer design edits: layout variant, image role, image query, theme token, spacing, font scaling, or speaker notes.\n- Be specific about slide number and target JSON field.\n- Keep recommendations executable by an AI coding agent.\n\n## Deck Context\n\nDeck: ${content.deckTitle || 'Untitled Deck'}\nTheme: ${theme.themeName || 'Unnamed Theme'}\nDeck type: ${content.deckType || 'not specified'}\nDesign tokens: ${JSON.stringify(theme.designTokens || {}, null, 2)}\n\n## Slide List\n\n${slideLines}\n\n## Required Output\n\nReturn JSON only:\n\n{\n  \"overallAssessment\": \"\",\n  \"themeEdits\": [],\n  \"contentEdits\": [\n    {\n      \"slideNumber\": 1,\n      \"issue\": \"\",\n      \"editTarget\": \"content.json | theme.json | layout code\",\n      \"recommendedChange\": \"\",\n      \"reason\": \"\"\n    }\n  ],\n  \"priorityFixes\": []\n}\n`;
}

function writeVisualReviewPrompt(content, theme, outputPath) {
  ensureDir(outputPath);
  fs.writeFileSync(path.resolve(outputPath), generateVisualReviewPrompt(content, theme));
  return path.resolve(outputPath);
}

function writeAdditionalReports(content, theme, outputDir, context = {}) {
  const out = path.resolve(outputDir);
  return {
    deckSummary: writeDeckSummary(content, theme, path.join(out, 'deck_summary.md'), context),
    references: writeReferencesReport(content, path.join(out, 'references.md')),
    visualReviewPrompt: writeVisualReviewPrompt(content, theme, path.join(out, 'visual_self_review_prompt.md'))
  };
}

module.exports = { writeAdditionalReports, writeDeckSummary, writeReferencesReport, writeVisualReviewPrompt, generateVisualReviewPrompt };
