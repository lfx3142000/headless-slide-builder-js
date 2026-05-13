Try AI directly in your favorite apps … Use Gemini to generate drafts and refine content, plus get Gemini Pro with access to Google's next-gen AI
const {
  SLIDE_W,
  SLIDE_H,
  M,
  getMargins,
  addSlideBackground,
  addFooter,
  addTitle,
  addEyebrow,
  addBody,
  addBullets,
  addCard,
  addCardHeader,
  addImageSafe,
  addCaption,
  addTag,
  addStat,
  addSpeakerNotes,
  addBrandMark,
  addIconBadge,
  applyStandardSlide,
  getTextStyle
} = require('./helpers');

function themeVariant(slideData, theme) {
  return slideData.variant || theme.style.layoutVariant || 'consulting';
}

function addTitleSlide(pptx, content, slideData, theme) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'hero', theme);
  const variant = themeVariant(slideData, theme);
  addSlideBackground(slide, theme, theme.colors.primary);

  if (slideData.image) {
    if (variant === 'full_bleed') {
      addImageSafe(slide, slideData.image, theme, { x: 0, y: 0, w: SLIDE_W, h: SLIDE_H }, { rounded: false, crop: true });
      slide.addShape('rect', { x: 0, y: 0, w: SLIDE_W, h: SLIDE_H, fill: { color: theme.colors.dark, transparency: 28 }, line: { transparency: 100 } });
      slide.addShape('rect', { x: 0, y: 0, w: 6.9, h: SLIDE_H, fill: { color: theme.colors.primary, transparency: 12 }, line: { transparency: 100 } });
    } else {
      addImageSafe(slide, slideData.image, theme, { x: 6.85, y: 0, w: 6.48, h: SLIDE_H }, { rounded: false, crop: true });
      slide.addShape('rect', { x: 6.45, y: 0, w: 6.9, h: SLIDE_H, fill: { color: theme.colors.dark, transparency: 58 }, line: { transparency: 100 } });
      slide.addShape('rect', { x: 0, y: 0, w: 7.25, h: SLIDE_H, fill: { color: theme.colors.primary }, line: { transparency: 100 } });
    }
  } else {
    slide.addShape('rect', { x: 0, y: 0, w: SLIDE_W, h: SLIDE_H, fill: { color: theme.colors.primary }, line: { transparency: 100 } });
  }

  slide.addShape('rect', { x: 0, y: 0, w: 0.16, h: SLIDE_H, fill: { color: theme.colors.accent }, line: { transparency: 100 } });
  slide.addShape('arc', { x: 4.72, y: -1.05, w: 4.0, h: 4.0, adjustPoint: 0.25, fill: { color: theme.colors.secondary, transparency: 76 }, line: { transparency: 100 } });
  slide.addShape('arc', { x: -1.18, y: 5.72, w: 2.85, h: 2.85, adjustPoint: 0.25, fill: { color: theme.colors.accent, transparency: 77 }, line: { transparency: 100 } });

  addEyebrow(slide, slideData.eyebrow || theme.themeName || 'Generated deck', theme, { x: 0.76, y: 0.82, color: theme.colors.accent, w: 4.9 });
  slide.addText(slideData.title || content.deckTitle || 'Untitled Deck', {
    x: 0.76, y: 1.42, w: 5.85, h: 1.78,
    fontFace: theme.fonts.heading, fontSize: style.title, bold: true,
    color: theme.colors.white, margin: 0, fit: 'shrink'
  });
  slide.addShape('rect', { x: 0.78, y: 3.34, w: 0.95, h: 0.055, fill: { color: theme.colors.accent }, line: { transparency: 100 } });
  slide.addText(slideData.subtitle || content.subtitle || '', {
    x: 0.78, y: 3.6, w: 5.55, h: 0.95,
    fontFace: theme.fonts.body, fontSize: style.subtitle,
    color: theme.colors.white, transparency: 6, margin: 0, fit: 'shrink'
  });
  const meta = [content.presenter, content.date].filter(Boolean).join('  •  ');
  if (meta) slide.addText(meta, { x: 0.78, y: 6.72, w: 5.4, h: 0.22, fontFace: theme.fonts.body, fontSize: 9.5, color: theme.colors.white, transparency: 18, margin: 0 });
  if (theme.brand?.showLogoOnTitle) addBrandMark(slide, theme, { placement: 'title', size: 1.1 });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addSectionSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'section', theme);
  const bg = theme.style.sectionStyle === 'light' ? theme.colors.light : theme.colors.dark;
  const text = theme.style.sectionStyle === 'light' ? theme.colors.dark : theme.colors.white;
  addSlideBackground(slide, theme, bg);
  slide.addShape('rect', { x: 0, y: 0, w: SLIDE_W, h: SLIDE_H, fill: { color: bg }, line: { transparency: 100 } });
  if (slideData.image) {
    addImageSafe(slide, slideData.image, theme, { x: 7.0, y: 0, w: 6.35, h: SLIDE_H }, { rounded: false, crop: true });
    slide.addShape('rect', { x: 6.65, y: 0, w: 6.7, h: SLIDE_H, fill: { color: bg, transparency: 50 }, line: { transparency: 100 } });
  }
  slide.addShape('rect', { x: 0, y: 0, w: 0.18, h: SLIDE_H, fill: { color: theme.colors.accent }, line: { transparency: 100 } });
  slide.addShape('arc', { x: 8.75, y: -1.78, w: 5.8, h: 5.8, adjustPoint: 0.25, fill: { color: theme.colors.primary, transparency: 35 }, line: { transparency: 100 } });
  slide.addShape('rect', { x: 0.74, y: 1.76, w: 1.15, h: 0.055, fill: { color: theme.colors.accent }, line: { transparency: 100 } });
  addEyebrow(slide, slideData.eyebrow || `Section ${slideNumber}`, theme, { x: 0.74, y: 2.12, color: theme.colors.accent, w: 7.5 });
  slide.addText(slideData.title || '', { x: 0.74, y: 2.56, w: 9.75, h: 1.22, fontFace: theme.fonts.heading, fontSize: style.title, bold: true, color: text, margin: 0, fit: 'shrink' });
  if (slideData.subtitle || slideData.body) addBody(slide, slideData.subtitle || slideData.body, theme, style, { x: 0.76, y: 4.08, w: 8.75, h: 0.72, color: text, fontSize: style.subtitle });
  addFooter(slide, theme, slideNumber);
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addContentSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title, theme, style, { eyebrow: slideData.eyebrow });
  const bullets = slideData.bullets || [];
  const hasBody = Boolean(slideData.body);
  const variant = slideData.variant || slideData.design?.layoutVariant || 'standard';
  const y = 1.54;

  if (variant === 'key_message' || variant === 'key_message_banner' || variant === 'split_insight') {
    addCard(slide, theme, { x: M.left, y, w: 4.25, h: 4.78, fill: theme.colors.primary, line: theme.colors.primary, lineTransparency: 100 });
    slide.addText(slideData.body || bullets[0] || 'Key message', { x: M.left + 0.42, y: y + 0.55, w: 3.35, h: 2.3, fontFace: theme.fonts.heading, fontSize: 23, bold: true, color: theme.colors.white, margin: 0, fit: 'shrink' });
    slide.addShape('rect', { x: M.left + 0.44, y: y + 3.18, w: 0.82, h: 0.06, fill: { color: theme.colors.accent }, line: { transparency: 100 } });
    if (bullets.length > 0) addBullets(slide, bullets, theme, style, { x: 5.45, y: y + 0.32, w: 6.8, h: 3.75, fontSize: style.bullet + 0.6 });
  } else if (variant === 'numbered_insights') {
    const n = Math.min(bullets.length, 5);
    addCard(slide, theme, { x: M.left, y, w: SLIDE_W - M.left - M.right, h: 4.82, fill: theme.colors.white, line: theme.colors.border });
    bullets.slice(0, 5).forEach((bullet, idx) => {
      const rowY = y + 0.45 + idx * (4.0 / Math.max(n,1));
      slide.addText(String(idx + 1).padStart(2, '0'), { x: M.left + 0.38, y: rowY, w: 0.55, h: 0.22, fontFace: theme.fonts.heading, fontSize: 12, bold: true, color: theme.colors.accent, margin: 0 });
      slide.addShape('line', { x: M.left + 1.08, y: rowY + 0.12, w: 0.58, h: 0, line: { color: theme.colors.border, width: 1 } });
      slide.addText(String(bullet), { x: M.left + 1.86, y: rowY - 0.04, w: 9.72, h: 0.42, fontFace: theme.fonts.body, fontSize: style.bullet + 0.6, color: theme.colors.dark, margin: 0, fit: 'shrink' });
    });
  } else if (variant === 'sidebar') {
    addCard(slide, theme, { x: M.left, y, w: 3.25, h: 4.82, fill: theme.colors.dark, line: theme.colors.dark, lineTransparency: 100 });
    slide.addText(slideData.body || slideData.sidebar || 'Key context', { x: M.left + 0.34, y: y + 0.45, w: 2.55, h: 2.6, fontFace: theme.fonts.heading, fontSize: 18, bold: true, color: theme.colors.white, margin: 0, fit: 'shrink' });
    slide.addShape('rect', { x: M.left + 0.34, y: y + 3.35, w: 0.7, h: 0.05, fill: { color: theme.colors.accent }, line: { transparency: 100 } });
    addCard(slide, theme, { x: 4.35, y, w: 8.15, h: 4.82, fill: theme.colors.white, line: theme.colors.border });
    addBullets(slide, bullets, theme, style, { x: 4.78, y: y + 0.52, w: 7.3, h: 3.72, fontSize: style.bullet });
  } else if (variant === 'cards' || variant === 'card_bullets' || (bullets.length > 0 && bullets.length <= 4 && !hasBody)) {
    const n = Math.min(bullets.length, 4);
    const gap = 0.28;
    const cardW = (SLIDE_W - M.left - M.right - gap * (n - 1)) / Math.max(n, 1);
    bullets.slice(0, 4).forEach((bullet, idx) => {
      const x = M.left + idx * (cardW + gap);
      addCard(slide, theme, { x, y, w: cardW, h: 4.74, fill: theme.colors.white, line: theme.colors.border });
      addIconBadge(slide, theme, slideData.icons?.[idx] || 'check', { x: x + 0.28, y: y + 0.32, w: 0.42, h: 0.42 }, { fill: idx % 2 ? theme.colors.secondary : theme.colors.primary, fontSize: 10 });
      slide.addShape('rect', { x: x + 0.28, y: y + 0.94, w: 0.58, h: 0.05, fill: { color: theme.colors.accent }, line: { transparency: 100 } });
      slide.addText(String(bullet), { x: x + 0.28, y: y + 1.25, w: cardW - 0.56, h: 2.75, fontFace: theme.fonts.body, fontSize: style.body, color: theme.colors.dark, margin: 0, fit: 'shrink', breakLine: false });
    });
  } else {
    const cardH = 4.82;
    addCard(slide, theme, { x: M.left, y, w: SLIDE_W - M.left - M.right, h: cardH, fill: theme.colors.white, line: theme.colors.border });
    slide.addShape('rect', { x: M.left + 0.34, y: y + 0.34, w: 0.7, h: 0.05, fill: { color: theme.colors.accent }, line: { transparency: 100 } });
    if (hasBody) addBody(slide, slideData.body, theme, style, { x: M.left + 0.42, y: y + 0.62, w: SLIDE_W - M.left - M.right - 0.84, h: 0.78, fontSize: style.body, color: theme.colors.dark });
    addBullets(slide, bullets, theme, style, { x: M.left + 0.55, y: hasBody ? y + 1.65 : y + 0.72, w: SLIDE_W - M.left - M.right - 1.1, h: hasBody ? 2.92 : 3.95 });
  }
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addTwoColumnSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title, theme, style, { eyebrow: slideData.eyebrow });
  const y = 1.58;
  const cardW = 5.72;
  const cardH = 4.76;
  const columns = [
    { x: M.left, title: slideData.leftTitle || 'Column 1', bullets: slideData.leftBullets || [], color: theme.colors.primary },
    { x: SLIDE_W - M.right - cardW, title: slideData.rightTitle || 'Column 2', bullets: slideData.rightBullets || [], color: theme.colors.secondary }
  ];
  columns.forEach((c) => {
    addCard(slide, theme, { x: c.x, y, w: cardW, h: cardH, fill: theme.colors.white, line: theme.colors.border });
    slide.addShape('rect', { x: c.x + 0.34, y: y + 0.38, w: 0.62, h: 0.055, fill: { color: c.color }, line: { transparency: 100 } });
    addCardHeader(slide, c.title, theme, { x: c.x + 0.34, y: y + 0.62, w: cardW - 0.68, h: 0.38 }, { color: c.color, fontSize: style.cardTitle });
    addBullets(slide, c.bullets, theme, style, { x: c.x + 0.43, y: y + 1.24, w: cardW - 0.86, h: 3.05 });
  });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addImageSideSlide(pptx, content, slideData, theme, slideNumber, imageSide = 'left') {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title, theme, style, { eyebrow: slideData.eyebrow });
  const imageBox = { x: imageSide === 'left' ? M.left : 7.16, y: 1.55, w: 5.48, h: 4.62 };
  const textBox = { x: imageSide === 'left' ? 6.68 : M.left, y: 1.62, w: 5.58, h: 4.42 };
  addImageSafe(slide, slideData.image, theme, imageBox, { placeholder: 'Image missing', padding: theme.style.imageTreatment === 'edge' ? 0 : 0.04, rounded: theme.style.imageTreatment !== 'edge', role: slideData.imageRole || (slideData.variant === 'magazine' ? 'supporting_visual' : undefined) });
  addCaption(slide, slideData.caption, theme, imageBox);
  addCard(slide, theme, { ...textBox, fill: theme.colors.white, line: theme.colors.border });
  slide.addShape('rect', { x: textBox.x + 0.35, y: textBox.y + 0.36, w: 0.72, h: 0.052, fill: { color: theme.colors.accent }, line: { transparency: 100 } });
  if (slideData.body) addBody(slide, slideData.body, theme, style, { x: textBox.x + 0.38, y: textBox.y + 0.66, w: textBox.w - 0.76, h: 1.1, fontSize: style.body, color: theme.colors.dark });
  addBullets(slide, slideData.bullets || [], theme, style, { x: textBox.x + 0.46, y: slideData.body ? textBox.y + 1.96 : textBox.y + 0.76, w: textBox.w - 0.92, h: slideData.body ? 2.12 : 3.2 });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addComparisonSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title, theme, style, { eyebrow: slideData.eyebrow });
  const y = 1.6;
  const cardW = 5.74;
  const cardH = 4.72;
  const gap = 0.45;
  const cards = [
    { x: M.left, title: slideData.leftTitle || 'Option A', bullets: slideData.leftBullets || [], color: theme.colors.primary },
    { x: M.left + cardW + gap, title: slideData.rightTitle || 'Option B', bullets: slideData.rightBullets || [], color: theme.colors.secondary }
  ];
  const variant = slideData.variant || slideData.design?.layoutVariant || 'two_cards';
  if (variant === 'recommendation_matrix' || variant === 'executive_tradeoff') {
    addCard(slide, theme, { x: M.left, y, w: 11.9, h: cardH, fill: theme.colors.white, line: theme.colors.border });
    cards.forEach((c, idx) => {
      const x = M.left + 0.45 + idx * 5.65;
      slide.addText(c.title, { x, y: y + 0.45, w: 4.95, h: 0.34, fontFace: theme.fonts.heading, fontSize: style.cardTitle + 1, bold: true, color: c.color, margin: 0, fit: 'shrink' });
      addBullets(slide, c.bullets, theme, style, { x: x + 0.08, y: y + 1.05, w: 4.85, h: 2.35 });
    });
    if (slideData.recommendation || slideData.decision) {
      slide.addShape('rect', { x: M.left, y: y + 3.78, w: 11.9, h: 0.92, fill: { color: theme.colors.primary, transparency: 8 }, line: { transparency: 100 } });
      slide.addText(slideData.recommendation || slideData.decision, { x: M.left + 0.45, y: y + 4.05, w: 11.0, h: 0.26, fontFace: theme.fonts.heading, fontSize: 13.2, bold: true, color: theme.colors.white, margin: 0, fit: 'shrink' });
    }
    addSpeakerNotes(slide, slideData.speakerNotes);
    return;
  }
  cards.forEach((c) => {
    addCard(slide, theme, { x: c.x, y, w: cardW, h: cardH, fill: theme.colors.white, line: theme.colors.border });
    slide.addShape('rect', { x: c.x, y, w: cardW, h: 0.18, fill: { color: c.color }, line: { transparency: 100 } });
    slide.addText(c.title, { x: c.x + 0.34, y: y + 0.58, w: cardW - 0.68, h: 0.36, fontFace: theme.fonts.heading, fontSize: style.cardTitle, bold: true, color: c.color, margin: 0, fit: 'shrink' });
    slide.addShape('line', { x: c.x + 0.32, y: y + 1.16, w: cardW - 0.64, h: 0, line: { color: theme.colors.border, width: 0.8 } });
    addBullets(slide, c.bullets, theme, style, { x: c.x + 0.45, y: y + 1.48, w: cardW - 0.9, h: 2.82 });
  });
  slide.addShape('ellipse', { x: 6.22, y: 3.36, w: 0.82, h: 0.82, fill: { color: theme.colors.accent }, line: { color: theme.colors.accent, transparency: 100 } });
  slide.addText(slideData.centerLabel || 'vs', { x: 6.22, y: 3.61, w: 0.82, h: 0.18, align: 'center', fontFace: theme.fonts.body, fontSize: 10, bold: true, color: theme.colors.white, margin: 0 });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addProcessSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  const steps = Array.isArray(slideData.steps) ? slideData.steps : [];
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title, theme, style, { eyebrow: slideData.eyebrow });
  const startX = M.left;
  const startY = 1.68;
  const cardW = SLIDE_W - M.left - M.right;
  const availableH = 4.75;
  const stepH = Math.min(0.88, availableH / Math.max(steps.length, 1) - 0.08);
  const gap = steps.length > 5 ? 0.1 : 0.16;
  steps.forEach((step, idx) => {
    const y = startY + idx * (stepH + gap);
    if (idx < steps.length - 1) slide.addShape('line', { x: startX + 0.31, y: y + 0.64, w: 0, h: stepH + gap - 0.28, line: { color: 'C8D3E0', width: 1.1 } });
    slide.addShape('ellipse', { x: startX, y: y + 0.06, w: 0.62, h: 0.62, fill: { color: theme.colors.primary }, line: { transparency: 100 } });
    slide.addText(String(idx + 1), { x: startX, y: y + 0.225, w: 0.62, h: 0.16, align: 'center', fontFace: theme.fonts.body, fontSize: 10, bold: true, color: theme.colors.white, margin: 0 });
    addCard(slide, theme, { x: startX + 0.88, y, w: cardW - 0.88, h: stepH, fill: theme.colors.white, line: theme.colors.border });
    slide.addText(String(step), { x: startX + 1.16, y: y + 0.2, w: cardW - 1.42, h: stepH - 0.22, fontFace: theme.fonts.body, fontSize: style.body, color: theme.colors.dark, margin: 0, fit: 'shrink', valign: 'mid' });
  });
  if (steps.length === 0) addBody(slide, 'No process steps provided.', theme, style, { x: M.left, y: 1.6, w: 11.5, h: 0.4, color: theme.colors.muted });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addQuoteSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'section', theme);
  addSlideBackground(slide, theme, theme.colors.primary);
  slide.addShape('rect', { x: 0, y: 0, w: SLIDE_W, h: SLIDE_H, fill: { color: theme.colors.primary }, line: { transparency: 100 } });
  if (slideData.image) {
    addImageSafe(slide, slideData.image, theme, { x: 7.32, y: 0, w: 6.03, h: SLIDE_H }, { rounded: false, crop: true });
    slide.addShape('rect', { x: 6.88, y: 0, w: 6.48, h: SLIDE_H, fill: { color: theme.colors.dark, transparency: 45 }, line: { transparency: 100 } });
  }
  slide.addText('“', { x: 0.78, y: 0.72, w: 1.0, h: 0.9, fontFace: 'Georgia', fontSize: 78, color: theme.colors.accent, margin: 0 });
  slide.addText(slideData.quote || '', { x: 1.32, y: 1.58, w: slideData.image ? 5.65 : 10.4, h: 2.75, fontFace: theme.fonts.heading, fontSize: Math.min(style.title, 32), bold: true, color: theme.colors.white, margin: 0, fit: 'shrink' });
  if (slideData.attribution) slide.addText(`— ${slideData.attribution}`, { x: 1.36, y: 4.62, w: 5.4, h: 0.28, fontFace: theme.fonts.body, fontSize: 14, color: theme.colors.white, transparency: 10, margin: 0 });
  addFooter(slide, theme, slideNumber);
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addClosingSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'section', theme);
  addSlideBackground(slide, theme, theme.colors.dark);
  slide.addShape('rect', { x: 0, y: 0, w: SLIDE_W, h: SLIDE_H, fill: { color: theme.colors.dark }, line: { transparency: 100 } });
  slide.addShape('arc', { x: 9.1, y: -1.35, w: 5.1, h: 5.1, adjustPoint: 0.25, fill: { color: theme.colors.primary, transparency: 35 }, line: { transparency: 100 } });
  slide.addShape('rect', { x: 0, y: 0, w: SLIDE_W, h: 0.12, fill: { color: theme.colors.accent }, line: { transparency: 100 } });
  slide.addText(slideData.title || 'Next Steps', { x: M.left, y: 0.85, w: 10.2, h: 0.82, fontFace: theme.fonts.heading, fontSize: style.title, bold: true, color: theme.colors.white, margin: 0, fit: 'shrink' });
  const bullets = slideData.bullets || [];
  const cardY = 2.08;
  const cardW = 2.9;
  const gap = 0.22;
  bullets.slice(0, 4).forEach((bullet, idx) => {
    const x = M.left + idx * (cardW + gap);
    addCard(slide, theme, { x, y: cardY, w: cardW, h: 2.25, fill: theme.colors.white, line: theme.colors.white, lineTransparency: 100 });
    slide.addText(String(idx + 1).padStart(2, '0'), { x: x + 0.24, y: cardY + 0.25, w: 0.6, h: 0.22, fontFace: theme.fonts.heading, fontSize: 10, bold: true, color: theme.colors.accent, margin: 0 });
    slide.addText(String(bullet), { x: x + 0.24, y: cardY + 0.72, w: cardW - 0.48, h: 1.12, fontFace: theme.fonts.body, fontSize: 14.2, color: theme.colors.dark, margin: 0, fit: 'shrink' });
  });
  if (bullets.length > 4) addBullets(slide, bullets.slice(4), theme, style, { x: M.left, y: 4.8, w: 11.2, h: 1.15, color: theme.colors.white });
  addFooter(slide, theme, slideNumber);
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addAgendaSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  const items = slideData.items || slideData.steps || slideData.bullets || [];
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Agenda', theme, style, { eyebrow: slideData.eyebrow });
  const y0 = 1.55;
  items.slice(0, 6).forEach((item, idx) => {
    const y = y0 + idx * 0.76;
    slide.addText(String(idx + 1).padStart(2, '0'), { x: M.left, y: y + 0.05, w: 0.5, h: 0.25, fontFace: theme.fonts.heading, fontSize: 11, bold: true, color: theme.colors.accent, margin: 0 });
    slide.addShape('line', { x: M.left + 0.72, y: y + 0.18, w: 0.72, h: 0, line: { color: theme.colors.border, width: 1 } });
    slide.addText(String(item), { x: M.left + 1.65, y, w: 9.9, h: 0.42, fontFace: theme.fonts.heading, fontSize: style.cardTitle, color: theme.colors.dark, bold: true, margin: 0, fit: 'shrink' });
  });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addExecutiveSummarySlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  const cards = slideData.cards || [];
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Executive Summary', theme, style, { eyebrow: slideData.eyebrow });
  if (slideData.body) addBody(slide, slideData.body, theme, style, { x: M.left, y: 1.35, w: 11.5, h: 0.45, fontSize: style.body, color: theme.colors.muted });
  const y = slideData.body ? 2.05 : 1.68;
  const gap = 0.28;
  const cardW = (SLIDE_W - M.left - M.right - gap * 2) / 3;
  cards.slice(0, 3).forEach((card, idx) => {
    const x = M.left + idx * (cardW + gap);
    addCard(slide, theme, { x, y, w: cardW, h: 3.8, fill: theme.colors.white, line: theme.colors.border });
    addTag(slide, card.kicker || `Point ${idx + 1}`, theme, { x: x + 0.28, y: y + 0.34, w: 1.28, h: 0.28 }, { color: idx === 1 ? theme.colors.secondary : theme.colors.primary });
    addCardHeader(slide, card.title, theme, { x: x + 0.28, y: y + 0.82, w: cardW - 0.56, h: 0.48 }, { color: theme.colors.dark, fontSize: style.cardTitle });
    slide.addText(String(card.body || ''), { x: x + 0.28, y: y + 1.48, w: cardW - 0.56, h: 1.5, fontFace: theme.fonts.body, fontSize: style.body - 0.6, color: theme.colors.dark, margin: 0, fit: 'shrink' });
    if (card.footer) slide.addText(String(card.footer), { x: x + 0.28, y: y + 3.18, w: cardW - 0.56, h: 0.24, fontFace: theme.fonts.body, fontSize: 8.6, color: theme.colors.muted, italic: true, margin: 0, fit: 'shrink' });
  });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addThreeCardsSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  const cards = slideData.cards || [];
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Three Key Ideas', theme, style, { eyebrow: slideData.eyebrow });
  const y = 1.62;
  const gap = 0.28;
  const cardW = (SLIDE_W - M.left - M.right - gap * 2) / 3;
  cards.slice(0, 3).forEach((card, idx) => {
    const x = M.left + idx * (cardW + gap);
    addCard(slide, theme, { x, y, w: cardW, h: 4.7, fill: theme.colors.white, line: theme.colors.border });
    slide.addShape('ellipse', { x: x + 0.28, y: y + 0.36, w: 0.54, h: 0.54, fill: { color: [theme.colors.primary, theme.colors.secondary, theme.colors.accent][idx] }, line: { transparency: 100 } });
    slide.addText(String(idx + 1), { x: x + 0.28, y: y + 0.51, w: 0.54, h: 0.16, align: 'center', fontFace: theme.fonts.body, fontSize: 9, bold: true, color: theme.colors.white, margin: 0 });
    addCardHeader(slide, card.title, theme, { x: x + 0.28, y: y + 1.15, w: cardW - 0.56, h: 0.46 }, { color: theme.colors.dark, fontSize: style.cardTitle });
    slide.addText(String(card.body || ''), { x: x + 0.28, y: y + 1.85, w: cardW - 0.56, h: 1.28, fontFace: theme.fonts.body, fontSize: style.body, color: theme.colors.dark, margin: 0, fit: 'shrink' });
    addBullets(slide, card.bullets || [], theme, style, { x: x + 0.34, y: y + 3.12, w: cardW - 0.68, h: 1.05, fontSize: Math.max(10.8, style.bullet - 1.8) });
  });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addCalloutSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Key Point', theme, style, { eyebrow: slideData.eyebrow });
  addCard(slide, theme, { x: 1.35, y: 1.65, w: 10.65, h: 3.95, fill: theme.colors.white, line: theme.colors.border });
  slide.addShape('rect', { x: 1.35, y: 1.65, w: 0.18, h: 3.95, fill: { color: theme.colors.accent }, line: { transparency: 100 } });
  slide.addText(slideData.callout || slideData.body || '', { x: 1.85, y: 2.05, w: 9.55, h: 1.2, fontFace: theme.fonts.heading, fontSize: Math.min(style.title, 28), bold: true, color: theme.colors.dark, margin: 0, fit: 'shrink' });
  addBullets(slide, slideData.bullets || [], theme, style, { x: 1.92, y: 3.55, w: 9.0, h: 1.15 });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addBigNumberSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Metric', theme, style, { eyebrow: slideData.eyebrow });
  addCard(slide, theme, { x: M.left, y: 1.68, w: 4.1, h: 4.35, fill: theme.colors.primary, line: theme.colors.primary });
  slide.addText(String(slideData.value || '0'), { x: M.left + 0.35, y: 2.3, w: 3.4, h: 0.88, fontFace: theme.fonts.heading, fontSize: 44, bold: true, color: theme.colors.white, align: 'center', margin: 0, fit: 'shrink' });
  slide.addText(String(slideData.label || ''), { x: M.left + 0.35, y: 3.38, w: 3.4, h: 0.5, fontFace: theme.fonts.body, fontSize: 14, color: theme.colors.white, align: 'center', margin: 0, fit: 'shrink' });
  slide.addShape('rect', { x: 5.2, y: 1.84, w: 0.08, h: 3.95, fill: { color: theme.colors.accent }, line: { transparency: 100 } });
  if (slideData.body) addBody(slide, slideData.body, theme, style, { x: 5.65, y: 1.9, w: 6.4, h: 0.9, fontSize: style.subtitle, color: theme.colors.dark });
  addBullets(slide, slideData.bullets || [], theme, style, { x: 5.72, y: slideData.body ? 3.15 : 2.1, w: 6.1, h: 2.4 });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addMetricGridSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  const metrics = slideData.metrics || [];
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Metrics', theme, style, { eyebrow: slideData.eyebrow });
  const y = 1.6;
  const gap = 0.25;
  const cols = Math.min(4, Math.max(1, metrics.length));
  const cardW = (SLIDE_W - M.left - M.right - gap * (cols - 1)) / cols;
  metrics.slice(0, 4).forEach((m, idx) => addStat(slide, theme, m, { x: M.left + idx * (cardW + gap), y, w: cardW, h: 2.0 }, { color: [theme.colors.primary, theme.colors.secondary, theme.colors.accent, theme.colors.dark][idx] }));
  if (slideData.bullets) addBullets(slide, slideData.bullets, theme, style, { x: M.left + 0.2, y: 4.08, w: 11.5, h: 1.55 });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addTimelineSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  const items = slideData.items || slideData.steps || [];
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Timeline', theme, style, { eyebrow: slideData.eyebrow });
  const n = Math.min(items.length, 5);
  const startX = M.left + 0.15;
  const y = 3.15;
  const endX = SLIDE_W - M.right - 0.15;
  slide.addShape('line', { x: startX, y, w: endX - startX, h: 0, line: { color: theme.colors.border, width: 2 } });
  items.slice(0, 5).forEach((item, idx) => {
    const x = n === 1 ? (startX + endX) / 2 : startX + idx * ((endX - startX) / (n - 1));
    slide.addShape('ellipse', { x: x - 0.23, y: y - 0.23, w: 0.46, h: 0.46, fill: { color: idx % 2 ? theme.colors.secondary : theme.colors.primary }, line: { color: theme.colors.white, width: 1 } });
    const above = idx % 2 === 0;
    const boxY = above ? 1.72 : 3.68;
    const boxH = 1.02;
    slide.addShape('line', { x, y: above ? y - 0.22 : y + 0.22, w: 0, h: above ? -0.38 : 0.38, line: { color: theme.colors.border, width: 1 } });
    const label = typeof item === 'object' ? item.label || item.date || `Step ${idx + 1}` : `Step ${idx + 1}`;
    const text = typeof item === 'object' ? item.title || item.body || '' : String(item);
    addTag(slide, label, theme, { x: x - 0.63, y: boxY, w: 1.26, h: 0.26 }, { color: idx % 2 ? theme.colors.secondary : theme.colors.primary });
    slide.addText(text, { x: x - 1.05, y: boxY + 0.4, w: 2.1, h: boxH, align: 'center', fontFace: theme.fonts.body, fontSize: 10.2, color: theme.colors.dark, margin: 0, fit: 'shrink' });
  });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addTableSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  const headers = slideData.headers || slideData.columns || [];
  const rows = slideData.rows || [];
  const fmt = slideData._tableFormat || {};
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Table', theme, style, { eyebrow: slideData.eyebrow });
  const x = M.left, y = 1.58, w = SLIDE_W - M.left - M.right;
  const colCount = Math.max(headers.length, Array.isArray(rows[0]) ? rows[0].length : Object.keys(rows[0] || {}).length, 1);
  const colW = w / colCount;
  const rowH = fmt.rowH || Math.min(0.55, 4.8 / Math.max(rows.length + 1, 1));
  const maxRows = fmt.maxVisibleRows || 8;
  const bodyFont = fmt.fontSize || 9.2;
  const headerFont = fmt.headerFontSize || 9.0;
  headers.slice(0, colCount).forEach((h, c) => {
    slide.addShape('rect', { x: x + c * colW, y, w: colW, h: rowH, fill: { color: theme.colors.primary }, line: { color: theme.colors.white, transparency: 70 } });
    slide.addText(String(h), { x: x + c * colW + 0.08, y: y + Math.max(0.08, rowH * 0.24), w: colW - 0.16, h: rowH - 0.12, fontFace: theme.fonts.body, fontSize: headerFont, bold: true, color: theme.colors.white, margin: 0, fit: 'shrink' });
  });
  rows.slice(0, maxRows).forEach((row, r) => {
    const fill = r % 2 === 0 ? theme.colors.white : theme.colors.surfaceAlt;
    const vals = Array.isArray(row) ? row : Object.values(row || {});
    for (let c = 0; c < colCount; c++) {
      slide.addShape('rect', { x: x + c * colW, y: y + rowH * (r + 1), w: colW, h: rowH, fill: { color: fill }, line: { color: theme.colors.border, transparency: 20 } });
      slide.addText(String(vals[c] ?? ''), { x: x + c * colW + 0.08, y: y + rowH * (r + 1) + Math.max(0.07, rowH * 0.19), w: colW - 0.16, h: rowH - 0.12, fontFace: theme.fonts.body, fontSize: c === 0 && fmt.emphasizeFirstColumn ? bodyFont + 0.2 : bodyFont, bold: c === 0 && fmt.emphasizeFirstColumn, color: theme.colors.dark, margin: 0, fit: 'shrink' });
    }
  });
  if (fmt.warning) slide.addText(fmt.warning, { x: M.left, y: 6.28, w: 11.8, h: 0.18, fontFace: theme.fonts.body, fontSize: 7.4, color: theme.colors.muted, margin: 0, fit: 'shrink' });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addFullBleedImageSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'section', theme);
  addSlideBackground(slide, theme, theme.colors.dark);
  addImageSafe(slide, slideData.image, theme, { x: 0, y: 0, w: SLIDE_W, h: SLIDE_H }, { rounded: false, crop: true, role: 'background', placeholder: 'Full-bleed image missing' });
  slide.addShape('rect', { x: 0, y: 0, w: SLIDE_W, h: SLIDE_H, fill: { color: theme.colors.dark, transparency: slideData.overlayTransparency ?? 36 }, line: { transparency: 100 } });
  addEyebrow(slide, slideData.eyebrow, theme, { x: 0.78, y: 1.12, color: theme.colors.accent, w: 6.5 });
  slide.addText(slideData.title || '', { x: 0.78, y: 1.55, w: 7.2, h: 1.2, fontFace: theme.fonts.heading, fontSize: style.title, bold: true, color: theme.colors.white, margin: 0, fit: 'shrink' });
  if (slideData.body) slide.addText(slideData.body, { x: 0.82, y: 3.1, w: 6.25, h: 0.8, fontFace: theme.fonts.body, fontSize: style.subtitle, color: theme.colors.white, margin: 0, fit: 'shrink' });
  addFooter(slide, theme, slideNumber);
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addImageGridSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  const images = slideData.images || [];
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Image Gallery', theme, style, { eyebrow: slideData.eyebrow });
  const boxW = 5.8, boxH = 2.08;
  const positions = [
    { x: M.left, y: 1.55 }, { x: 6.82, y: 1.55 },
    { x: M.left, y: 3.92 }, { x: 6.82, y: 3.92 }
  ];
  images.slice(0, 4).forEach((img, idx) => {
    const box = { ...positions[idx], w: boxW, h: boxH };
    addImageSafe(slide, typeof img === 'string' ? img : img.path, theme, box, { padding: 0.02 });
    addCaption(slide, typeof img === 'string' ? '' : img.caption, theme, box);
  });
  addSpeakerNotes(slide, slideData.speakerNotes);
}


function chartData(slideData) {
  return Array.isArray(slideData.data) ? slideData.data : [];
}

function addBarChartSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  const data = chartData(slideData).slice(0, 8);
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Bar Chart', theme, style, { eyebrow: slideData.eyebrow });
  const box = { x: M.left, y: 1.62, w: 8.05, h: 4.55 };
  const side = { x: 9.15, y: 1.62, w: 3.45, h: 4.55 };
  addCard(slide, theme, { ...box, fill: theme.colors.white, line: theme.colors.border });
  const max = Math.max(...data.map(d => Number(d.value || 0)), 1);
  const barGap = 0.12;
  const plot = { x: box.x + 0.55, y: box.y + 0.55, w: box.w - 1.05, h: box.h - 1.35 };
  data.forEach((d, idx) => {
    const barW = (plot.w - barGap * (data.length - 1)) / Math.max(data.length, 1);
    const h = plot.h * (Number(d.value || 0) / max);
    const x = plot.x + idx * (barW + barGap);
    const y = plot.y + plot.h - h;
    slide.addShape('rect', { x, y, w: barW, h, fill: { color: idx % 2 ? theme.colors.secondary : theme.colors.primary }, line: { transparency: 100 } });
    slide.addText(String(d.label || ''), { x: x - 0.08, y: box.y + box.h - 0.55, w: barW + 0.16, h: 0.24, align: 'center', fontFace: theme.fonts.body, fontSize: 7.2, color: theme.colors.muted, margin: 0, fit: 'shrink' });
    slide.addText(String(d.value || ''), { x: x - 0.08, y: y - 0.28, w: barW + 0.16, h: 0.2, align: 'center', fontFace: theme.fonts.body, fontSize: 7.6, bold: true, color: theme.colors.dark, margin: 0, fit: 'shrink' });
  });
  addCard(slide, theme, { ...side, fill: theme.colors.surfaceAlt, line: theme.colors.border });
  if (slideData.body) addBody(slide, slideData.body, theme, style, { x: side.x + 0.32, y: side.y + 0.35, w: side.w - 0.64, h: 1.0, fontSize: style.body });
  addBullets(slide, slideData.bullets || [], theme, style, { x: side.x + 0.4, y: side.y + 1.55, w: side.w - 0.75, h: 2.55, fontSize: 11.8 });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addLineChartSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  const data = chartData(slideData).slice(0, 9);
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Line Chart', theme, style, { eyebrow: slideData.eyebrow });
  const box = { x: M.left, y: 1.62, w: 11.9, h: 4.58 };
  addCard(slide, theme, { ...box, fill: theme.colors.white, line: theme.colors.border });
  const max = Math.max(...data.map(d => Number(d.value || 0)), 1);
  const min = Math.min(...data.map(d => Number(d.value || 0)), 0);
  const plot = { x: box.x + 0.68, y: box.y + 0.56, w: box.w - 1.18, h: box.h - 1.25 };
  for (let i = 0; i < 4; i++) slide.addShape('line', { x: plot.x, y: plot.y + i * plot.h / 3, w: plot.w, h: 0, line: { color: theme.colors.border, transparency: 25, width: 0.5 } });
  const pts = data.map((d, idx) => {
    const x = data.length === 1 ? plot.x + plot.w / 2 : plot.x + idx * (plot.w / (data.length - 1));
    const y = plot.y + plot.h - ((Number(d.value || 0) - min) / Math.max(max - min, 1)) * plot.h;
    return { x, y, label: d.label, value: d.value };
  });
  pts.forEach((pt, idx) => {
    if (idx > 0) slide.addShape('line', { x: pts[idx-1].x, y: pts[idx-1].y, w: pt.x - pts[idx-1].x, h: pt.y - pts[idx-1].y, line: { color: theme.colors.primary, width: 2.2 } });
    slide.addShape('ellipse', { x: pt.x - 0.07, y: pt.y - 0.07, w: 0.14, h: 0.14, fill: { color: theme.colors.accent }, line: { color: theme.colors.white, width: 0.6 } });
    slide.addText(String(pt.label || ''), { x: pt.x - 0.35, y: box.y + box.h - 0.5, w: 0.7, h: 0.2, align: 'center', fontFace: theme.fonts.body, fontSize: 7.4, color: theme.colors.muted, margin: 0, fit: 'shrink' });
  });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addRiskMatrixSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  const items = (slideData.items || []).slice(0, 12);
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Risk Matrix', theme, style, { eyebrow: slideData.eyebrow });
  const grid = { x: M.left + 0.45, y: 1.66, w: 4.95, h: 4.55 };
  const cell = grid.w / 5;
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      const score = (x + 1) * (5 - y);
      const color = score >= 16 ? theme.colors.danger : score >= 9 ? theme.colors.warning : theme.colors.success;
      slide.addShape('rect', { x: grid.x + x * cell, y: grid.y + y * (grid.h / 5), w: cell, h: grid.h / 5, fill: { color, transparency: score >= 16 ? 8 : 18 }, line: { color: theme.colors.white, transparency: 25 } });
    }
  }
  slide.addText('Likelihood →', { x: grid.x + 1.25, y: grid.y + grid.h + 0.18, w: 2.5, h: 0.2, align: 'center', fontFace: theme.fonts.body, fontSize: 8.5, color: theme.colors.muted, margin: 0 });
  slide.addText('Impact', { x: grid.x - 0.42, y: grid.y + 1.95, w: 0.32, h: 0.24, rotate: 270, align: 'center', fontFace: theme.fonts.body, fontSize: 8.5, color: theme.colors.muted, margin: 0 });
  items.forEach((item, idx) => {
    const l = Math.max(1, Math.min(5, Number(item.likelihood || item.x || 1)));
    const impact = Math.max(1, Math.min(5, Number(item.impact || item.y || 1)));
    const cx = grid.x + (l - 1) * cell + cell/2 - 0.13;
    const cy = grid.y + (5 - impact) * (grid.h/5) + (grid.h/10) - 0.13;
    slide.addShape('ellipse', { x: cx, y: cy, w: 0.26, h: 0.26, fill: { color: theme.colors.dark }, line: { color: theme.colors.white, width: 0.6 } });
    slide.addText(String(idx + 1), { x: cx, y: cy + 0.065, w: 0.26, h: 0.1, align: 'center', fontFace: theme.fonts.body, fontSize: 5.8, bold: true, color: theme.colors.white, margin: 0 });
  });
  const listX = 6.15;
  addCard(slide, theme, { x: listX, y: 1.66, w: 6.45, h: 4.55, fill: theme.colors.white, line: theme.colors.border });
  items.forEach((item, idx) => {
    const y = 1.95 + idx * 0.32;
    slide.addText(`${idx + 1}.`, { x: listX + 0.3, y, w: 0.28, h: 0.16, fontFace: theme.fonts.body, fontSize: 7.8, bold: true, color: theme.colors.primary, margin: 0 });
    slide.addText(String(item.name || item.title || ''), { x: listX + 0.62, y, w: 4.2, h: 0.18, fontFace: theme.fonts.body, fontSize: 8.4, color: theme.colors.dark, margin: 0, fit: 'shrink' });
    slide.addText(`L${item.likelihood || item.x || 1}/I${item.impact || item.y || 1}`, { x: listX + 5.05, y, w: 0.78, h: 0.16, align: 'right', fontFace: theme.fonts.body, fontSize: 7.5, color: theme.colors.muted, margin: 0 });
  });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addLearningObjectivesSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  const objectives = slideData.objectives || slideData.bullets || [];
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Learning Objectives', theme, style, { eyebrow: slideData.eyebrow || 'Training' });
  const y = 1.55;
  objectives.slice(0, 5).forEach((obj, idx) => {
    const rowY = y + idx * 0.86;
    addIconBadge(slide, theme, 'target', { x: M.left, y: rowY + 0.05, w: 0.48, h: 0.48 }, { fill: idx % 2 ? theme.colors.secondary : theme.colors.primary });
    addCard(slide, theme, { x: M.left + 0.72, y: rowY, w: 11.05, h: 0.62, fill: theme.colors.white, line: theme.colors.border });
    slide.addText(String(obj), { x: M.left + 1.0, y: rowY + 0.18, w: 10.4, h: 0.2, fontFace: theme.fonts.body, fontSize: style.body, color: theme.colors.dark, margin: 0, fit: 'shrink' });
  });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addKnowledgeCheckSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  const choices = slideData.choices || [];
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Knowledge Check', theme, style, { eyebrow: slideData.eyebrow || 'Check understanding' });
  addCard(slide, theme, { x: M.left, y: 1.48, w: 11.9, h: 1.15, fill: theme.colors.primary, line: theme.colors.primary, lineTransparency: 100 });
  slide.addText(slideData.question || slideData.body || '', { x: M.left + 0.38, y: 1.78, w: 11.1, h: 0.45, fontFace: theme.fonts.heading, fontSize: 18, bold: true, color: theme.colors.white, margin: 0, fit: 'shrink' });
  choices.slice(0, 4).forEach((choice, idx) => {
    const x = idx % 2 === 0 ? M.left : 6.78;
    const y = 2.95 + Math.floor(idx / 2) * 1.18;
    addCard(slide, theme, { x, y, w: 5.55, h: 0.86, fill: theme.colors.white, line: theme.colors.border });
    slide.addText(String.fromCharCode(65 + idx), { x: x + 0.24, y: y + 0.28, w: 0.32, h: 0.14, fontFace: theme.fonts.heading, fontSize: 10, bold: true, color: theme.colors.accent, margin: 0 });
    slide.addText(String(choice), { x: x + 0.72, y: y + 0.22, w: 4.55, h: 0.28, fontFace: theme.fonts.body, fontSize: 11.4, color: theme.colors.dark, margin: 0, fit: 'shrink' });
  });
  if (slideData.answer) addTag(slide, `Answer: ${slideData.answer}`, theme, { x: M.left, y: 5.6, w: 1.45, h: 0.3 }, { fill: theme.colors.surfaceAlt });
  addSpeakerNotes(slide, slideData.speakerNotes || slideData.explanation);
}

function addScenarioSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Scenario', theme, style, { eyebrow: slideData.eyebrow || 'Applied example' });
  addCard(slide, theme, { x: M.left, y: 1.55, w: 5.25, h: 4.65, fill: theme.colors.dark, line: theme.colors.dark, lineTransparency: 100 });
  addIconBadge(slide, theme, slideData.icon || 'question', { x: M.left + 0.38, y: 1.92, w: 0.55, h: 0.55 }, { fill: theme.colors.accent });
  slide.addText(slideData.scenario || slideData.body || '', { x: M.left + 0.42, y: 2.68, w: 4.32, h: 2.35, fontFace: theme.fonts.body, fontSize: 14.2, color: theme.colors.white, margin: 0, fit: 'shrink' });
  addCard(slide, theme, { x: 6.25, y: 1.55, w: 6.35, h: 4.65, fill: theme.colors.white, line: theme.colors.border });
  addCardHeader(slide, slideData.promptTitle || 'Discuss / Decide', theme, { x: 6.62, y: 1.95, w: 5.55, h: 0.32 }, { color: theme.colors.primary, fontSize: 16 });
  addBullets(slide, slideData.bullets || slideData.questions || [], theme, style, { x: 6.72, y: 2.58, w: 5.35, h: 2.65 });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addAnswerExplanationSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Answer Explanation', theme, style, { eyebrow: slideData.eyebrow || 'Review' });
  addCard(slide, theme, { x: M.left, y: 1.55, w: 3.2, h: 4.66, fill: theme.colors.success, line: theme.colors.success, lineTransparency: 100 });
  slide.addText(String(slideData.answer || 'Answer'), { x: M.left + 0.3, y: 2.35, w: 2.6, h: 0.78, align: 'center', fontFace: theme.fonts.heading, fontSize: 28, bold: true, color: theme.colors.white, margin: 0, fit: 'shrink' });
  slide.addText('Correct answer', { x: M.left + 0.3, y: 3.22, w: 2.6, h: 0.22, align: 'center', fontFace: theme.fonts.body, fontSize: 10, color: theme.colors.white, margin: 0 });
  addCard(slide, theme, { x: 4.4, y: 1.55, w: 8.2, h: 4.66, fill: theme.colors.white, line: theme.colors.border });
  if (slideData.explanation) addBody(slide, slideData.explanation, theme, style, { x: 4.78, y: 1.95, w: 7.42, h: 1.2, fontSize: style.body });
  addBullets(slide, slideData.bullets || [], theme, style, { x: 4.85, y: 3.32, w: 7.25, h: 1.9 });
  addSpeakerNotes(slide, slideData.speakerNotes);
}


function addModuleIntroSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'section', theme);
  addSlideBackground(slide, theme, theme.colors.primary);
  if (slideData.image) {
    addImageSafe(slide, slideData.image, theme, { x: 7.15, y: 0, w: 6.2, h: SLIDE_H }, { rounded: false, fit: 'cover' });
    slide.addShape('rect', { x: 6.75, y: 0, w: 6.6, h: SLIDE_H, fill: { color: theme.colors.dark, transparency: 45 }, line: { transparency: 100 } });
  }
  slide.addShape('rect', { x: 0, y: 0, w: 6.95, h: SLIDE_H, fill: { color: theme.colors.primary }, line: { transparency: 100 } });
  slide.addShape('rect', { x: 0, y: 0, w: 0.14, h: SLIDE_H, fill: { color: theme.colors.accent }, line: { transparency: 100 } });
  addEyebrow(slide, slideData.eyebrow || 'Module', theme, { x: 0.78, y: 0.92, color: theme.colors.accent, w: 4.8 });
  slide.addText(slideData.title || 'Module Introduction', { x: 0.78, y: 1.48, w: 5.45, h: 1.35, fontFace: theme.fonts.heading, fontSize: style.title, bold: true, color: theme.colors.white, margin: 0, fit: 'shrink' });
  if (slideData.subtitle || slideData.body) slide.addText(slideData.subtitle || slideData.body, { x: 0.82, y: 3.12, w: 5.45, h: 0.75, fontFace: theme.fonts.body, fontSize: 16, color: theme.colors.white, transparency: 8, margin: 0, fit: 'shrink' });
  const objectives = slideData.objectives || slideData.bullets || [];
  objectives.slice(0, 3).forEach((obj, idx) => {
    const y = 4.35 + idx * 0.48;
    slide.addShape('ellipse', { x: 0.82, y: y + 0.02, w: 0.18, h: 0.18, fill: { color: theme.colors.accent }, line: { transparency: 100 } });
    slide.addText(String(obj), { x: 1.12, y, w: 4.95, h: 0.24, fontFace: theme.fonts.body, fontSize: 10.8, color: theme.colors.white, margin: 0, fit: 'shrink' });
  });
  addFooter(slide, theme, slideNumber);
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addConceptExplanationSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Concept', theme, style, { eyebrow: slideData.eyebrow || 'Explain' });
  addCard(slide, theme, { x: M.left, y: 1.48, w: 4.0, h: 4.72, fill: theme.colors.primary, line: theme.colors.primary, lineTransparency: 100 });
  addIconBadge(slide, theme, slideData.icon || 'idea', { x: M.left + 0.36, y: 1.88, w: 0.58, h: 0.58 }, { fill: theme.colors.accent });
  slide.addText(slideData.keyMessage || slideData.body || '', { x: M.left + 0.38, y: 2.7, w: 3.22, h: 1.55, fontFace: theme.fonts.heading, fontSize: 20, bold: true, color: theme.colors.white, margin: 0, fit: 'shrink' });
  addCard(slide, theme, { x: 5.0, y: 1.48, w: 7.6, h: 4.72, fill: theme.colors.white, line: theme.colors.border });
  addBullets(slide, slideData.bullets || slideData.points || [], theme, style, { x: 5.43, y: 1.9, w: 6.7, h: 2.45 });
  if (slideData.example) {
    addTag(slide, 'Example', theme, { x: 5.44, y: 4.75, w: 0.94, h: 0.26 });
    slide.addText(String(slideData.example), { x: 6.52, y: 4.75, w: 5.55, h: 0.72, fontFace: theme.fonts.body, fontSize: 10.5, color: theme.colors.muted, margin: 0, fit: 'shrink' });
  }
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addProcedureWalkthroughSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  const steps = slideData.steps || [];
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Procedure Walkthrough', theme, style, { eyebrow: slideData.eyebrow || 'Workflow' });
  const startY = 1.55;
  const stepW = 2.25;
  const gap = 0.2;
  steps.slice(0, 5).forEach((step, idx) => {
    const x = M.left + idx * (stepW + gap);
    addCard(slide, theme, { x, y: startY, w: stepW, h: 4.72, fill: theme.colors.white, line: theme.colors.border });
    slide.addShape('ellipse', { x: x + 0.22, y: startY + 0.24, w: 0.42, h: 0.42, fill: { color: theme.colors.primary }, line: { transparency: 100 } });
    slide.addText(String(idx + 1), { x: x + 0.22, y: startY + 0.35, w: 0.42, h: 0.12, align: 'center', fontFace: theme.fonts.heading, fontSize: 8, bold: true, color: theme.colors.white, margin: 0 });
    const title = typeof step === 'object' ? step.title || step.name || '' : String(step);
    const body = typeof step === 'object' ? step.body || step.description || '' : '';
    slide.addText(title, { x: x + 0.22, y: startY + 0.95, w: stepW - 0.44, h: 0.58, fontFace: theme.fonts.heading, fontSize: 13, bold: true, color: theme.colors.primary, margin: 0, fit: 'shrink' });
    if (body) slide.addText(body, { x: x + 0.22, y: startY + 1.75, w: stepW - 0.44, h: 1.9, fontFace: theme.fonts.body, fontSize: 9.2, color: theme.colors.dark, margin: 0, fit: 'shrink' });
    if (idx < Math.min(steps.length, 5) - 1) slide.addShape('line', { x: x + stepW + 0.04, y: startY + 2.36, w: gap - 0.08, h: 0, line: { color: theme.colors.accent, width: 1.5, beginArrowType: 'none', endArrowType: 'triangle' } });
  });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addCommonMistakesSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  const mistakes = slideData.mistakes || slideData.cards || slideData.bullets || [];
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Common Mistakes', theme, style, { eyebrow: slideData.eyebrow || 'Avoid' });
  mistakes.slice(0, 4).forEach((m, idx) => {
    const x = idx % 2 === 0 ? M.left : 6.75;
    const y = 1.56 + Math.floor(idx / 2) * 2.28;
    addCard(slide, theme, { x, y, w: 5.78, h: 1.86, fill: theme.colors.white, line: theme.colors.border });
    addIconBadge(slide, theme, 'warning', { x: x + 0.27, y: y + 0.32, w: 0.46, h: 0.46 }, { fill: theme.colors.warning });
    const title = typeof m === 'object' ? m.title || m.mistake || '' : String(m);
    const fix = typeof m === 'object' ? m.fix || m.body || m.correction || '' : '';
    slide.addText(title, { x: x + 0.92, y: y + 0.28, w: 4.45, h: 0.32, fontFace: theme.fonts.heading, fontSize: 13.2, bold: true, color: theme.colors.dark, margin: 0, fit: 'shrink' });
    if (fix) slide.addText(fix, { x: x + 0.92, y: y + 0.78, w: 4.45, h: 0.66, fontFace: theme.fonts.body, fontSize: 10.2, color: theme.colors.muted, margin: 0, fit: 'shrink' });
  });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addSummaryChecklistSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  const items = slideData.items || slideData.bullets || [];
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Summary Checklist', theme, style, { eyebrow: slideData.eyebrow || 'Review' });
  addCard(slide, theme, { x: M.left, y: 1.5, w: 11.9, h: 4.75, fill: theme.colors.white, line: theme.colors.border });
  items.slice(0, 8).forEach((item, idx) => {
    const x = idx < 4 ? M.left + 0.48 : 6.75;
    const y = 1.92 + (idx % 4) * 0.92;
    slide.addShape('roundRect', { x, y: y + 0.02, w: 0.34, h: 0.34, rectRadius: 0.06, fill: { color: theme.colors.surfaceAlt }, line: { color: theme.colors.border } });
    slide.addText('✓', { x, y: y + 0.095, w: 0.34, h: 0.12, align: 'center', fontFace: theme.fonts.heading, fontSize: 7.6, bold: true, color: theme.colors.success, margin: 0 });
    slide.addText(String(item), { x: x + 0.55, y, w: 5.0, h: 0.44, fontFace: theme.fonts.body, fontSize: style.bullet, color: theme.colors.dark, margin: 0, fit: 'shrink' });
  });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addComplianceMatrixSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  const columns = slideData.columns || ['Requirement', 'Control', 'Owner', 'Evidence'];
  const rows = slideData.rows || [];
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'Compliance Matrix', theme, style, { eyebrow: slideData.eyebrow || 'Controls' });
  const table = { x: M.left, y: 1.5, w: 11.9, h: 4.75 };
  const colW = [3.15, 3.25, 1.65, 3.85];
  slide.addShape('rect', { x: table.x, y: table.y, w: table.w, h: 0.42, fill: { color: theme.colors.primary }, line: { transparency: 100 } });
  let x = table.x;
  columns.slice(0,4).forEach((c, idx) => {
    slide.addText(String(c).toUpperCase(), { x: x + 0.08, y: table.y + 0.13, w: colW[idx]-0.16, h: 0.11, fontFace: theme.fonts.body, fontSize: 7.2, bold: true, color: theme.colors.white, margin: 0, fit: 'shrink' });
    x += colW[idx];
  });
  const fmt = slideData._tableFormat || {};
  const rowH = fmt.rowH || Math.min(0.62, (table.h - 0.42) / Math.max(rows.length, 1));
  const maxRows = fmt.maxVisibleRows || 7;
  const fontSize = fmt.fontSize || 8.3;
  rows.slice(0, maxRows).forEach((r, ridx) => {
    const y = table.y + 0.42 + ridx * rowH;
    slide.addShape('rect', { x: table.x, y, w: table.w, h: rowH, fill: { color: ridx % 2 ? theme.colors.surfaceAlt : theme.colors.white }, line: { color: theme.colors.border, transparency: 15 } });
    let cx = table.x;
    const vals = Array.isArray(r) ? r : [r.requirement, r.control, r.owner, r.evidence];
    vals.slice(0,4).forEach((v, cidx) => {
      slide.addText(String(v || ''), { x: cx + 0.08, y: y + Math.max(0.08, rowH * 0.22), w: colW[cidx]-0.16, h: rowH-0.12, fontFace: theme.fonts.body, fontSize: cidx === 0 ? fontSize + 0.2 : fontSize, bold: cidx === 0, color: theme.colors.dark, margin: 0, fit: 'shrink' });
      cx += colW[cidx];
    });
  });
  if (fmt.warning) slide.addText(fmt.warning, { x: M.left, y: 6.28, w: 11.8, h: 0.18, fontFace: theme.fonts.body, fontSize: 7.4, color: theme.colors.muted, margin: 0, fit: 'shrink' });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

function addReferencesSlide(pptx, content, slideData, theme, slideNumber) {
  const slide = pptx.addSlide();
  const style = getTextStyle(slideData, 'standard', theme);
  const refs = slideData.references || content.references || [];
  applyStandardSlide(slide, theme, slideNumber);
  addTitle(slide, slideData.title || 'References', theme, style, { eyebrow: slideData.eyebrow || 'Sources' });
  addCard(slide, theme, { x: M.left, y: 1.42, w: 11.9, h: 4.88, fill: theme.colors.white, line: theme.colors.border });
  refs.slice(0, 10).forEach((ref, idx) => {
    const y = 1.78 + idx * 0.42;
    const label = typeof ref === 'string' ? ref : ref.label || ref.title || `Reference ${idx + 1}`;
    const detail = typeof ref === 'string' ? '' : [ref.source, ref.note, ref.slideNumber ? `Slide ${ref.slideNumber}` : ''].filter(Boolean).join(' - ');
    slide.addText(`${idx + 1}.`, { x: M.left + 0.35, y, w: 0.3, h: 0.14, fontFace: theme.fonts.body, fontSize: 7.8, bold: true, color: theme.colors.primary, margin: 0 });
    slide.addText(label, { x: M.left + 0.72, y, w: 4.1, h: 0.16, fontFace: theme.fonts.body, fontSize: 8.8, bold: true, color: theme.colors.dark, margin: 0, fit: 'shrink' });
    if (detail) slide.addText(detail, { x: M.left + 4.95, y, w: 6.85, h: 0.16, fontFace: theme.fonts.body, fontSize: 8.0, color: theme.colors.muted, margin: 0, fit: 'shrink' });
  });
  addSpeakerNotes(slide, slideData.speakerNotes);
}

const layouts = {
  module_intro: addModuleIntroSlide,
  concept_explanation: addConceptExplanationSlide,
  procedure_walkthrough: addProcedureWalkthroughSlide,
  common_mistakes: addCommonMistakesSlide,
  summary_checklist: addSummaryChecklistSlide,
  compliance_matrix: addComplianceMatrixSlide,
  references: addReferencesSlide,
  title: addTitleSlide,
  section: addSectionSlide,
  content: addContentSlide,
  two_column: addTwoColumnSlide,
  image_left: (pptx, content, slideData, theme, slideNumber) => addImageSideSlide(pptx, content, slideData, theme, slideNumber, 'left'),
  image_right: (pptx, content, slideData, theme, slideNumber) => addImageSideSlide(pptx, content, slideData, theme, slideNumber, 'right'),
  comparison: addComparisonSlide,
  process: addProcessSlide,
  quote: addQuoteSlide,
  closing: addClosingSlide,
  agenda: addAgendaSlide,
  executive_summary: addExecutiveSummarySlide,
  three_cards: addThreeCardsSlide,
  callout: addCalloutSlide,
  big_number: addBigNumberSlide,
  metric_grid: addMetricGridSlide,
  timeline: addTimelineSlide,
  table: addTableSlide,
  full_bleed_image: addFullBleedImageSlide,
  image_grid: addImageGridSlide,
  bar_chart: addBarChartSlide,
  line_chart: addLineChartSlide,
  risk_matrix: addRiskMatrixSlide,
  learning_objectives: addLearningObjectivesSlide,
  knowledge_check: addKnowledgeCheckSlide,
  scenario: addScenarioSlide,
  case_study: addScenarioSlide,
  answer_explanation: addAnswerExplanationSlide,
  answer_reveal: addAnswerExplanationSlide
};

module.exports = { layouts };
