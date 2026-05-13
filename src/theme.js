const DEFAULT_THEME = {
  themeName: 'Executive Clean',
  designerIntent: 'Clean executive consulting deck with strong hierarchy, whitespace, cards, and restrained accents.',
  colors: {
    primary: '1F4E79',
    secondary: '4F8FCF',
    accent: 'F2B366',
    dark: '172033',
    light: 'F6F8FB',
    muted: '667085',
    white: 'FFFFFF',
    surface: 'FFFFFF',
    surfaceAlt: 'EEF3F8',
    border: 'DDE6F0',
    success: '2E7D32',
    warning: 'C77700',
    danger: 'C0392B'
  },
  fonts: {
    heading: 'Aptos Display',
    body: 'Aptos',
    mono: 'Aptos Mono'
  },
  designTokens: {
    titleSlideMood: 'premium',
    cardDensity: 'airy',
    sectionDividerEnergy: 'bold',
    imageStyle: 'editorial',
    chartStyle: 'minimal',
    tableStyle: 'regulatory_clean',
    footerStyle: 'thin_rule',
    cornerStyle: 'soft',
    iconStyle: 'badge',
    visualReviewMode: 'contact_sheet'
  },
  brand: {
    logo: 'assets/brand/sample-logo.png',
    logoPlacement: 'footer_right',
    showLogoOnTitle: true,
    showLogoOnSection: false,
    footerLogo: true
  },
  referencesStyle: {
    autoCollect: true,
    showSlideSourceNote: true,
    sourceNotePrefix: 'Source'
  },
  speakerNotesModes: {
    brief: ['talkTrack'],
    training: ['talkTrack', 'facilitatorPrompt', 'expectedAnswer', 'transition'],
    narration: ['talkTrack', 'transition'],
    executive: ['talkTrack', 'decisionPoint', 'transition'],
    facilitator: ['talkTrack', 'facilitatorPrompt', 'expectedAnswer', 'transition']
  },
  imageRoles: {
    background: { fit: 'cover', overlay: true, overlayTransparency: 38, rounded: false },
    hero: { fit: 'cover', rounded: false },
    supporting_visual: { fit: 'cover', rounded: true },
    thumbnail: { fit: 'contain', rounded: true },
    diagram: { fit: 'contain', rounded: true },
    icon_like: { fit: 'contain', rounded: false },
    texture: { fit: 'cover', rounded: false, overlay: true, overlayTransparency: 55 }
  },
  style: {
    cornerRadius: 0.15,
    useFooter: true,
    footerText: 'Generated Deck',
    titleScale: 1,
    bodyScale: 1,
    cardShadow: true,
    accentBar: true,
    sectionStyle: 'bold',
    imageTreatment: 'rounded',
    layoutVariant: 'consulting'
  },
  spacing: {
    marginX: 0.72,
    marginTop: 0.52,
    marginBottom: 0.48,
    cardPadding: 0.34,
    gutter: 0.32
  },
  assets: {
    imageDirs: ['assets/images'],
    imageManifests: ['assets/images/images.json', 'assets/images/image-manifest.json'],
    autoMatch: true,
    imageMatchThreshold: 14,
    defaultFit: 'cover'
  },
  designIntelligence: {
    enabled: true,
    mode: 'safe',
    contentVariant: 'standard',
    comparisonVariant: 'two_cards',
    sectionVariant: 'bold',
    imageVariant: 'rounded',
    defaultVariant: 'standard'
  }
};

function normalizeHex(value, fallback) {
  if (typeof value !== 'string') return fallback;
  const clean = value.replace('#', '').trim();
  return /^[0-9A-Fa-f]{6}$/.test(clean) ? clean.toUpperCase() : fallback;
}

function mergeTheme(inputTheme = {}) {
  const theme = JSON.parse(JSON.stringify(DEFAULT_THEME));
  theme.themeName = inputTheme.themeName || theme.themeName;
  theme.designerIntent = inputTheme.designerIntent || theme.designerIntent;
  theme.colors = { ...theme.colors, ...(inputTheme.colors || {}) };
  Object.keys(theme.colors).forEach((key) => {
    theme.colors[key] = normalizeHex(theme.colors[key], DEFAULT_THEME.colors[key] || '000000');
  });
  theme.fonts = { ...theme.fonts, ...(inputTheme.fonts || {}) };
  theme.designTokens = { ...theme.designTokens, ...(inputTheme.designTokens || {}) };
  theme.brand = { ...theme.brand, ...(inputTheme.brand || {}) };
  theme.referencesStyle = { ...theme.referencesStyle, ...(inputTheme.referencesStyle || {}) };
  theme.speakerNotesModes = { ...theme.speakerNotesModes, ...(inputTheme.speakerNotesModes || {}) };
  theme.imageRoles = { ...theme.imageRoles, ...(inputTheme.imageRoles || {}) };
  theme.style = { ...theme.style, ...(inputTheme.style || {}) };
  theme.spacing = { ...theme.spacing, ...(inputTheme.spacing || {}) };
  theme.assets = { ...theme.assets, ...(inputTheme.assets || {}) };
  theme.designIntelligence = { ...theme.designIntelligence, ...(inputTheme.designIntelligence || {}) };
  return theme;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function countTextChars(items = []) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + String(item || '').length, 0);
}

function estimateTextScale(slideData = {}) {
  const bullets = slideData.bullets || slideData.steps || [];
  const left = slideData.leftBullets || [];
  const right = slideData.rightBullets || [];
  const cards = slideData.cards || slideData.metrics || [];
  const rows = slideData.rows || [];
  const totalItems = bullets.length + left.length + right.length + cards.length + rows.length;
  const totalChars = countTextChars(bullets) + countTextChars(left) + countTextChars(right) + countTextChars(cards.map((c) => `${c.title || ''} ${c.body || ''} ${(c.bullets || []).join(' ')}`)) + countTextChars(rows.map((r) => Array.isArray(r) ? r.join(' ') : String(r))) + String(slideData.body || '').length + String(slideData.subtitle || '').length;
  if (totalItems <= 3 && totalChars < 220) return 1.07;
  if (totalItems >= 10 || totalChars > 850) return 0.78;
  if (totalItems >= 8 || totalChars > 650) return 0.84;
  if (totalItems >= 6 || totalChars > 470) return 0.91;
  return 1.0;
}

function typography(slideData = {}, role = 'standard', theme = DEFAULT_THEME) {
  const scale = estimateTextScale(slideData) * (theme.style?.bodyScale || 1);
  const titleScale = theme.style?.titleScale || 1;
  const base = {
    title: role === 'hero' ? 44 : role === 'section' ? 39 : 29,
    subtitle: role === 'hero' ? 18 : 16,
    body: 15.3,
    bullet: 14.4,
    small: 8.5,
    eyebrow: 8.3,
    cardTitle: 15.8,
    metric: 34
  };
  return {
    title: clamp(Math.round(base.title * titleScale * scale), role === 'hero' ? 34 : 23, role === 'hero' ? 52 : 35),
    subtitle: clamp(Math.round(base.subtitle * scale), 12, 20),
    body: clamp(Number((base.body * scale).toFixed(1)), 11.8, 17.2),
    bullet: clamp(Number((base.bullet * scale).toFixed(1)), 11.4, 16.4),
    small: base.small,
    eyebrow: base.eyebrow,
    cardTitle: clamp(Number((base.cardTitle * scale).toFixed(1)), 12.6, 18.2),
    metric: clamp(Math.round(base.metric * titleScale), 28, 44),
    bulletGapPt: totalGapFor(slideData)
  };
}

function totalGapFor(slideData = {}) {
  const count = Math.max(
    (slideData.bullets || []).length,
    (slideData.steps || []).length,
    (slideData.leftBullets || []).length,
    (slideData.rightBullets || []).length,
    (slideData.cards || []).length,
    (slideData.metrics || []).length
  );
  if (count >= 8) return 2;
  if (count >= 6) return 4;
  if (count >= 4) return 6;
  return 8;
}

module.exports = { DEFAULT_THEME, mergeTheme, typography };
