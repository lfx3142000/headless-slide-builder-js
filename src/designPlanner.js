function cloneJson(value) { return JSON.parse(JSON.stringify(value || {})); }
function count(items) { return Array.isArray(items) ? items.length : 0; }
function textLen(value) {
  if (!value) return 0;
  if (Array.isArray(value)) return value.map(textLen).reduce((a,b)=>a+b,0);
  if (typeof value === 'object') return Object.values(value).map(textLen).reduce((a,b)=>a+b,0);
  return String(value).length;
}
function chooseVariant(slide, theme) {
  if (slide.variant) return slide.variant;
  if (slide.design && slide.design.layoutVariant) return slide.design.layoutVariant;
  const defaults = theme.designIntelligence || {};
  const tokens = theme.designTokens || {};
  const bullets = count(slide.bullets);
  const chars = textLen([slide.title, slide.body, slide.bullets, slide.cards, slide.metrics, slide.rows]);
  switch (slide.type) {
    case 'content':
      if (slide.numbered || slide.ordered) return 'numbered_insights';
      if (slide.keyMessage || slide.callout) return 'key_message_banner';
      if (tokens.cardDensity === 'airy' && bullets > 0 && bullets <= 4 && !slide.body) return 'card_bullets';
      if (bullets > 0 && bullets <= 4 && !slide.body) return 'cards';
      if (slide.body && bullets <= 3 && chars < 500) return 'key_message';
      if (bullets >= 6) return 'sidebar';
      return defaults.contentVariant || 'standard';
    case 'comparison':
      if (slide.recommendation || slide.decision) return 'recommendation_matrix';
      if (count(slide.leftBullets) <= 3 && count(slide.rightBullets) <= 3) return 'executive_tradeoff';
      return defaults.comparisonVariant || 'standard';
    case 'section':
      if (slide.image) return 'full_bleed_section';
      return defaults.sectionVariant || theme.style?.sectionStyle || 'bold';
    case 'image_left':
    case 'image_right':
      if (tokens.imageStyle === 'editorial') return 'magazine';
      return defaults.imageVariant || theme.style?.imageTreatment || 'rounded';
    case 'process':
      if (count(slide.steps) <= 5) return 'vertical_cards';
      return 'compact_steps';
    case 'title':
      return tokens.titleSlideMood === 'minimal' ? 'minimalist_cover' : 'executive_cover';
    case 'closing':
      return 'executive_next_steps';
    default:
      return defaults.defaultVariant || slide.variant || 'standard';
  }
}
function applyDesignPlan(content, theme, options = {}) {
  const planned = cloneJson(content);
  const intelligence = theme.designIntelligence || {};
  const enabled = options.design !== false && intelligence.enabled !== false;
  planned._designProcessing = {
    enabled,
    mode: intelligence.mode || 'safe',
    generatedBy: 'src/designPlanner.js',
    note: 'Deterministic planning only: no content rewriting, no slide splitting, no external AI calls.'
  };
  if (!enabled || !Array.isArray(planned.slides)) return planned;
  planned.slides = planned.slides.map((slide, idx) => {
    const next = { ...slide };
    next.design = { ...(slide.design || {}) };
    if (!next.variant && !next.design.layoutVariant) {
      const variant = chooseVariant(next, theme);
      if (variant) next.variant = variant;
    } else if (!next.variant && next.design.layoutVariant) {
      next.variant = next.design.layoutVariant;
    }
    const bullets = count(next.bullets);
    const chars = textLen([next.title, next.body, next.bullets, next.cards, next.rows]);
    next.design.visualWeight = next.design.visualWeight || (next.image || next.images ? 'visual' : bullets <= 3 && chars < 350 ? 'high' : 'balanced');
    next.design.fitStrategy = next.design.fitStrategy || (chars > 750 || bullets > 7 ? 'shrink_and_warn' : 'standard');
    next.design.slideIndex = idx + 1;
    return next;
  });
  return planned;
}
module.exports = { applyDesignPlan };
