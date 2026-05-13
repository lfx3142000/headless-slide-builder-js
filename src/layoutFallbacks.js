function cloneJson(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

function hasItems(value) {
  return Array.isArray(value) && value.length > 0;
}

function normalizeToBullets(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (typeof item === 'string') return item;
    return [item.title, item.body, ...(item.bullets || [])].filter(Boolean).join(' — ');
  }).filter(Boolean);
}

function applyLayoutFallbacks(content, theme) {
  const planned = cloneJson(content);
  const events = [];
  planned.slides = (planned.slides || []).map((slide, idx) => {
    const next = { ...slide, design: { ...(slide.design || {}) } };
    const before = next.type;
    const reason = [];
    if (next.type === 'three_cards' && !hasItems(next.cards)) {
      next.type = 'content';
      next.bullets = normalizeToBullets(next.cards || next.bullets || []);
      reason.push('three_cards had no cards');
    } else if (next.type === 'three_cards' && next.cards.length < 3) {
      next.type = next.cards.length === 2 ? 'two_column' : 'content';
      if (next.type === 'two_column') {
        next.leftTitle = next.cards[0]?.title || 'Option 1';
        next.leftBullets = next.cards[0]?.bullets || [next.cards[0]?.body].filter(Boolean);
        next.rightTitle = next.cards[1]?.title || 'Option 2';
        next.rightBullets = next.cards[1]?.bullets || [next.cards[1]?.body].filter(Boolean);
      } else {
        next.bullets = normalizeToBullets(next.cards || []);
      }
      reason.push(`three_cards had only ${next.cards?.length || 0} cards`);
    }
    if ((next.type === 'image_left' || next.type === 'image_right' || next.type === 'full_bleed_image') && !next.image) {
      next.type = next.type === 'full_bleed_image' ? 'section' : 'content';
      next.bullets = next.bullets || [];
      reason.push('image layout had no resolved image');
    }
    if (next.type === 'image_grid' && !hasItems(next.images)) {
      next.type = 'content';
      next.bullets = next.bullets || ['Image gallery content will appear here after images are provided.'];
      reason.push('image_grid had no images');
    }
    if (next.type === 'comparison' && !hasItems(next.leftBullets) && !hasItems(next.rightBullets)) {
      next.type = 'content';
      next.bullets = next.bullets || [next.leftTitle, next.rightTitle].filter(Boolean);
      reason.push('comparison had no comparison bullets');
    }
    if ((next.type === 'table' || next.type === 'compliance_matrix') && !hasItems(next.rows)) {
      next.type = 'content';
      next.bullets = next.bullets || ['Table rows were not provided.'];
      reason.push('table layout had no rows');
    }
    if ((next.type === 'bar_chart' || next.type === 'line_chart') && !hasItems(next.data)) {
      next.type = 'content';
      next.bullets = next.bullets || ['Chart data was not provided.'];
      reason.push('chart layout had no data');
    }
    if (before !== next.type) {
      next.design.fallbackApplied = { from: before, to: next.type, reason: reason.join('; ') };
      events.push(`Slide ${idx + 1}${next.title ? ` (${next.title})` : ''}: ${before} → ${next.type} (${reason.join('; ')})`);
    }
    return next;
  });
  planned._layoutFallbacks = { generatedBy: 'src/layoutFallbacks.js', count: events.length, events };
  return planned;
}

module.exports = { applyLayoutFallbacks };
