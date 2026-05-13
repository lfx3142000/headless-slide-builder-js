function cloneJson(value) { return JSON.parse(JSON.stringify(value || {})); }

function slugify(value, fallback) {
  const slug = String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);
  return slug || fallback;
}

function ensureSlideIds(content) {
  const planned = cloneJson(content);
  const seen = new Map();
  planned.slides = (planned.slides || []).map((slide, idx) => {
    const base = slide.id || slugify(slide.title || `${slide.type}-${idx + 1}`, `slide-${idx + 1}`);
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;
    return {
      ...slide,
      id,
      revision: {
        ...(slide.revision || {}),
        trackedBy: 'src/revisionTracker.js',
        stableId: id,
        slideType: slide.type
      }
    };
  });
  planned._revisionTracking = { generatedBy: 'src/revisionTracker.js', slideIdsAssigned: planned.slides.length };
  return planned;
}

module.exports = { ensureSlideIds };
