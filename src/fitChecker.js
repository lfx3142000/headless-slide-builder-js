function len(value) {
  if (!value) return 0;
  if (Array.isArray(value)) return value.reduce((sum, item) => sum + len(item), 0);
  if (typeof value === 'object') return Object.values(value).reduce((sum, item) => sum + len(item), 0);
  return String(value).length;
}
function count(value) { return Array.isArray(value) ? value.length : 0; }
function analyzeSlideFit(content) {
  const warnings = [];
  if (!content || !Array.isArray(content.slides)) return warnings;
  content.slides.forEach((slide, i) => {
    const label = `Slide ${i + 1}${slide.title ? ` (${slide.title})` : ''}`;
    const totalChars = len([slide.title, slide.subtitle, slide.body, slide.bullets, slide.leftBullets, slide.rightBullets, slide.steps, slide.cards, slide.rows]);
    const maxBullets = Math.max(count(slide.bullets), count(slide.leftBullets), count(slide.rightBullets), count(slide.steps));
    if (String(slide.title || '').length > 85) warnings.push(`${label}: long title may need a shorter title or smaller title treatment.`);
    if (maxBullets > 8) warnings.push(`${label}: many bullets/steps (${maxBullets}). Consider moving detail to speakerNotes.`);
    if (totalChars > 1100) warnings.push(`${label}: very text-heavy (${totalChars} chars). The builder will shrink text, but the slide may feel crowded.`);
    if (slide.type === 'table' && count(slide.rows) > 8) warnings.push(`${label}: table has more than 8 rows; extra rows may not render in the current layout.`);
    if (slide.type === 'image_grid' && count(slide.images) > 4) warnings.push(`${label}: image_grid displays up to 4 images.`);
    if (slide.type === 'risk_matrix' && count(slide.items) > 12) warnings.push(`${label}: risk_matrix is best with 12 or fewer items.`);
    if ((slide.type === 'bar_chart' || slide.type === 'line_chart') && count(slide.data) > 8) warnings.push(`${label}: chart has many data points; labels may be tight.`);
  });
  return warnings;
}
module.exports = { analyzeSlideFit };
