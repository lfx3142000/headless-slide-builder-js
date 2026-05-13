function cloneJson(value) { return JSON.parse(JSON.stringify(value || {})); }
function countSimilar(slides, type) { return slides.filter((slide) => slide.type === type).length; }
function normalizeRef(ref, index) {
  if (!ref) return null;
  if (typeof ref === 'string') return { label: ref, source: '', note: '', index: index + 1 };
  return {
    label: ref.label || ref.title || ref.citation || `Reference ${index + 1}`,
    source: ref.source || ref.publisher || ref.url || '',
    note: ref.note || ref.description || '',
    index: index + 1
  };
}
function collectReferences(content) {
  const refs = [];
  (content.references || []).forEach((ref, idx) => refs.push(normalizeRef(ref, idx)));
  (content.slides || []).forEach((slide, slideIdx) => {
    (slide.references || []).forEach((ref, idx) => {
      const normalized = normalizeRef(ref, refs.length + idx);
      if (normalized) refs.push({ ...normalized, slideNumber: slideIdx + 1 });
    });
  });
  const seen = new Set();
  return refs.filter((ref) => {
    if (!ref) return false;
    const key = `${ref.label}|${ref.source}|${ref.note}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function applyDeckDesignPass(content, theme, options = {}) {
  const planned = cloneJson(content);
  const slides = Array.isArray(planned.slides) ? planned.slides : [];
  const enabled = options.deckDesign !== false && theme.designIntelligence?.deckWide !== false;
  const refs = collectReferences(planned);
  planned._deckDesignPlan = {
    enabled,
    generatedBy: 'src/deckDesigner.js',
    note: 'Deck-wide planning only: visual rhythm, layout variety flags, reference collection, no factual rewriting.',
    slideCount: slides.length,
    referenceCount: refs.length,
    visualRhythm: theme.designIntelligence?.visualRhythm || 'alternate_text_visual_cards',
    dominantSlideTypes: Object.fromEntries([...new Set(slides.map((s) => s.type))].map((type) => [type, countSimilar(slides, type)])),
    recommendations: []
  };
  if (!enabled) return planned;
  let visualDebt = 0;
  let lastType = null;
  planned.slides = slides.map((slide, idx) => {
    const next = { ...slide, design: { ...(slide.design || {}) } };
    if (lastType && lastType === next.type && ['content', 'two_column', 'comparison'].includes(next.type)) {
      next.design.varietyHint = next.design.varietyHint || 'avoid_repeating_previous_layout';
      if (!next.variant && next.type === 'content') next.variant = idx % 2 === 0 ? 'cards' : 'sidebar';
    }
    if (next.image || next.images || next.type.includes('image')) visualDebt = Math.max(0, visualDebt - 1);
    else visualDebt += 1;
    if (visualDebt >= 3 && next.type === 'content' && Array.isArray(next.bullets) && next.bullets.length <= 4) {
      next.variant = next.variant || 'cards';
      next.design.visualIntervention = 'card_layout_to_restore_visual_rhythm';
      visualDebt = 1;
    }
    if (idx === 0 && next.type === 'title') next.variant = next.variant || theme.designIntelligence?.titleVariant || 'full_bleed';
    if (next.type === 'section' && !next.image) next.variant = next.variant || theme.designIntelligence?.sectionVariant || 'bold_band';
    if (next.type === 'closing') next.variant = next.variant || theme.designIntelligence?.closingVariant || 'next_step_cards';
    next.design.deckPosition = idx === 0 ? 'opening' : idx === slides.length - 1 ? 'closing' : 'body';
    next.design.deckVisualRhythm = planned._deckDesignPlan.visualRhythm;
    lastType = next.type;
    return next;
  });
  if (refs.length > 0 && options.references !== false) {
    planned.references = refs;
    const hasReferencesSlide = planned.slides.some((s) => s.type === 'references');
    if (!hasReferencesSlide) {
      planned.slides.push({
        type: 'references',
        title: 'References',
        eyebrow: 'Sources',
        references: refs,
        speakerNotes: 'Use this slide to acknowledge source material and technical references used in the deck.'
      });
      planned._deckDesignPlan.referenceSlideAdded = true;
    }
  }
  const repeatedContent = countSimilar(planned.slides, 'content');
  if (repeatedContent > Math.ceil(planned.slides.length / 2)) {
    planned._deckDesignPlan.recommendations.push('Many slides use content layout; consider cards, process, callout, image, table, or training-specific layouts.');
  }
  return planned;
}
module.exports = { applyDeckDesignPass, collectReferences };
