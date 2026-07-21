function count(value) {
  return Array.isArray(value) ? value.length : 0;
}

function len(value) {
  if (!value) return 0;
  if (Array.isArray(value)) return value.reduce((sum, item) => sum + len(item), 0);
  if (typeof value === 'object') return Object.values(value).reduce((sum, item) => sum + len(item), 0);
  return String(value).length;
}

function isDivider(slide) {
  return ['title', 'section', 'module_intro', 'closing', 'references'].includes(slide.type);
}

function hasVisual(slide) {
  return Boolean(
    slide.image ||
    count(slide.images) ||
    ['bar_chart', 'line_chart', 'metric_grid', 'big_number', 'process', 'timeline', 'image_left', 'image_right', 'full_bleed_image', 'image_grid'].includes(slide.type)
  );
}

function isTextHeavy(slide) {
  const chars = len([slide.title, slide.subtitle, slide.body, slide.bullets, slide.leftBullets, slide.rightBullets, slide.cards, slide.rows]);
  const itemCount = count(slide.bullets) + count(slide.leftBullets) + count(slide.rightBullets) + count(slide.cards) + count(slide.rows);
  return chars > 780 || itemCount > 8;
}

function slideLabel(slide, index) {
  return `Slide ${index + 1}${slide.title ? ` (${slide.title})` : ''}`;
}

function collectImagePaths(slide) {
  const paths = [];
  const normalize = (value) => {
    if (!value) return null;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') return value.path || value.src || value.url || null;
    return null;
  };
  const single = normalize(slide.image);
  if (single) paths.push(single);
  if (Array.isArray(slide.images)) {
    slide.images.map(normalize).filter(Boolean).forEach((imagePath) => paths.push(imagePath));
  }
  return paths;
}

function analyzeVisualQuality(content, theme = {}) {
  const slides = content.slides || [];
  const issues = [];
  const strengths = [];
  const checks = {
    longTitles: 0,
    textHeavySlides: 0,
    repeatedImageUses: 0,
    textOnlyRuns: 0,
    missingDividerVisuals: 0,
    slidesWithVisuals: 0
  };

  let textOnlyRun = [];
  const imageUses = new Map();

  slides.forEach((slide, index) => {
    const label = slideLabel(slide, index);
    if (String(slide.title || '').length > 72) {
      checks.longTitles += 1;
      issues.push(`${label}: title is long enough to risk weak hierarchy or wrapping.`);
    }
    if (isTextHeavy(slide)) {
      checks.textHeavySlides += 1;
      issues.push(`${label}: high content density may need a split, stronger hierarchy, or more speaker-note detail.`);
    }
    if (hasVisual(slide)) checks.slidesWithVisuals += 1;
    if (!isDivider(slide) && !hasVisual(slide)) {
      textOnlyRun.push(index);
    } else {
      if (textOnlyRun.length >= 3) {
        checks.textOnlyRuns += 1;
        issues.push(`Slides ${textOnlyRun[0] + 1}-${textOnlyRun[textOnlyRun.length - 1] + 1}: ${textOnlyRun.length} text-only slides in a row may flatten visual rhythm.`);
      }
      textOnlyRun = [];
    }
    if (['title', 'section'].includes(slide.type) && theme.designTokens?.imageStyle === 'editorial' && !slide.image) {
      checks.missingDividerVisuals += 1;
      issues.push(`${label}: editorial ${slide.type} slide has no image, which can make the deck feel template-like.`);
    }
    if (slide.type === 'image_grid' || slide.allowImageReuse || slide.design?.allowImageReuse) return;
    collectImagePaths(slide).forEach((imagePath) => {
      const normalized = String(imagePath).toLowerCase();
      const uses = imageUses.get(normalized) || [];
      uses.push(index + 1);
      imageUses.set(normalized, uses);
    });
  });

  if (textOnlyRun.length >= 3) {
    checks.textOnlyRuns += 1;
    issues.push(`Slides ${textOnlyRun[0] + 1}-${textOnlyRun[textOnlyRun.length - 1] + 1}: ${textOnlyRun.length} text-only slides in a row may flatten visual rhythm.`);
  }

  [...imageUses.entries()].forEach(([imagePath, uses]) => {
    if (uses.length > 1) {
      checks.repeatedImageUses += uses.length - 1;
      issues.push(`Image '${imagePath}' is reused on slides ${uses.join(', ')}; repeated visuals should be intentional.`);
    }
  });

  const visualRatio = slides.length ? checks.slidesWithVisuals / slides.length : 0;
  if (visualRatio >= 0.45) strengths.push('Healthy visual rhythm across the deck.');
  if (!checks.longTitles) strengths.push('Slide titles fit the hierarchy budget.');
  if (!checks.textOnlyRuns) strengths.push('No long runs of purely text-only body slides detected.');
  if (!checks.repeatedImageUses) strengths.push('No repeated local image use detected.');

  const penalty =
    checks.longTitles * 4 +
    checks.textHeavySlides * 5 +
    checks.textOnlyRuns * 6 +
    checks.repeatedImageUses * 3 +
    checks.missingDividerVisuals * 5;
  const score = Math.max(0, Math.min(100, 100 - penalty));

  return { score, issues, strengths, checks, visualRatio: Number(visualRatio.toFixed(2)) };
}

module.exports = { analyzeVisualQuality };
