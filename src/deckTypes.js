function cloneJson(value) { return JSON.parse(JSON.stringify(value || {})); }

function inferDeckType(content) {
  if (content.deckType) return String(content.deckType).toLowerCase();
  const haystack = [content.deckTitle, content.subtitle, ...(content.slides || []).flatMap((s) => [s.title, s.eyebrow, s.body])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  if (/training|course|lesson|module|learning objective|knowledge check|quiz|practice/.test(haystack)) return 'training';
  if (/sop|procedure|walkthrough|work instruction/.test(haystack)) return 'sop_training';
  if (/regulatory|compliance|inspection|requirement|105 cmr|nrc|dot|iata/.test(haystack)) return 'regulatory_update';
  if (/executive|decision|recommendation|briefing|leadership/.test(haystack)) return 'executive_briefing';
  if (/business plan|market|pricing|revenue|customer/.test(haystack)) return 'business_plan';
  if (/status|milestone|roadmap|timeline|project/.test(haystack)) return 'project_status';
  return 'technical_explainer';
}

const DECK_TYPE_RULES = {
  training: {
    noteMode: 'training',
    preferredVariants: { content: 'cards', process: 'vertical_cards', section: 'bold_band' },
    encourages: ['learning_objectives', 'scenario', 'knowledge_check', 'summary_checklist'],
    guidance: 'Use objectives, examples, checks for understanding, and facilitator notes.'
  },
  sop_training: {
    noteMode: 'facilitator',
    preferredVariants: { content: 'sidebar', process: 'vertical_cards', table: 'procedure' },
    encourages: ['procedure_walkthrough', 'common_mistakes', 'summary_checklist'],
    guidance: 'Emphasize steps, responsibilities, evidence, common mistakes, and expected performance.'
  },
  regulatory_update: {
    noteMode: 'technical',
    preferredVariants: { content: 'sidebar', table: 'matrix', comparison: 'decision_matrix' },
    encourages: ['compliance_matrix', 'references', 'risk_matrix'],
    guidance: 'Keep requirements, controls, owners, evidence, and references clear.'
  },
  executive_briefing: {
    noteMode: 'executive',
    preferredVariants: { content: 'key_message', comparison: 'recommendation', closing: 'next_step_cards' },
    encourages: ['executive_summary', 'big_number', 'metric_grid'],
    guidance: 'Lead with the decision, implication, recommendation, and next action.'
  },
  business_plan: {
    noteMode: 'pitch',
    preferredVariants: { content: 'cards', comparison: 'two_cards', process: 'phased_roadmap' },
    encourages: ['executive_summary', 'metric_grid', 'timeline'],
    guidance: 'Highlight market, offer, execution path, economics, and risks.'
  },
  project_status: {
    noteMode: 'status',
    preferredVariants: { content: 'sidebar', process: 'horizontal_steps', table: 'status' },
    encourages: ['metric_grid', 'timeline', 'risk_matrix'],
    guidance: 'Show progress, blockers, risks, owners, and next milestones.'
  },
  technical_explainer: {
    noteMode: 'technical',
    preferredVariants: { content: 'sidebar', process: 'vertical_cards', comparison: 'two_cards' },
    encourages: ['concept_explanation', 'worked_example', 'references'],
    guidance: 'Use clear definitions, examples, diagrams, and technical references.'
  }
};

function applyDeckTypeIntelligence(content, theme) {
  const planned = cloneJson(content);
  const deckType = inferDeckType(planned);
  const rules = DECK_TYPE_RULES[deckType] || DECK_TYPE_RULES.technical_explainer;
  planned.deckType = deckType;
  planned._deckTypePlan = {
    deckType,
    noteMode: planned.speakerNotesMode || rules.noteMode,
    guidance: rules.guidance,
    encourages: rules.encourages,
    generatedBy: 'src/deckTypes.js',
    note: 'Deck type influences variants and quality guidance only. It does not rewrite factual content.'
  };
  planned.speakerNotesMode = planned.speakerNotesMode || rules.noteMode;
  planned.slides = (planned.slides || []).map((slide) => {
    const next = { ...slide, design: { ...(slide.design || {}) } };
    if (!next.variant && rules.preferredVariants[next.type]) next.design.deckTypeVariantHint = rules.preferredVariants[next.type];
    if (deckType === 'executive_briefing' && next.type === 'content' && Array.isArray(next.bullets) && next.bullets.length <= 3)
      next.variant = next.variant || 'key_message';
    if (deckType.includes('training') && next.type === 'content' && Array.isArray(next.bullets) && next.bullets.length <= 4 && !next.body)
      next.variant = next.variant || 'cards';
    if (deckType === 'regulatory_update' && next.type === 'table') next.variant = next.variant || 'matrix';
    return next;
  });
  return planned;
}

module.exports = {
  applyDeckTypeIntelligence,
  inferDeckType,
  DECK_TYPE_RULES
};
