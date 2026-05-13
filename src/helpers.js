const fs = require('fs');
const path = require('path');
const { imageSize } = require('image-size');
const { typography } = require('./theme');

const SLIDE_W = 13.333;
const SLIDE_H = 7.5;
const M = { left: 0.72, right: 0.72, top: 0.52, bottom: 0.48 };

function getMargins(theme = {}) {
  const spacing = theme.spacing || {};
  return {
    left: Number(spacing.marginX || M.left),
    right: Number(spacing.marginX || M.right),
    top: Number(spacing.marginTop || M.top),
    bottom: Number(spacing.marginBottom || M.bottom)
  };
}

function opacity(transparency = 0) { return Math.max(0, Math.min(100, transparency)); }

function resolvePath(filePath) {
  if (!filePath) return null;
  if (path.isAbsolute(filePath)) return filePath;
  return path.resolve(process.cwd(), filePath);
}

function addSlideBackground(slide, theme, color) {
  slide.background = { color: color || theme.colors.light };
}

function addTopAccent(slide, theme, color = theme.colors.primary) {
  slide.addShape('rect', { x: 0, y: 0, w: SLIDE_W, h: 0.075, fill: { color }, line: { color, transparency: 100 } });
}

function addSoftBackdrop(slide, theme) {
  slide.addShape('arc', { x: 10.85, y: -1.0, w: 3.2, h: 3.2, adjustPoint: 0.25, fill: { color: theme.colors.secondary, transparency: 90 }, line: { color: theme.colors.secondary, transparency: 100 } });
  slide.addShape('arc', { x: -1.15, y: 5.9, w: 2.35, h: 2.35, adjustPoint: 0.25, fill: { color: theme.colors.accent, transparency: 91 }, line: { color: theme.colors.accent, transparency: 100 } });
}

function addBrandMark(slide, theme, opts = {}) {
  const brand = theme.brand || {};
  if (brand.enabled === false) return;
  const logo = brand.logo;
  if (!logo) return;
  const abs = resolvePath(logo);
  if (!abs || !fs.existsSync(abs)) return;
  const placement = opts.placement || brand.logoPlacement || 'footer_right';
  const size = opts.size || 0.42;
  let x = SLIDE_W - M.right - size;
  let y = SLIDE_H - 0.44;
  if (placement === 'title') { x = M.left; y = 6.48; }
  if (placement === 'top_right') { x = SLIDE_W - M.right - size; y = 0.36; }
  if (placement === 'footer_left') { x = M.left; y = SLIDE_H - 0.44; }
  try {
    const box = { x, y, w: size, h: size * 0.42 };
    slide.addImage({ path: abs, ...getImageContainPlacement(abs, box) });
  } catch (_) {}
}

function addFooter(slide, theme, slideNumber) {
  if (!theme.style.useFooter) return;
  const MX = getMargins(theme);
  slide.addShape('line', { x: MX.left, y: SLIDE_H - 0.52, w: SLIDE_W - MX.left - MX.right, h: 0, line: { color: theme.colors.border || 'DDE6F0', transparency: 10, width: 0.55 } });
  slide.addText(theme.style.footerText || '', { x: MX.left, y: SLIDE_H - 0.35, w: 6.75, h: 0.16, fontFace: theme.fonts.body, fontSize: 7.5, color: theme.colors.muted, margin: 0 });
  if (theme.brand?.footerLogo) addBrandMark(slide, theme, { placement: theme.brand.logoPlacement || 'footer_right', size: 0.46 });
  slide.addText(String(slideNumber).padStart(2, '0'), { x: SLIDE_W - MX.right - (theme.brand?.footerLogo ? 1.12 : 0.55), y: SLIDE_H - 0.35, w: 0.55, h: 0.16, align: 'right', fontFace: theme.fonts.body, fontSize: 7.5, bold: true, color: theme.colors.primary, margin: 0 });
}

function getTextStyle(slideData, role = 'standard', theme) {
  return typography(slideData, role, theme);
}

function addEyebrow(slide, text, theme, opts = {}) {
  if (!text) return;
  slide.addText(String(text).toUpperCase(), { x: opts.x ?? M.left, y: opts.y ?? 0.35, w: opts.w ?? 6.0, h: opts.h ?? 0.18, fontFace: theme.fonts.body, fontSize: opts.fontSize ?? 8.2, bold: true, color: opts.color ?? theme.colors.secondary, charSpace: 1.1, margin: 0, fit: 'shrink' });
}

function addTitle(slide, title, theme, style, opts = {}) {
  if (opts.eyebrow) addEyebrow(slide, opts.eyebrow, theme, { x: opts.x ?? M.left, y: (opts.y ?? 0.56) - 0.28 });
  slide.addText(title || '', { x: opts.x ?? M.left, y: opts.y ?? 0.56, w: opts.w ?? SLIDE_W - M.left - M.right, h: opts.h ?? 0.55, fontFace: theme.fonts.heading, fontSize: opts.fontSize ?? style.title, bold: true, color: opts.color ?? theme.colors.dark, margin: 0, breakLine: false, fit: 'shrink' });
  if (opts.rule !== false) {
    slide.addShape('rect', { x: opts.x ?? M.left, y: (opts.y ?? 0.56) + (opts.h ?? 0.55) + 0.115, w: 0.74, h: 0.043, fill: { color: opts.ruleColor ?? theme.colors.accent }, line: { color: opts.ruleColor ?? theme.colors.accent, transparency: 100 } });
  }
}

function addBody(slide, text, theme, style, opts = {}) {
  if (!text) return;
  slide.addText(String(text), { x: opts.x, y: opts.y, w: opts.w, h: opts.h, fontFace: theme.fonts.body, fontSize: opts.fontSize ?? style.body, color: opts.color ?? theme.colors.dark, valign: opts.valign ?? 'top', margin: opts.margin ?? 0.02, fit: 'shrink', breakLine: false, paraSpaceAfterPt: opts.paraSpaceAfterPt ?? 3 });
}

function addBullets(slide, bullets = [], theme, style, opts = {}) {
  if (!Array.isArray(bullets) || bullets.length === 0) return;
  const prefix = opts.numbered ? null : '• ';
  const text = bullets.map((bullet, idx) => `${prefix || `${idx + 1}. `}${String(bullet)}`).join('\n');
  slide.addText(text, { x: opts.x, y: opts.y, w: opts.w, h: opts.h, fontFace: theme.fonts.body, fontSize: opts.fontSize ?? style.bullet, color: opts.color ?? theme.colors.dark, fit: 'shrink', margin: opts.margin ?? 0.035, breakLine: false, paraSpaceAfterPt: opts.paraSpaceAfterPt ?? style.bulletGapPt, breakLine: false });
}

function addCard(slide, theme, opts = {}) {
  const fill = opts.fill || theme.colors.surface || theme.colors.white;
  const line = opts.line || theme.colors.border || 'DDE6F0';
  slide.addShape('roundRect', { x: opts.x, y: opts.y, w: opts.w, h: opts.h, rectRadius: opts.rectRadius ?? theme.style.cornerRadius, fill: { color: fill, transparency: opts.transparency ?? 0 }, line: { color: line, transparency: opts.lineTransparency ?? 0, width: opts.lineWidth ?? 0.7 }, shadow: opts.shadow === false || theme.style.cardShadow === false ? undefined : { type: 'outer', color: 'C9D3DF', opacity: 0.13, blur: 1.1, angle: 45, distance: 1 } });
}

function addCardHeader(slide, text, theme, box, opts = {}) {
  slide.addText(text || '', { x: box.x, y: box.y, w: box.w, h: opts.h ?? 0.34, fontFace: theme.fonts.heading, fontSize: opts.fontSize ?? 15, bold: true, color: opts.color ?? theme.colors.primary, margin: 0, fit: 'shrink' });
}

function getImageCoverPlacement(imagePath, box) {
  try {
    const dim = imageSize(fs.readFileSync(imagePath));
    const aspect = dim.width / dim.height;
    const boxAspect = box.w / box.h;
    if (!aspect || !isFinite(aspect)) return { x: box.x, y: box.y, w: box.w, h: box.h };
    let cropXFrac = 0;
    let cropYFrac = 0;
    let cropWFrac = 1;
    let cropHFrac = 1;
    if (aspect >= boxAspect) {
      cropWFrac = boxAspect / aspect;
      cropXFrac = (1 - cropWFrac) / 2;
    } else {
      cropHFrac = aspect / boxAspect;
      cropYFrac = (1 - cropHFrac) / 2;
    }
    let virtualW = box.w / cropWFrac;
    let virtualH = virtualW / aspect;
    const eps = 1e-6;
    if (Math.abs(virtualH * cropHFrac - box.h) > eps) {
      virtualH = box.h / cropHFrac;
      virtualW = virtualH * aspect;
    }
    return { x: box.x, y: box.y, w: virtualW, h: virtualH, sizing: { type: 'crop', x: cropXFrac * virtualW, y: cropYFrac * virtualH, w: box.w, h: box.h } };
  } catch (_) {
    return { x: box.x, y: box.y, w: box.w, h: box.h };
  }
}

function getImageContainPlacement(imagePath, box) {
  try {
    const dim = imageSize(fs.readFileSync(imagePath));
    const aspect = dim.width / dim.height;
    const boxAspect = box.w / box.h;
    if (!aspect || !isFinite(aspect)) return { x: box.x, y: box.y, w: box.w, h: box.h };
    if (aspect >= boxAspect) {
      const w = box.w;
      const h = w / aspect;
      return { x: box.x, y: box.y + (box.h - h) / 2, w, h };
    }
    const h = box.h;
    const w = h * aspect;
    return { x: box.x + (box.w - w) / 2, y: box.y, w, h };
  } catch (_) {
    return { x: box.x, y: box.y, w: box.w, h: box.h };
  }
}

function normalizeImageInput(imageInput) {
  if (!imageInput) return { path: null, role: null };
  if (typeof imageInput === 'string') return { path: imageInput, role: null };
  if (typeof imageInput === 'object') return { path: imageInput.path || imageInput.src || imageInput.file || null, role: imageInput.role || imageInput.imageRole || null, meta: imageInput.meta || imageInput.imageMeta };
  return { path: null, role: null };
}

function imageRoleOptions(role, theme = {}) {
  if (!role) return {};
  return (theme.imageRoles && theme.imageRoles[role]) || {};
}

function addImageOverlay(slide, theme, box, opts = {}) {
  if (!opts.overlay) return;
  slide.addShape('rect', { x: box.x, y: box.y, w: box.w, h: box.h, fill: { color: opts.overlayColor || theme.colors.dark, transparency: opts.overlayTransparency ?? 38 }, line: { transparency: 100 } });
}

function addMissingImagePlaceholder(slide, theme, box, label = 'Image placeholder') {
  slide.addShape('roundRect', { ...box, rectRadius: theme.style.cornerRadius, fill: { color: 'EEF3F8' }, line: { color: 'C8D3E0', dash: 'dash', width: 1 } });
  slide.addShape('rect', { x: box.x + 0.25, y: box.y + 0.25, w: box.w - 0.5, h: box.h - 0.5, fill: { color: 'FFFFFF', transparency: 100 }, line: { color: 'D8E1EC', dash: 'dash', transparency: 15 } });
  slide.addText(label, { x: box.x + 0.25, y: box.y + box.h / 2 - 0.13, w: box.w - 0.5, h: 0.28, align: 'center', fontFace: theme.fonts.body, fontSize: 10, color: theme.colors.muted, italic: true, margin: 0 });
}

function addImageSafe(slide, imageInput, theme, box, opts = {}) {
  const normalized = normalizeImageInput(imageInput);
  const roleOpts = imageRoleOptions(opts.role || normalized.role, theme);
  opts = { ...roleOpts, ...opts };
  const absPath = resolvePath(normalized.path);
  if (!absPath || !fs.existsSync(absPath)) {
    addMissingImagePlaceholder(slide, theme, box, opts.placeholder || 'Image missing');
    return false;
  }
  const rounded = opts.rounded !== false;
  const fit = opts.fit || opts.objectFit || (opts.crop === false ? 'contain' : (opts.crop === true ? 'cover' : (theme.assets?.defaultFit || 'cover')));
  const padding = opts.padding || 0;
  const inner = padding ? { x: box.x + padding, y: box.y + padding, w: box.w - padding * 2, h: box.h - padding * 2 } : box;
  if (rounded) {
    addCard(slide, theme, { ...box, fill: opts.background || theme.colors.white, line: opts.line || theme.colors.border || 'E5EAF1', shadow: opts.shadow !== false });
  }
  const imageBoxForOverlay = inner;
  if (fit === 'contain') {
    if (opts.containBackground !== false) {
      slide.addShape(rounded ? 'roundRect' : 'rect', { x: inner.x, y: inner.y, w: inner.w, h: inner.h, rectRadius: rounded ? theme.style.cornerRadius : undefined, fill: { color: opts.background || theme.colors.surfaceAlt || 'EEF3F8' }, line: { color: opts.background || theme.colors.surfaceAlt || 'EEF3F8', transparency: 100 } });
    }
    slide.addImage({ path: absPath, ...getImageContainPlacement(absPath, inner) });
  } else if (fit === 'stretch') {
    slide.addImage({ path: absPath, x: inner.x, y: inner.y, w: inner.w, h: inner.h });
  } else {
    slide.addImage({ path: absPath, ...getImageCoverPlacement(absPath, inner) });
  }
  addImageOverlay(slide, theme, imageBoxForOverlay, opts);
  return true;
}

function addCaption(slide, caption, theme, box) {
  if (!caption) return;
  slide.addText(caption, { x: box.x, y: box.y + box.h + 0.08, w: box.w, h: 0.22, fontFace: theme.fonts.body, fontSize: 8, color: theme.colors.muted, italic: true, margin: 0, fit: 'shrink' });
}

function addSpeakerNotes(slide, notes) {
  if (!notes) return;
  const text = Array.isArray(notes) ? notes.join('\n') : String(notes);
  if (typeof slide.addNotes === 'function') slide.addNotes(text);
}

function addIconBadge(slide, theme, icon, box, opts = {}) {
  const icons = { target: '◎', shield: '◆', check: '✓', warning: '!', idea: '✦', data: '▦', process: '➜', people: '◉', chart: '▥', question: '?' };
  const glyph = icons[icon] || icon || '•';
  slide.addShape('ellipse', { x: box.x, y: box.y, w: box.w, h: box.h, fill: { color: opts.fill || theme.colors.primary }, line: { color: opts.fill || theme.colors.primary, transparency: 100 } });
  slide.addText(String(glyph), { x: box.x, y: box.y + box.h * 0.23, w: box.w, h: box.h * 0.35, align: 'center', fontFace: theme.fonts.heading, fontSize: opts.fontSize || 12, bold: true, color: opts.color || theme.colors.white, margin: 0, fit: 'shrink' });
}

function addTag(slide, text, theme, box, opts = {}) {
  if (!text) return;
  slide.addShape('roundRect', { x: box.x, y: box.y, w: box.w, h: box.h, rectRadius: 0.08, fill: { color: opts.fill || theme.colors.surfaceAlt || 'EEF3F8' }, line: { color: opts.line || theme.colors.border || 'DDE6F0', transparency: 15 } });
  slide.addText(String(text).toUpperCase(), { x: box.x + 0.08, y: box.y + 0.055, w: box.w - 0.16, h: box.h - 0.08, align: 'center', fontFace: theme.fonts.body, fontSize: opts.fontSize || 7.4, bold: true, color: opts.color || theme.colors.primary, margin: 0, fit: 'shrink' });
}

function addStat(slide, theme, stat, box, opts = {}) {
  addCard(slide, theme, { ...box, fill: opts.fill || theme.colors.white, line: opts.line || theme.colors.border });
  slide.addText(String(stat.value || ''), { x: box.x + 0.22, y: box.y + 0.28, w: box.w - 0.44, h: 0.55, fontFace: theme.fonts.heading, fontSize: opts.valueSize || 27, bold: true, color: opts.color || theme.colors.primary, margin: 0, fit: 'shrink' });
  slide.addText(String(stat.label || stat.title || ''), { x: box.x + 0.24, y: box.y + 0.95, w: box.w - 0.48, h: 0.48, fontFace: theme.fonts.body, fontSize: opts.labelSize || 11.2, color: theme.colors.dark, margin: 0, fit: 'shrink' });
  if (stat.note) slide.addText(String(stat.note), { x: box.x + 0.24, y: box.y + 1.42, w: box.w - 0.48, h: 0.32, fontFace: theme.fonts.body, fontSize: 8.4, color: theme.colors.muted, margin: 0, fit: 'shrink' });
}

function applyStandardSlide(slide, theme, slideNumber, opts = {}) {
  addSlideBackground(slide, theme, opts.background || theme.colors.light);
  addSoftBackdrop(slide, theme);
  if (opts.accent !== false && theme.style.accentBar !== false) addTopAccent(slide, theme, opts.accentColor || theme.colors.primary);
  addFooter(slide, theme, slideNumber);
}

module.exports = { SLIDE_W, SLIDE_H, M, getMargins, addSlideBackground, addTopAccent, addSoftBackdrop, addFooter, addBrandMark, addTitle, addEyebrow, addBody, addBullets, addCard, addCardHeader, addImageSafe, getImageCoverPlacement, getImageContainPlacement, addCaption, addTag, addStat, addSpeakerNotes, addIconBadge, applyStandardSlide, getTextStyle };
